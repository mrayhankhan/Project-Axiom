# Bias & Fairness Audit Report

**Model:** CreditRisk-XGB-v2.1  
**Report Date:** 2024-01-10  
**Auditor:** ML Fairness & Ethics Team  
**Review Period:** Q4 2023

## Executive Summary

This report presents the results of a comprehensive bias and fairness audit of the CreditRisk-XGB-v2.1 model. The audit evaluated model performance across protected demographic groups and identified areas of potential disparate impact.

**Key Findings:**
- ✅ Model meets fairness thresholds for gender parity
- ⚠️ Age-based disparities detected in approval rates
- ⚠️ Geographic disparities in certain zip codes
- ✅ No evidence of proxy discrimination via credit score

## Methodology

### Protected Groups Analyzed
- **Age:** 21-30, 31-45, 46-60, 61-75
- **Geography:** By state and 3-digit zip code
- **Implicit Proxies:** Credit score, zip code correlation with demographics

### Fairness Metrics
1. **Demographic Parity:** P(approve | group A) ≈ P(approve | group B)
2. **Equal Opportunity:** TPR parity across groups
3. **Predictive Parity:** PPV parity across groups
4. **Disparate Impact Ratio:** min(P(approve|A), P(approve|B)) / max(...)

### Threshold for Concern
- Disparate Impact Ratio < 0.80 (80% rule)
- Statistical significance: p < 0.05

## Feature Fairness Analysis

### High-Risk Features

#### 1. Age
**Finding:** Younger applicants (21-30) have 15% lower approval rates than middle-aged applicants (31-45), even after controlling for creditworthiness.

**Metrics:**
- Approval Rate (21-30): 62.3%
- Approval Rate (31-45): 73.1%
- Disparate Impact Ratio: 0.85
- Statistical Significance: p < 0.001

**Root Cause Analysis:**
- Shorter credit history correlates with age
- Lower average income in younger cohort
- Feature interaction: age × credit_history_length amplifies effect

**Mitigation Recommendation:**
- Consider age-neutral credit history normalization
- Implement minimum sample requirements for age-based decisions
- Add monitoring for age-based approval rate disparities

#### 2. Zip Code
**Finding:** Certain zip codes show systematic approval rate differences not explained by default risk.

**Metrics:**
- 23 zip codes with DIR < 0.80
- Primarily in rural areas and majority-minority urban neighborhoods
- Average DIR for flagged zips: 0.74

**Root Cause Analysis:**
- Zip code correlates with income and credit score
- Underrepresentation in training data (< 100 samples)
- Potential proxy for redlining patterns

**Mitigation Recommendation:**
- Remove zip code as direct feature
- Use broader geographic features (state, region)
- Implement zip-code-level fairness monitoring

### Low-Risk Features

#### Credit Score
**Analysis:** Credit score shows no evidence of proxy discrimination. Performance is consistent across demographic groups when controlling for actual default rates.

**Validation:**
- Calibration analysis shows proper risk ranking
- No systematic over/under-prediction by group
- Feature importance justified by predictive power

## Group-Level Performance Analysis

### Age Groups

| Age Group | Approval Rate | Default Rate | AUC | Precision | Recall |
|-----------|---------------|--------------|-----|-----------|--------|
| 21-30     | 62.3%         | 14.2%        | 0.831 | 0.698 | 0.652 |
| 31-45     | 73.1%         | 11.8%        | 0.854 | 0.735 | 0.691 |
| 46-60     | 71.4%         | 10.9%        | 0.849 | 0.728 | 0.684 |
| 61-75     | 65.7%         | 12.5%        | 0.838 | 0.712 | 0.668 |

**Interpretation:**
- Model performance (AUC) is relatively consistent across age groups
- Approval rate disparities exist but partially explained by actual default rates
- Younger and older applicants face higher rejection rates

### Geographic Analysis

**States with Potential Fairness Concerns:**
- Mississippi: DIR 0.76 (vs. national average)
- Louisiana: DIR 0.78
- New Mexico: DIR 0.79

**Confounding Factors:**
- Lower average credit scores in these states
- Higher actual default rates
- Economic conditions

## Intersectional Analysis

### Age × Geography
Younger applicants in rural zip codes face compounded disadvantage:
- Approval rate: 54.2% (vs. 62.3% for young urban applicants)
- DIR: 0.72 (below 0.80 threshold)

**Recommendation:** Implement intersectional fairness monitoring.

## Proxy Discrimination Assessment

### Credit Score as Proxy
**Analysis:** Evaluated whether credit score acts as proxy for protected characteristics.

**Findings:**
- Credit score distribution varies by age (expected due to credit history)
- No evidence of systematic bias in credit score assignment
- Model's use of credit score is justified by predictive value

### Zip Code as Proxy
**Analysis:** Evaluated correlation between zip code and demographic characteristics.

**Findings:**
- Strong correlation with income and race (r = 0.67)
- Zip code feature contributes 2.1% to model predictions
- **Recommendation:** Remove zip code to eliminate proxy risk

## Fairness-Performance Tradeoff

### Current Model
- AUC: 0.847
- Demographic Parity Violation: 2 groups
- Equal Opportunity Violation: 1 group

### Fairness-Constrained Model (Simulated)
- AUC: 0.839 (-0.008)
- Demographic Parity: Satisfied for all groups
- Equal Opportunity: Satisfied for all groups

**Recommendation:** Implement fairness constraints with acceptable performance tradeoff.

## Recommendations

### Immediate Actions (Priority 1)
1. **Remove zip code feature** - Replace with state or region
2. **Implement age-based monitoring** - Weekly tracking of approval rates by age group
3. **Add fairness metrics to model dashboard** - Real-time DIR tracking

### Short-Term Actions (Priority 2)
4. **Retrain with fairness constraints** - Use demographic parity constraints
5. **Expand training data** - Oversample underrepresented geographies
6. **Conduct intersectional analysis** - Monthly review of age × geography interactions

### Long-Term Actions (Priority 3)
7. **Develop fairness-aware features** - Create age-neutral credit history metrics
8. **Implement bias mitigation techniques** - Adversarial debiasing or reweighting
9. **Establish fairness governance** - Quarterly fairness audits with stakeholder review

## Monitoring Plan

### Ongoing Metrics
- Weekly: Approval rates by age group
- Monthly: Disparate impact ratios for all protected groups
- Quarterly: Full fairness audit with statistical testing

### Alert Thresholds
- DIR < 0.80 for any group
- Approval rate change > 5% for any group (month-over-month)
- AUC degradation > 0.02 for any subgroup

## Conclusion

The CreditRisk-XGB-v2.1 model demonstrates generally fair performance but exhibits age-based and geographic disparities that require mitigation. The recommended actions will improve fairness while maintaining acceptable predictive performance.

**Overall Fairness Rating:** ⚠️ **Moderate Risk** - Requires mitigation actions before next quarterly review.

---

**Approved By:** Dr. Sarah Chen, Head of ML Fairness  
**Review Date:** 2024-01-10  
**Next Audit:** 2024-04-10
