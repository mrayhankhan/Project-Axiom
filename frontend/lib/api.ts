import axios from 'axios';

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types
export interface Document {
    file_id: string;
    filename: string;
    size: number;
    uploaded_at: number;
}

export interface Citation {
    document: string;
    section: string;
    chunk_id?: string;
    relevance_score?: number;
}

export interface RAGResponse {
    answer: string;
    risk_category: string;
    confidence_score: number;
    citations: Citation[];
    limitations?: string;
    evidence_coverage?: number;
}

export interface QuestionResponse {
    status: string;
    question: string;
    answer: string;
    risk_category: string;
    confidence_score: number;
    citations: Citation[];
    limitations?: string;
    evidence_coverage?: number;
    retrieved_chunks: number;
    processing_time: number;
}

export interface SystemMetrics {
    total_questions: number;
    avg_confidence: number;
    avg_evidence_coverage: number;
    risk_category_distribution: Record<string, number>;
    confidence_distribution: Record<string, number>;
    questions_per_day: Record<string, number>;
}

// API Client
export const api = {
    // Documents
    uploadDocument: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_URL}/documents/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    listDocuments: async () => {
        const response = await axios.get(`${API_URL}/documents/list`);
        return response.data;
    },

    deleteDocument: async (fileId: string) => {
        const response = await axios.delete(`${API_URL}/documents/${fileId}`);
        return response.data;
    },

    // Questions
    askQuestion: async (question: string, filters?: any) => {
        const response = await axios.post(`${API_URL}/questions/ask`, {
            question,
            filters,
        });
        return response.data as QuestionResponse;
    },

    getHistory: async () => {
        const response = await axios.get(`${API_URL}/questions/history`);
        return response.data;
    },

    // Analytics
    getMetrics: async () => {
        const response = await axios.get(`${API_URL}/analytics/metrics`);
        return response.data.metrics as SystemMetrics;
    },
};
