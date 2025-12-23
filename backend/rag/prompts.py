"""
Governance-optimized prompt templates for RAG.
Designed to prevent hallucination and ensure evidence-based responses.
"""

SYSTEM_PROMPT = """You are an AI assistant specialized in ML model governance, risk management, and explainability.

Your role is to answer questions about machine learning models based ONLY on the provided evidence from governance documents.

CRITICAL RULES:
1. Answer ONLY using information from the provided context
2. If the context doesn't contain enough information, say "Insufficient evidence to answer this question"
3. Always cite which document sections you're using
4. Never make assumptions or add information not in the context
5. Focus on risk, bias, fairness, explainability, and governance concerns
6. Be precise and technical - this is for ML professionals

When answering:
- Identify the risk category (bias, explainability, data, deployment, compliance)
- Provide specific evidence from the documents
- Highlight any limitations or uncertainties
- Use technical terminology appropriately
"""

QA_PROMPT_TEMPLATE = """Based on the following evidence from ML governance documents, answer the question.

EVIDENCE:
{context}

QUESTION: {question}

Provide a structured response:
1. Direct answer based on evidence
2. Risk category (bias/explainability/data/deployment/compliance)
3. Key evidence citations
4. Any limitations or uncertainties

If the evidence is insufficient, clearly state this and explain what information is missing.

ANSWER:"""

REFUSAL_TEMPLATE = """I don't have sufficient evidence in the provided governance documents to answer this question accurately.

To answer "{question}", I would need information about:
{missing_info}

Please provide relevant documentation or rephrase your question to focus on available evidence."""

FEW_SHOT_EXAMPLES = [
    {
        "question": "What features contribute most to bias risk?",
        "context": "[Bias Report] Feature fairness analysis shows that 'age' and 'zip_code' features exhibit disparate impact across protected groups...",
        "answer": "Based on the bias fairness analysis, the features that contribute most to bias risk are 'age' and 'zip_code', which show disparate impact across protected groups.\n\nRisk Category: bias\n\nEvidence: Bias Report - Feature Fairness Analysis section\n\nLimitations: The analysis may not capture all forms of bias, and intersectional effects between features were not fully evaluated."
    },
    {
        "question": "What assumptions could break in production?",
        "context": "[Assumptions Document] The model assumes stationary data distribution and requires features to be updated within 24 hours...",
        "answer": "The key assumptions that could break in production are:\n1. Stationary data distribution - if the underlying data patterns shift\n2. Feature freshness - features must be updated within 24 hours\n\nRisk Category: deployment\n\nEvidence: Assumptions and Limitations Document\n\nLimitations: The document doesn't specify monitoring procedures for detecting assumption violations."
    }
]


def format_context(retrieved_chunks: list) -> str:
    """Format retrieved chunks into context string."""
    context_parts = []
    
    for i, chunk in enumerate(retrieved_chunks, 1):
        section = chunk.get("section_title", "Document")
        text = chunk.get("text", "")
        filename = chunk.get("metadata", {}).get("filename", "Unknown")
        
        context_parts.append(f"[Source {i}: {filename} - {section}]\n{text}\n")
    
    return "\n".join(context_parts)


def format_qa_prompt(question: str, context: str) -> str:
    """Format the QA prompt with question and context."""
    return QA_PROMPT_TEMPLATE.format(
        question=question,
        context=context
    )


def format_refusal(question: str, missing_info: list) -> str:
    """Format a refusal response when evidence is insufficient."""
    missing_str = "\n".join(f"- {info}" for info in missing_info)
    return REFUSAL_TEMPLATE.format(
        question=question,
        missing_info=missing_str
    )
