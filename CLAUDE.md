# E-commerce Customer Segmentation — RFM + K-Means Clustering

## Project Goal
Segment customers of a UK-based online retailer using RFM (Recency, Frequency, Monetary) analysis and K-Means clustering. Identify high-value, at-risk, and lost customer segments to drive actionable business recommendations.

## Dataset
- Source: Online Retail II (UCI via Kaggle)
- File: online_retail_II.xlsx
- Size: ~1M transactions, 2009-2011
- Key columns: CustomerID, InvoiceDate, Quantity, Price, Invoice, Country

## Status
- [ ] Exploration
- [ ] Cleaning
- [ ] RFM Feature Engineering
- [ ] K-Means Clustering
- [ ] Visualizations
- [ ] README
- [ ] GitHub Push

## Key Decisions
- Use K-Means clustering (not hierarchical) for scalability
- Exclude returns (negative Quantity) from RFM calculation
- Focus on UK customers only (largest segment)

## Watch Out For
- Negative quantities = returns, must be filtered
- CustomerID has missing values — drop those rows
- Monetary value = Quantity × Price per transaction