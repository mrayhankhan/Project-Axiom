# Model Risk Assessment Report: Q4 2024

**Model:** CRM-2024-ALPHA
**Reviewer:** Model Validation Group (MVG)
**Date:** 2024-12-20
**Overall Rating:** Effective with Observations

## 1. Scope of Review
This report details the findings of the annual validation of the CRM-2024-ALPHA credit scoring model. The review covered conceptual soundness, data integrity, and ongoing performance monitoring.

## 2. Key Findings

### Finding 1: Documentation Gaps (Medium Severity)
The current documentation does not adequately explain the rationale for excluding applicants with thin credit files (< 3 trade lines).
*   **Recommendation:** Update Section 2 (Scope) to explicitly state the exclusion criteria and provide analysis justifying the decision.

### Finding 2: Performance Degradation (Low Severity)
The Gini coefficient has dropped from 0.48 at development to 0.45 in the most recent quarter. While still within acceptable limits (> 0.40), the trend indicates potential model drift.
*   **Recommendation:** Increase monitoring frequency from quarterly to monthly until performance stabilizes.

### Finding 3: Sensitivity Analysis (High Severity)
The model shows excessive sensitivity to the "Utilization Rate" feature. A 10% increase in utilization results in a disproportionate 40% increase in predicted default probability for certain segments.
*   **Recommendation:** Re-evaluate the feature transformation logic for Utilization Rate.

## 3. Conclusion
The model remains fit for use, but the findings above must be addressed within 90 days. The Model Validation Group will conduct a follow-up review in Q1 2025.
