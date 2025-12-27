"use client";

import React, { useState } from 'react';
import { MetricCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Play, Upload, Download, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Evaluation() {
    const [showNewEval, setShowNewEval] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary">Model Evaluation</h2>
                    <p className="text-sm text-text-muted mt-1">Run tests and analyze model performance</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Play className="w-4 h-4" />}
                    onClick={() => setShowNewEval(true)}
                >
                    Run New Evaluation
                </Button>
            </div>

            {/* Recent Evaluations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <EvaluationCard
                    id="#342"
                    model="Claims Processor v2"
                    status="completed"
                    accuracy={94.2}
                    date="2024-01-15"
                    duration="12m 34s"
                />
                <EvaluationCard
                    id="#341"
                    model="Underwriting AI"
                    status="running"
                    accuracy={null}
                    date="2024-01-15"
                    duration="Running..."
                />
                <EvaluationCard
                    id="#340"
                    model="Credit Scorer v3"
                    status="completed"
                    accuracy={91.7}
                    date="2024-01-14"
                    duration="8m 12s"
                />
            </div>

            {/* Metrics Comparison */}
            <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                <h3 className="font-semibold text-text-primary mb-4">Performance Metrics Comparison</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-surface-a30">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Evaluation</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Accuracy</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Precision</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Recall</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">F1 Score</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Latency</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Tokens</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-a30">
                            <MetricRow
                                id="#342"
                                accuracy={94.2}
                                precision={93.8}
                                recall={94.6}
                                f1={94.2}
                                latency="124ms"
                                tokens="42.3K"
                            />
                            <MetricRow
                                id="#340"
                                accuracy={91.7}
                                precision={90.2}
                                recall={93.1}
                                f1={91.6}
                                latency="138ms"
                                tokens="38.7K"
                            />
                            <MetricRow
                                id="#338"
                                accuracy={89.4}
                                precision={88.9}
                                recall={89.9}
                                f1={89.4}
                                latency="142ms"
                                tokens="35.2K"
                            />
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Confusion Matrix */}
                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <h3 className="font-semibold text-text-primary mb-4">Confusion Matrix</h3>
                    <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
                        <div />
                        <div className="text-center text-xs font-medium text-text-secondary py-2">Predicted +</div>
                        <div className="text-center text-xs font-medium text-text-secondary py-2">Predicted -</div>
                        <div className="text-xs font-medium text-text-secondary py-2 flex items-center">Actual +</div>
                        <div className="bg-success-a20/10 text-success-a20 text-center py-6 rounded-lg font-semibold text-lg">842</div>
                        <div className="bg-danger-a20/10 text-danger-a20 text-center py-6 rounded-lg font-semibold text-lg">23</div>
                        <div className="text-xs font-medium text-text-secondary py-2 flex items-center">Actual -</div>
                        <div className="bg-danger-a20/10 text-danger-a20 text-center py-6 rounded-lg font-semibold text-lg">31</div>
                        <div className="bg-success-a20/10 text-success-a20 text-center py-6 rounded-lg font-semibold text-lg">754</div>
                    </div>
                </div>

                {/* Test Cases */}
                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-text-primary">Test Case Results</h3>
                        <Button variant="tertiary" size="sm">View All</Button>
                    </div>
                    <div className="space-y-3">
                        <TestCaseItem
                            query="What is the maximum loan amount for..."
                            expected="$500,000"
                            actual="$500,000"
                            match={true}
                        />
                        <TestCaseItem
                            query="What are the credit score requirements..."
                            expected="Minimum 650"
                            actual="Minimum 650"
                            match={true}
                        />
                        <TestCaseItem
                            query="How long does underwriting take..."
                            expected="3-5 business days"
                            actual="5-7 business days"
                            match={false}
                        />
                        <TestCaseItem
                            query="What documents are required for..."
                            expected="W-2, tax returns, bank statements"
                            actual="W-2, tax returns, bank statements"
                            match={true}
                        />
                    </div>
                </div>
            </div>

            {/* Per-Intent Breakdown */}
            <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                <h3 className="font-semibold text-text-primary mb-4">Performance by Intent</h3>
                <div className="space-y-3">
                    <IntentMetric intent="loan_eligibility" accuracy={96.8} count={234} />
                    <IntentMetric intent="documentation_requirements" accuracy={94.2} count={187} />
                    <IntentMetric intent="underwriting_timeline" accuracy={89.1} count={142} />
                    <IntentMetric intent="interest_rates" accuracy={92.4} count={201} />
                    <IntentMetric intent="payment_calculations" accuracy={97.3} count={156} />
                </div>
            </div>

            {/* New Evaluation Modal */}
            {showNewEval && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg max-w-2xl w-full p-6 border border-surface-a30">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Run New Evaluation</h3>
                        <div className="space-y-4">
                            <Input label="Evaluation Name" placeholder="e.g., Q1 2024 Model Test" />
                            <Input label="Model" placeholder="Select model to evaluate" />
                            <div>
                                <label className="block text-sm text-text-primary font-medium mb-2">Test Dataset</label>
                                <div className="border-2 border-dashed border-surface-a40 rounded-lg p-8 text-center hover:border-primary-a30 transition-colors cursor-pointer">
                                    <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                                    <p className="text-sm text-text-secondary">Upload CSV file with test Q&A pairs</p>
                                    <p className="text-xs text-text-muted mt-1">Must include 'question' and 'expected_answer' columns</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-4">
                                <Button variant="tertiary" onClick={() => setShowNewEval(false)}>Cancel</Button>
                                <Button variant="primary" icon={<Play className="w-4 h-4" />}>Start Evaluation</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function EvaluationCard({ id, model, status, accuracy, date, duration }: {
    id: string;
    model: string;
    status: 'completed' | 'running' | 'failed';
    accuracy: number | null;
    date: string;
    duration: string;
}) {
    const statusConfig = {
        completed: { variant: 'success' as const, label: 'Completed' },
        running: { variant: 'warning' as const, label: 'Running' },
        failed: { variant: 'danger' as const, label: 'Failed' }
    };

    return (
        <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-sm text-text-muted">Evaluation {id}</p>
                    <h4 className="font-semibold text-text-primary mt-0.5">{model}</h4>
                </div>
                <Badge variant={statusConfig[status].variant} size="sm" dot>
                    {statusConfig[status].label}
                </Badge>
            </div>
            {accuracy !== null && (
                <div className="mb-3">
                    <p className="text-3xl font-bold text-text-primary">{accuracy}%</p>
                    <p className="text-sm text-text-muted">Accuracy</p>
                </div>
            )}
            {status === 'running' && (
                <div className="mb-3">
                    <div className="h-1.5 bg-surface-a30 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-a30 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between text-xs text-text-muted">
                <span>{date}</span>
                <span>{duration}</span>
            </div>
        </div>
    );
}

function MetricRow({ id, accuracy, precision, recall, f1, latency, tokens }: {
    id: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    latency: string;
    tokens: string;
}) {
    return (
        <tr className="hover:bg-surface-a20">
            <td className="py-3 px-4 text-sm text-text-primary font-medium">{id}</td>
            <td className="py-3 px-4 text-sm text-right text-text-primary">{accuracy}%</td>
            <td className="py-3 px-4 text-sm text-right text-text-primary">{precision}%</td>
            <td className="py-3 px-4 text-sm text-right text-text-primary">{recall}%</td>
            <td className="py-3 px-4 text-sm text-right text-text-primary">{f1}%</td>
            <td className="py-3 px-4 text-sm text-right text-text-primary">{latency}</td>
            <td className="py-3 px-4 text-sm text-right text-text-primary">{tokens}</td>
        </tr>
    );
}

function TestCaseItem({ query, expected, actual, match }: {
    query: string;
    expected: string;
    actual: string;
    match: boolean;
}) {
    return (
        <div className={cn(
            "p-3 rounded-lg border",
            match
                ? 'border-success-a20/20 bg-success-a20/10'
                : 'border-danger-a20/20 bg-danger-a20/10'
        )}>
            <div className="flex items-start gap-2 mb-2">
                {match ? (
                    <CheckCircle className="w-4 h-4 text-success-a20 flex-shrink-0 mt-0.5" />
                ) : (
                    <XCircle className="w-4 h-4 text-danger-a20 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-text-primary font-medium">{query}</p>
            </div>
            <div className="ml-6 text-xs space-y-1">
                <p className="text-text-secondary">Expected: <span className="text-text-primary">{expected}</span></p>
                <p className="text-text-secondary">Actual: <span className="text-text-primary">{actual}</span></p>
            </div>
        </div>
    );
}

function IntentMetric({ intent, accuracy, count }: { intent: string; accuracy: number; count: number }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-primary">{intent.replace(/_/g, ' ')}</span>
                    <span className="text-sm font-medium text-text-primary">{accuracy}%</span>
                </div>
                <div className="h-2 bg-surface-a30 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full",
                            accuracy >= 95 ? 'bg-success-a20' : accuracy >= 90 ? 'bg-warning-a20' : 'bg-danger-a20'
                        )}
                        style={{ width: `${accuracy}%` }}
                    />
                </div>
            </div>
            <span className="text-xs text-text-muted ml-4">{count} tests</span>
        </div>
    );
}
