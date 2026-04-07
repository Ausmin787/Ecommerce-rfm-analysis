![CI](https://github.com/Ausmin787/Ecommerce-rfm-analysis/actions/workflows/ci.yml/badge.svg)

# E-commerce RFM Customer Segmentation

RFM (Recency, Frequency, Monetary) analysis and K-Means clustering applied to 725,000 UK e-commerce transactions to identify Champions, Lapsing, At-Risk, and Lost customer segments — with actionable revenue prioritization for retention and winback campaigns.

## Live Dashboard

🔗 **Interactive Dashboard:** https://dashboard-peach-three-87.vercel.app/

Built with Next.js + Recharts + shadcn/ui + papaparse, deployed on Vercel. Wired to real customer-level RFM data.

## Key Findings

1. **Champions (18.8%):** 1,008 customers, avg spend £10,364 — generate 71% of total revenue
2. **Lapsing (24.8%):** 1,328 customers, avg spend £2,041 — £2.71M recoverable revenue, highest-priority winback target
3. **At-Risk (20.9%):** 1,120 customers, avg spend £835 — bought recently but low frequency, need nurturing
4. **Lost (35.4%):** 1,894 customers, avg spend £333 — lowest retention priority, minimal reinvestment warranted

## Dataset

| Field | Detail |
|-------|--------|
| Source | UCI Machine Learning Repository — Online Retail II dataset |
| Rows | ~1M raw transactions, 725,250 after cleaning |
| Customers | 5,350 UK customers |
| Date Range | December 2009 – December 2011 |
| Scope | UK only (91.9% of all transactions) |

## Tech Stack

- **Analysis:** Python (pandas, scikit-learn, matplotlib, seaborn, NumPy)
- **Clustering:** K-Means (k=4, selected via elbow method + silhouette score 0.370)
- **Dashboard:** Next.js + Recharts + shadcn/ui + papaparse
- **Deployment:** Vercel (dashboard), GitHub Actions (CI)

## Project Structure

```
Ecommerce-rfm-analysis/
├── online_retail_II.csv          # Raw dataset (~1M transactions)
├── online_retail_cleaned.csv     # Cleaned data (725,250 rows)
├── rfm.csv                       # RFM features per customer
├── rfm_clustered.csv             # RFM scores + cluster labels (model output)
├── visuals/                      # All charts and visualizations (PNG)
├── Dashboard/                    # Next.js interactive dashboard source
│   ├── app/                      # Next.js App Router pages
│   ├── components/               # UI components (shadcn/ui + rfm-dashboard)
│   └── public/rfm_clustered.csv  # Data served to the dashboard
├── CLAUDE.md                     # Project context for AI assistants
└── README.md
```

## Visualizations

All charts are in `visuals/`:

| File | Description |
|------|-------------|
| `elbow_curve.png` | Inertia vs k — shows inflection point at k=4 |
| `finding1_segment_distribution.png` | Customer count per segment |
| `finding2_rfm_scatter.png` | RFM scatter plot coloured by cluster |
| `finding3_cluster_heatmap.png` | Normalized RFM feature means per cluster |
| `finding4_revenue_concentration.png` | Revenue share by segment |
| `silhouette_plot.png` | Silhouette scores per cluster |
| `dbscan_kdistance.png` | K-distance plot for DBSCAN comparison |
| `dbscan_vs_kmeans.png` | Side-by-side cluster comparison |
| `cohort_retention.png` | Monthly cohort retention heatmap |

## How to Run

1. Clone the repo:
   ```bash
   git clone https://github.com/Ausmin787/Ecommerce-rfm-analysis.git
   cd Ecommerce-rfm-analysis
   ```
2. Install dependencies:
   ```bash
   pip install pandas scikit-learn matplotlib seaborn numpy openpyxl
   ```
3. Place the raw dataset (`online_retail_II.xlsx` or `.csv`) in the project root
4. Run the analysis notebook/script — outputs saved to `visuals/` and `rfm_clustered.csv`

To run the dashboard locally:
```bash
cd Dashboard
npm install
npm run dev
```

## Author

Data Analyst Portfolio Project — targeting FMCG, e-commerce, and consulting roles.

[GitHub: Ausmin787/Ecommerce-rfm-analysis](https://github.com/Ausmin787/Ecommerce-rfm-analysis)
