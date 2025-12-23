# Model Assumptions & Limitations

**Model:** CreditRisk-XGB-v2.1  
**Document Version:** 1.0  
**Last Updated:** 2024-01-15

## Purpose

This document explicitly states all assumptions and limitations of the CreditRisk-XGB-v2.1 model. Understanding these constraints is critical for proper model usage and risk management.

## Critical Assumptions

### 1. Data Availability Assumptions

#### Assumption 1.1: Feature Freshness
**Statement:** All 23 input features are available within 24 hours of prediction time.

**Rationale:** Credit bureau data and internal systems update daily.

**Risk if Violated:**
- Stale credit scores may not reflect recent credit events
- Prediction accuracy degrades with data age
- Estimated impact: 2-5% AUC degradation if features are > 7 days old

**Monitoring:**
- Track data freshness in production logs
- Alert if any feature is > 24 hours old

**Contingency:**
- Reject predictions if critical features (credit score, income) are > 48 hours old
- Use fallback decisioning rules

---

#### Assumption 1.2: Complete Feature Availability
**Statement:** All 23 features are available for 99%+ of predictions.

**Rationale:** Production systems have high availability and backup data sources.

**Risk if Violated:**
- Missing features lead to degraded predictions
- Model cannot handle missing values in production

**Monitoring:**
- Track missing value rates per feature
- Alert if any feature has > 1% missing rate

**Contingency:**
- Implement imputation for non-critical features
- Reject application if critical features are missing

---

### 2. Distribution Stationarity Assumptions

#### Assumption 2.1: Feature Distribution Stability
**Statement:** The distribution of input features remains similar to training data (2018-2022).

**Rationale:** Credit markets and consumer behavior are relatively stable year-over-year.

**Risk if Violated:**
- Model performance degrades due to distribution shift
- Predictions may be miscalibrated
- Estimated impact: Severe drift (PSI > 0.25) could reduce AUC by 0.03-0.05

**Monitoring:**
- Monthly PSI (Population Stability Index) calculation for all features
- Alert if PSI > 0.25 for any feature

**Contingency:**
- Trigger model retraining if PSI > 0.25 for critical features
- Implement distribution-shift-aware recalibration

**Known Drift Risks:**
- Economic recessions change income and employment patterns
- Regulatory changes affect credit reporting
- Fintech disruption alters consumer credit behavior

---

#### Assumption 2.2: Target Distribution Stability
**Statement:** The default rate remains within 10-15% range (training data: 12.3%).

**Rationale:** Historical default rates have been stable in this range.

**Risk if Violated:**
- Model calibration becomes inaccurate
- Business decisions based on predicted probabilities are suboptimal

**Monitoring:**
- Track actual default rates monthly
- Compare to model predictions (calibration check)

**Contingency:**
- Recalibrate model if default rate shifts > 3% from training baseline
- Consider retraining if shift persists > 2 quarters

---

### 3. Economic Environment Assumptions

#### Assumption 3.1: Moderate Economic Conditions
**Statement:** The economy operates within normal to moderate stress conditions (unemployment < 8%).

**Rationale:** Training data (2018-2022) includes normal and COVID-impacted periods but not severe recession.

**Risk if Violated:**
- Model has not been validated in severe recession (unemployment > 10%)
- Default patterns may change dramatically
- Feature relationships may break down

**Monitoring:**
- Track macroeconomic indicators (unemployment, GDP growth, interest rates)
- Monitor model performance during economic stress

**Contingency:**
- Develop recession-specific model or adjustments
- Implement conservative decision thresholds during crisis

**Untested Scenarios:**
- Severe recession (unemployment > 10%)
- Hyperinflation (inflation > 10%)
- Banking crisis or credit freeze

---

#### Assumption 3.2: Interest Rate Stability
**Statement:** Interest rates remain within historical ranges (0-8% for consumer loans).

**Rationale:** Training data covers low and moderate rate environments.

**Risk if Violated:**
- Consumer behavior changes dramatically with very high rates
- Debt-to-income ratios become less predictive

**Monitoring:**
- Track prevailing interest rates
- Monitor model performance as rates change

**Contingency:**
- Retrain model if rates exceed 10%
- Consider rate-adjusted features

---

### 4. Regulatory and Policy Assumptions

#### Assumption 4.1: Stable Credit Reporting Standards
**Statement:** Credit bureau reporting standards and FICO score calculation remain consistent.

**Rationale:** Credit reporting is regulated and changes slowly.

**Risk if Violated:**
- Credit score feature becomes incomparable to training data
- Model performance degrades

**Monitoring:**
- Track credit bureau methodology changes
- Monitor credit score distributions

**Contingency:**
- Retrain model with new credit score methodology
- Implement score normalization if needed

---

#### Assumption 4.2: No Major Regulatory Changes
**Statement:** Fair lending regulations and model governance requirements remain stable.

**Rationale:** Regulatory changes are infrequent but possible.

**Risk if Violated:**
- Model may violate new regulations
- Features may become prohibited

**Monitoring:**
- Track regulatory developments
- Conduct annual compliance review

**Contingency:**
- Remove prohibited features and retrain
- Implement fairness constraints if required

---

### 5. Technical Infrastructure Assumptions

#### Assumption 5.1: Prediction Latency < 200ms
**Statement:** Model predictions complete within 200ms (p95 latency).

**Rationale:** Real-time decisioning requires fast predictions.

**Risk if Violated:**
- User experience degrades
- Timeout errors in production

**Monitoring:**
- Track prediction latency (p50, p95, p99)
- Alert if p95 > 200ms

**Contingency:**
- Optimize model inference
- Scale infrastructure
- Implement caching for common scenarios

---

#### Assumption 5.2: Model Versioning and Rollback
**Statement:** Model can be rolled back to previous version within 1 hour if critical issues arise.

**Rationale:** Production incidents require fast recovery.

**Risk if Violated:**
- Extended downtime or incorrect predictions

**Monitoring:**
- Test rollback procedures quarterly
- Maintain previous model version in production-ready state

**Contingency:**
- Automated rollback triggers
- Manual override capability

---

## Model Limitations

### 1. Scope Limitations

#### Out-of-Scope Use Cases
The model is **NOT** designed for:
- ❌ Commercial lending (only consumer loans)
- ❌ Mortgage underwriting (different risk profile)
- ❌ Loans outside $5K-$50K range
- ❌ International applicants (only US residents)
- ❌ Applicants under 21 or over 75

**Risk of Misuse:**
- Unpredictable performance
- Regulatory violations
- Financial losses

**Control:**
- Input validation rejects out-of-scope applications
- Documentation clearly states scope

---

#### Thin Credit File Limitation
**Limitation:** Model has limited predictive power for applicants with < 6 months credit history.

**Impact:**
- AUC drops to ~0.75 for thin-file applicants (vs. 0.847 overall)
- Higher uncertainty in predictions

**Mitigation:**
- Flag thin-file applicants
- Use alternative decisioning (manual review or alternative data)

---

### 2. Performance Limitations

#### Geographic Performance Variation
**Limitation:** Model performance varies by geography due to training data imbalance.

**Affected States:**
- Alaska, Hawaii, Wyoming (< 0.5% of training data each)

**Impact:**
- Wider confidence intervals for predictions
- Potentially lower accuracy

**Mitigation:**
- Enhanced monitoring for underrepresented states
- Consider state-specific models if performance diverges significantly

---

#### Subgroup Performance Variation
**Limitation:** Model performance varies across demographic subgroups (see Bias & Fairness Report).

**Known Disparities:**
- Age: Younger applicants (21-30) have lower approval rates
- Geography: Rural zip codes have lower approval rates

**Impact:**
- Potential fairness concerns
- Regulatory scrutiny

**Mitigation:**
- Quarterly fairness audits
- Implement fairness constraints in future versions
- Monitor disparate impact ratios

---

### 3. Explainability Limitations

#### Black-Box Nature
**Limitation:** XGBoost is a complex ensemble model with limited intrinsic interpretability.

**Impact:**
- Difficult to explain individual predictions in simple terms
- Regulatory challenges in some jurisdictions

**Mitigation:**
- SHAP values provide post-hoc explanations
- Feature importance rankings
- Adverse action reason codes for rejected applicants

---

#### Feature Interaction Complexity
**Limitation:** Model captures complex feature interactions that are difficult to articulate.

**Example:**
- Age × credit_history_length interaction
- Income × debt_to_income × loan_amount interaction

**Impact:**
- Explanations may seem counterintuitive
- Difficult to debug edge cases

**Mitigation:**
- Document known interactions
- Provide SHAP interaction plots for investigation

---

### 4. Data Quality Limitations

#### Self-Reported Income
**Limitation:** Model assumes self-reported income is accurate (not verified for all applicants).

**Risk:**
- Income fraud leads to incorrect predictions
- Model may approve high-risk applicants

**Mitigation:**
- Implement income verification for high-value loans
- Monitor for income inflation patterns

---

#### Credit Bureau Data Lag
**Limitation:** Credit bureau data may be up to 30 days old for some tradelines.

**Risk:**
- Recent credit events (new loans, delinquencies) not reflected
- Predictions may be stale

**Mitigation:**
- Accept 24-hour data freshness as best available
- Supplement with real-time internal data where possible

---

## Assumption Violation Response Plan

### Severity Levels

**Level 1: Critical**
- Immediate model deactivation
- Fallback to manual decisioning
- Executive notification

**Triggers:**
- Data unavailability > 4 hours
- Severe economic crisis (unemployment > 12%)
- Major regulatory prohibition

**Level 2: High**
- Enhanced monitoring
- Accelerated retraining
- Risk committee review

**Triggers:**
- PSI > 0.25 for critical features
- Default rate shift > 5%
- Fairness metric violation

**Level 3: Medium**
- Standard monitoring
- Scheduled retraining
- Documentation update

**Triggers:**
- PSI 0.10-0.25
- Default rate shift 3-5%
- Minor performance degradation

---

## Review and Update Schedule

- **Quarterly:** Review assumptions against actual conditions
- **Annually:** Comprehensive assumption validation
- **Ad-hoc:** Update when material changes occur

---

**Document Owner:** Risk Analytics Team  
**Approved By:** Chief Risk Officer  
**Next Review:** 2024-04-15
