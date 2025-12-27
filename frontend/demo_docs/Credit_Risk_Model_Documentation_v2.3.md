# Credit Risk Model Documentation v2.3

**Model Name:** CRM-2024-ALPHA
**Owner:** Credit Risk Analytics Team
**Last Updated:** 2024-01-15
**Status:** Production

## 1. Executive Summary
The CRM-2024-ALPHA model is a logistic regression-based scorecard designed to predict the probability of default (PD) for retail loan applicants over a 12-month horizon. The model was developed using historical loan performance data from 2019-2023.

## 2. Model Purpose and Scope
*   **Purpose:** To automate credit decisioning for unsecured personal loans.
*   **Scope:** Retail customers in the North American market with credit scores between 600 and 850.
*   **Limitations:** The model is not calibrated for small business loans or mortgage products.

## 3. Data Sources and Features
The model utilizes the following key features:
1.  **FICO Score:** Sourced from Equifax.
2.  **Debt-to-Income Ratio (DTI):** Calculated from applicant income and existing debt obligations.
3.  **Utilization Rate:** Percentage of available credit currently in use.
4.  **Payment History:** Number of delinquencies in the past 24 months.

### 3.1 Data Quality
Data quality checks are performed daily. Missing values for income are imputed using the median income of the applicant's zip code.

## 4. Model Methodology
The model uses a logistic regression framework. The log-odds of default are modeled as a linear combination of the input features.

$$ \ln(\frac{p}{1-p}) = \beta_0 + \beta_1 X_1 + ... + \beta_n X_n $$

## 5. Performance Metrics
*   **Gini Coefficient:** 0.45 (Validation Set)
*   **KS Statistic:** 38.2
*   **AUC:** 0.78

## 6. Risks and Mitigations
*   **Model Drift:** Economic downturns may affect the stability of the DTI feature.
    *   *Mitigation:* Quarterly monitoring of feature distributions.
*   **Bias:** Potential disparate impact on younger demographics due to limited credit history.
    *   *Mitigation:* Regular fair lending analysis using disparate impact ratio (DIR).
