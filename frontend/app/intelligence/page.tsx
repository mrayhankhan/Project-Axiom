"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    BrainCircuit,
    AlertTriangle,
    Sparkles,
    RefreshCw
} from "lucide-react";
import { api, QuestionResponse } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ConfidenceScore } from "@/components/ConfidenceScore";
import { RiskBadge } from "@/components/RiskBadge";
import { EvidenceViewer } from "@/components/EvidenceViewer";

export default function IntelligencePage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<QuestionResponse | null>(null);
    const [history, setHistory] = useState<QuestionResponse[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await api.getHistory();
                setHistory(data.questions);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            }
        };
        fetchHistory();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || loading) return;

        setLoading(true);
        try {
            const result = await api.askQuestion(query);
            setResponse(result);
            setHistory((prev) => [result, ...prev]);
            setQuery("");
        } catch (error) {
            console.error("Failed to ask question:", error);
            alert("Failed to process question");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const loadQuestion = (q: string) => {
        setQuery(q);
        textareaRef.current?.focus();
    };

    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-border bg-card px-8 py-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
                    <BrainCircuit className="mr-3 h-8 w-8 text-primary" />
                    Risk Intelligence
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Ask evidence-based questions about model risk, bias, and governance.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-4xl space-y-8">
                    {/* Current Response */}
                    {response ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-foreground">
                                        {response.question}
                                    </h2>
                                    <div className="flex items-center space-x-3">
                                        <RiskBadge category={response.risk_category} />
                                        <ConfidenceScore score={response.confidence_score} />
                                    </div>
                                </div>

                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                                        {response.answer}
                                    </p>
                                </div>

                                {response.limitations && (
                                    <div className="mt-6 rounded-md bg-yellow-500/10 p-4 border border-yellow-500/20">
                                        <div className="flex">
                                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-sm font-medium text-yellow-500">Limitations</h4>
                                                <p className="mt-1 text-sm text-yellow-500/90">
                                                    {response.limitations}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <EvidenceViewer citations={response.citations} />

                                <div className="mt-6 pt-4 border-t border-border flex justify-between text-xs text-muted-foreground">
                                    <span>Processing time: {response.processing_time.toFixed(2)}s</span>
                                    <span>Evidence coverage: {Math.round((response.evidence_coverage || 0) * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="rounded-full bg-primary/10 p-6 mb-6">
                                <Sparkles className="h-12 w-12 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">
                                Ready to analyze your models
                            </h3>
                            <p className="mt-2 text-muted-foreground max-w-md">
                                Ask questions about bias, fairness, validation results, or deployment risks.
                                Axiom retrieves evidence directly from your uploaded documents.
                            </p>

                            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 w-full max-w-2xl">
                                {[
                                    "What features contribute most to bias risk?",
                                    "What assumptions could break in production?",
                                    "Which geographic areas show fairness concerns?",
                                    "What are the model limitations?"
                                ].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => loadQuestion(q)}
                                        className="rounded-lg border border-border bg-card p-4 text-left text-sm hover:border-primary/50 hover:bg-accent transition-all"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* History */}
                    {history.length > 0 && !response && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Recent Questions
                            </h3>
                            <div className="space-y-3">
                                {history.slice(0, 5).map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setResponse(item)}
                                        className="w-full rounded-lg border border-border bg-card p-4 text-left hover:bg-accent transition-colors flex items-center justify-between group"
                                    >
                                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                            {item.question}
                                        </span>
                                        <div className="flex items-center space-x-3">
                                            <RiskBadge category={item.risk_category} />
                                            <span className="text-xs text-muted-foreground">
                                                {new Date().toLocaleDateString()}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-border bg-card p-6">
                <div className="mx-auto max-w-4xl">
                    <form onSubmit={handleSubmit} className="relative">
                        <textarea
                            ref={textareaRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask a governance question..."
                            className="w-full resize-none rounded-xl border border-input bg-background p-4 pr-12 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px]"
                            rows={1}
                        />
                        <button
                            type="submit"
                            disabled={!query.trim() || loading}
                            className="absolute right-3 top-3 rounded-lg p-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                            {loading ? (
                                <RefreshCw className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="h-5 w-5" />
                            )}
                        </button>
                    </form>
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                        Axiom uses RAG to provide evidence-based answers. Always verify critical risks with human review.
                    </p>
                </div>
            </div>
        </div>
    );
}
