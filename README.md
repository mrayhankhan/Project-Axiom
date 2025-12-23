# Axiom - Enterprise Model Risk & Explainability Intelligence Platform

Axiom is a production-grade SaaS application for ML governance, model risk management, and explainability intelligence. It uses advanced Retrieval-Augmented Generation (RAG) to answer evidence-grounded questions about machine learning models, citing internal governance artifacts.

![Axiom Dashboard](https://via.placeholder.com/800x400?text=Axiom+Dashboard)

## 🚀 Key Features

- **Evidence-Based Q&A**: Answers governance questions using ONLY retrieved context from uploaded documents.
- **Risk Intelligence**: Automatically classifies risks (Bias, Explainability, Data, Deployment, Compliance).
- **Confidence Calibration**: Provides calibrated confidence scores for every answer.
- **Citation Tracking**: Links every claim to specific document sections.
- **Document Ingestion**: Supports PDF, DOCX, and Markdown with automatic metadata extraction.
- **Enterprise Analytics**: Tracks system performance, risk distribution, and evidence coverage.

## 🏗️ Architecture

### Backend (FastAPI + LangChain)
- **Ingestion Pipeline**: Semantic chunking, metadata extraction, and document classification.
- **Vector Store**: FAISS with metadata filtering for efficient retrieval.
- **RAG Engine**: Context-aware prompt engineering with refusal logic for insufficient evidence.
- **Risk Classifier**: Hybrid rule-based and embedding-based classification.

### Frontend (Next.js + Tailwind)
- **Modern SaaS UI**: Dark mode, responsive design, and enterprise aesthetics.
- **Interactive Dashboards**: Real-time metrics and visualizations using Recharts.
- **Document Management**: Upload, search, and filter governance artifacts.

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, LangChain, Sentence Transformers, FAISS, Pydantic
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Infrastructure**: Docker, Vercel-ready

## 🚦 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   API will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```
   App will be available at `http://localhost:3000`.

## 🧪 Evaluation

Run the offline evaluation script to test RAG accuracy and calibration:

```bash
cd evaluation
python evaluate.py
```

Target accuracy: >80% on the golden dataset.

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs)
- [Model Card Template](sample_data/model_card_credit_risk.md)
- [Risk Classification Guide](docs/risk_classification.md)

## 🔒 Security

- All documents are processed locally (or in your private cloud).
- No data is sent to external APIs unless configured (e.g., OpenAI).
- Enterprise-grade authentication ready (NextAuth.js).

---

**Positioning**: Axiom is NOT a chatbot. It is an **Internal Model Risk & Explainability Intelligence Platform** designed for regulated industries (Finance, Healthcare, Insurance).
