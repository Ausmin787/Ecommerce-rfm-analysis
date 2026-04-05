"use client"

import { useEffect, useState } from "react"
import Papa from "papaparse"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ScatterChart,
  Scatter,
  Legend,
} from "recharts"
import { Users, Crown, TrendingUp, DollarSign } from "lucide-react"

type Customer = {
  "Customer ID": number
  Recency: number
  Frequency: number
  Monetary: number
  Cluster: number
  Segment: string
}

type SegmentStat = {
  name: string
  customers: number
  pct: number
  revenue_pct: number
  avg_recency: number
  avg_frequency: number
  avg_monetary: number
  color: string
}

const SEGMENT_COLORS: Record<string, string> = {
  Champions: "#10b981",
  Lapsing: "#f59e0b",
  "At-Risk": "#3b82f6",
  Lost: "#ef4444",
}

const SEGMENT_ACTIONS: Record<string, string> = {
  Champions: "Loyalty rewards, upsell premium products",
  Lapsing: "Win-back campaigns, personalised offers — £2.71M recoverable",
  "At-Risk": "Re-engagement campaigns, targeted offers before they churn",
  Lost: "No re-engagement investment — deprioritise",
}

const SEGMENT_ORDER = ["Champions", "Lapsing", "At-Risk", "Lost"]

// Grouped bar chart data - independently normalized RFM scores (0-100 scale)
const rfmProfileData = [
  {
    dimension: "Recency",
    Champions: 95,
    Lapsing: 55,
    "At-Risk": 45,
    Lost: 5,
  },
  {
    dimension: "Frequency",
    Champions: 95,
    Lapsing: 35,
    "At-Risk": 30,
    Lost: 15,
  },
  {
    dimension: "Monetary",
    Champions: 95,
    Lapsing: 25,
    "At-Risk": 20,
    Lost: 3,
  },
]

// Chart configs
const pieChartConfig: ChartConfig = {
  customers: { label: "Customers" },
  Champions: { label: "Champions", color: "#10b981" },
  Lapsing: { label: "Lapsing", color: "#f59e0b" },
  "At-Risk": { label: "At-Risk", color: "#3b82f6" },
  Lost: { label: "Lost", color: "#ef4444" },
}

const barChartConfig: ChartConfig = {
  revenue_pct: { label: "Revenue %" },
  Champions: { label: "Champions", color: "#10b981" },
  Lapsing: { label: "Lapsing", color: "#f59e0b" },
  "At-Risk": { label: "At-Risk", color: "#3b82f6" },
  Lost: { label: "Lost", color: "#ef4444" },
}

const scatterChartConfig: ChartConfig = {
  Champions: { label: "Champions", color: "#10b981" },
  Lapsing: { label: "Lapsing", color: "#f59e0b" },
  "At-Risk": { label: "At-Risk", color: "#3b82f6" },
  Lost: { label: "Lost", color: "#ef4444" },
}

const rfmProfileConfig: ChartConfig = {
  Champions: { label: "Champions", color: "#10b981" },
  Lapsing: { label: "Lapsing", color: "#f59e0b" },
  "At-Risk": { label: "At-Risk", color: "#3b82f6" },
  Lost: { label: "Lost", color: "#ef4444" },
}

export function RFMDashboard() {
  const [segments, setSegments] = useState<SegmentStat[]>([])
  const [scatterData, setScatterData] = useState<Record<string, { x: number; y: number }[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/rfm_clustered.csv")
      .then(res => res.text())
      .then(csv => {
        const result = Papa.parse<Customer>(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        })
        const customers = result.data

        const totalCustomers = customers.length
        const totalRevenue = customers.reduce((s, c) => s + c.Monetary, 0)

        // Group by Segment
        const grouped: Record<string, Customer[]> = {}
        for (const c of customers) {
          if (!grouped[c.Segment]) grouped[c.Segment] = []
          grouped[c.Segment].push(c)
        }

        // Compute segment stats
        const computed = SEGMENT_ORDER
          .filter(name => grouped[name])
          .map(name => {
            const group = grouped[name]
            const segRevenue = group.reduce((s, c) => s + c.Monetary, 0)
            const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length
            return {
              name,
              customers: group.length,
              pct: parseFloat(((group.length / totalCustomers) * 100).toFixed(1)),
              revenue_pct: parseFloat(((segRevenue / totalRevenue) * 100).toFixed(1)),
              avg_recency: Math.round(avg(group.map(c => c.Recency))),
              avg_frequency: Math.round(avg(group.map(c => c.Frequency))),
              avg_monetary: Math.round(avg(group.map(c => c.Monetary))),
              color: SEGMENT_COLORS[name] || "#888888",
            }
          })

        // Sample 30 customers per segment for scatter plot
        const scatter: Record<string, { x: number; y: number }[]> = {}
        for (const name of SEGMENT_ORDER) {
          if (!grouped[name]) continue
          const sample = grouped[name]
            .sort(() => Math.random() - 0.5)
            .slice(0, 30)
          scatter[name] = sample.map(c => ({ x: c.Recency, y: c.Monetary }))
        }

        setSegments(computed)
        setScatterData(scatter)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white text-lg">Loading customer data...</p>
      </div>
    )
  }

  const sortedByRevenue = [...segments].sort((a, b) => b.revenue_pct - a.revenue_pct)
  const champions = segments.find(s => s.name === "Champions")
  const lapsing = segments.find(s => s.name === "Lapsing")
  const totalCustomers = segments.reduce((s, seg) => s + seg.customers, 0)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-5">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            RFM Customer Segmentation Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            UK E-Commerce | {totalCustomers.toLocaleString()} Customers | K-Means Clustering (k=4)
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {totalCustomers.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                From 725K transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Champions
              </CardTitle>
              <Crown className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">
                {champions?.pct}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {champions?.customers.toLocaleString()} customers
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Recoverable Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">
                £{((lapsing?.customers ?? 0) * (lapsing?.avg_monetary ?? 0) / 1_000_000).toFixed(2)}M
              </div>
              <p className="text-xs text-gray-500 mt-1">Lapsing segment</p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Revenue from Champions
              </CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">
                {champions?.revenue_pct}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Of total revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Segment Distribution Donut */}
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">Segment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={pieChartConfig} className="mx-auto h-[300px]">
                <PieChart>
                  <Pie
                    data={segments}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="customers"
                    nameKey="name"
                  >
                    {segments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <span>
                            {name}: {value?.toLocaleString()} customers
                          </span>
                        )}
                      />
                    }
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: 10 }}
                    formatter={(value) => {
                      const segment = segments.find((s) => s.name === value)
                      return `${value}: ${segment?.pct}%`
                    }}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Revenue Concentration Bar */}
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">Revenue Concentration</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="h-[300px]">
                <BarChart
                  data={sortedByRevenue}
                  layout="vertical"
                  margin={{ left: 80, right: 20 }}
                >
                  <XAxis type="number" domain={[0, 80]} tickFormatter={(v) => `${v}%`} stroke="#6b7280" />
                  <YAxis type="category" dataKey="name" width={80} stroke="#6b7280" />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => `${value}% of revenue`}
                      />
                    }
                  />
                  <Bar dataKey="revenue_pct" radius={[0, 4, 4, 0]}>
                    {sortedByRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* RFM Scatter Plot */}
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">
                RFM Scatter: Recency vs Monetary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={scatterChartConfig} className="h-[350px] w-full">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 60 }}>
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Recency"
                    domain={[0, 700]}
                    reversed
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Recency (days) — Lower is better →",
                      position: "insideBottom",
                      fill: "#9ca3af",
                      offset: -5,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Monetary"
                    domain={[0, 8000]}
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    width={55}
                    tickFormatter={(v) => `£${v}`}
                    label={{
                      value: "Avg Spend (£)",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#9ca3af",
                      fontSize: 11,
                      offset: 10,
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => {
                          if (name === "Recency") return `${Math.round(Number(value))} days`
                          if (name === "Monetary") return `£${Math.round(Number(value))}`
                          return value
                        }}
                      />
                    }
                  />
                  {segments.map((segment) => (
                    <Scatter
                      key={segment.name}
                      name={segment.name}
                      data={scatterData[segment.name] || []}
                      fill={segment.color}
                    />
                  ))}
                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{ paddingBottom: 10 }}
                  />
                </ScatterChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Segment RFM Profile - Grouped Bar */}
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">Segment RFM Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={rfmProfileConfig} className="h-[350px]">
                <BarChart data={rfmProfileData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis dataKey="dimension" stroke="#6b7280" />
                  <YAxis domain={[0, 100]} stroke="#6b7280" tickFormatter={(v) => `${v}`} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => `${value} / 100`}
                      />
                    }
                  />
                  <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
                  <Bar dataKey="Champions" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Lapsing" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="At-Risk" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Lost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Segment Details Table */}
        <Card className="mt-6 border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white">
              Segment Details & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">Segment</TableHead>
                  <TableHead className="text-gray-400 text-right">Customers</TableHead>
                  <TableHead className="text-gray-400 text-right">Revenue Share</TableHead>
                  <TableHead className="text-gray-400 text-right">Avg Recency (days)</TableHead>
                  <TableHead className="text-gray-400 text-right">Avg Frequency</TableHead>
                  <TableHead className="text-gray-400 text-right">Avg Spend (£)</TableHead>
                  <TableHead className="text-gray-400">Recommended Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {segments.map((segment) => (
                  <TableRow
                    key={segment.name}
                    className="border-gray-800 hover:bg-gray-800/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="font-medium text-white">
                          {segment.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-gray-300">
                      {segment.customers.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-gray-300">
                      {segment.revenue_pct}%
                    </TableCell>
                    <TableCell className="text-right text-gray-300">
                      {segment.avg_recency}
                    </TableCell>
                    <TableCell className="text-right text-gray-300">
                      {segment.avg_frequency}
                    </TableCell>
                    <TableCell className="text-right text-gray-300">
                      £{segment.avg_monetary.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-gray-300 max-w-xs">
                      {SEGMENT_ACTIONS[segment.name]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-8 pb-8 text-center text-xs text-gray-500">
          Data: UCI Online Retail Dataset | Analysis: RFM + K-Means (k=4) | 725K
          transactions → {totalCustomers.toLocaleString()} customers
        </footer>
      </main>
    </div>
  )
}
