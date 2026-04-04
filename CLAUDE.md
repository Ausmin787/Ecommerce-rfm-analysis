# E-commerce Customer Segmentation — RFM + K-Means Clustering

## Project Goal
Segment customers of a UK-based online retailer using RFM (Recency, Frequency, Monetary) analysis and K-Means clustering. Identify high-value, at-risk, and lost customer segments to drive actionable business recommendations.

## Dataset
- Source: Online Retail II (UCI via Kaggle)
- File: online_retail_II.xlsx
- Size: ~1M transactions, 2009-2011
- Key columns: CustomerID, InvoiceDate, Quantity, Price, Invoice, Country

## Status
- [x] Exploration
- [x] Cleaning
- [x] RFM Feature Engineering
- [x] K-Means Clustering
- [x] Visualizations
- [x] README
- [x] GitHub Push

Project Status: COMPLETE (April 4, 2026)

## Key Results
- 5,350 UK customers segmented into 4 clusters
- Champions (18.8%) generate 71% of total revenue
- Lapsing segment (£2.71M) = highest-priority winback target
- Lost = 35.4% of customer base — do not invest here
- Log-transform was critical: Monetary skewness was 28.97
- K=4 selected via elbow method + silhouette score (0.37)

GitHub: https://github.com/Ausmin787/Ecommerce-rfm-analysis

## Key Decisions
- Use K-Means clustering (not hierarchical) for scalability
- Exclude returns (negative Quantity) from RFM calculation
- Focus on UK customers only (largest segment)

## Watch Out For
- Negative quantities = returns, must be filtered
- CustomerID has missing values — drop those rows
- Monetary value = Quantity × Price per transaction