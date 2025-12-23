# Model Card: Credit Risk Assessment Model

**Model Name:** CreditRisk-XGB-v2.1  
**Version:** 2.1.0  
**Date:** 2024-01-15  
**Model Type:** XGBoost Gradient Boosting Classifier

## Model Overview

This model predicts the probability of credit default for consumer loan applications. It is deployed in the loan origination system to support credit decisioning for personal loans ranging from $5,000 to $50,000.

## Intended Use

### Primary Use Case
- **Application:** Consumer credit risk assessment
- **Decision Type:** Binary classification (approve/deny)
- **Target Population:** US residents aged 21-75 applying for personal loans
- **Decision Threshold:** 0.35 (probability of default)

### Out-of-Scope Uses
- Commercial lending
- Mortgage underwriting
- International applicants
- Loans outside $5K-$50K range

## Model Architecture

### Algorithm
- **Type:** XGBoost (Extreme Gradient Boosting)
- **Framework:** XGBoost 1.7.3
- **Training:** 500 trees, max depth 6, learning rate 0.05

### Features (23 total)

**Financial Features:**
- Annual income
- Debt-to-income ratio
- Current loan balances
- Credit utilization ratio
- Number of open credit accounts

**Credit History:**
- Credit score (FICO)
- Length of credit history (months)
- Number of delinquencies (past 2 years)
- Number of hard inquiries (past 6 months)
- Bankruptcy flag

**Demographic Features:**
- Age
- Employment length
- Home ownership status
- State of residence
- Zip code (first 3 digits)

**Loan Characteristics:**
- Requested loan amount
- Loan purpose
- Requested term (months)

## Training Data

### Dataset
- **Source:** Internal loan portfolio (2018-2022)
- **Size:** 450,000 loan applications
- **Positive Class:** 12.3% (default rate)
- **Time Period:** January 2018 - December 2022

### Data Quality
- Missing values: < 2% per feature
- Outliers: Winsorized at 1st and 99th percentiles
- Class imbalance: Addressed via SMOTE oversampling

## Performance Metrics

### Overall Performance
- **AUC-ROC:** 0.847
- **Precision:** 0.723
- **Recall:** 0.681
- **F1-Score:** 0.701
- **Accuracy:** 0.892

### Performance by Subgroups
Performance varies across demographic groups (see Bias & Fairness Report for detailed analysis).

## Feature Importance

### Top 5 Most Important Features
1. Credit score (FICO) - 28.3%
2. Debt-to-income ratio - 18.7%
3. Annual income - 14.2%
4. Number of delinquencies - 12.1%
5. Credit utilization ratio - 9.8%

### Sensitive Features
- Age: 3.2% importance
- Zip code: 2.1% importance
- State: 1.4% importance

## Model Limitations

### Known Limitations
1. **Data Recency:** Training data ends December 2022; may not reflect current economic conditions
2. **Geographic Bias:** Underrepresented states (AK, HI, WY) have limited training samples
3. **Income Verification:** Model assumes self-reported income is accurate
4. **Economic Shifts:** Performance may degrade during economic downturns not seen in training data

### Edge Cases
- Applicants with thin credit files (< 6 months history)
- Recent immigrants with no US credit history
- Self-employed applicants with variable income
- Applicants with recent major life events (bankruptcy, foreclosure)

## Monitoring & Maintenance

### Monitoring Metrics
- Weekly AUC-ROC tracking
- Monthly feature distribution monitoring
- Quarterly fairness metric evaluation
- Real-time prediction latency monitoring

### Retraining Schedule
- **Frequency:** Quarterly
- **Trigger Conditions:** 
  - AUC drops below 0.82
  - Significant distribution shift detected
  - Fairness metrics degrade beyond thresholds

## Ethical Considerations

### Fairness
Model undergoes quarterly fairness audits across protected groups. See separate Bias & Fairness Report for detailed analysis.

### Transparency
Applicants receive adverse action notices with primary factors contributing to denial decisions.

### Privacy
Model does not use protected class information (race, gender, religion) as direct features.

## Approval & Governance

- **Model Owner:** Risk Analytics Team
- **Validator:** Independent Model Validation Group
- **Approval Date:** 2024-01-15
- **Next Review:** 2024-04-15
- **Regulatory Compliance:** SR 11-7 (Model Risk Management)
