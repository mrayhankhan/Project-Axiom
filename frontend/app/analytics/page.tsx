"use client";

import React from 'react';
import { Card, MetricCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, TrendingUp, Activity, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useSession } from 'next-auth/react';

export default function Analytics() {
    const { data: session } = useSession();
    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard
                    label="Total Queries"
                    value="24,847"
                    change="+18% vs last month"
                    trend="up"
                    icon={<Activity className="w-5 h-5" />}
                />
                <MetricCard
                    label="Avg. Response Time"
                    value="124ms"
                    change="-12ms faster"
                    trend="down"
                    icon={<Clock className="w-5 h-5" />}
                />
                <MetricCard
                    label="Accuracy Rate"
                    value="94.2%"
                    change="+2.1% improvement"
                    trend="up"
                    icon={<TrendingUp className="w-5 h-5" />}
                />
                <MetricCard
                    label="Tokens Used"
                    value="2.4M"
                    change="+15% this month"
                    trend="up"
                    icon={<Zap className="w-5 h-5" />}
                />
                <MetricCard
                    label="Cache Hit Rate"
                    value="87.5%"
                    change="+5% improvement"
                    trend="up"
                    icon={<TrendingUp className="w-5 h-5" />}
                />
            </div>

            {/* Time Selector */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">Last 7 days</Button>
                    <Button variant="tertiary" size="sm">Last 30 days</Button>
                    <Button variant="tertiary" size="sm">Last 90 days</Button>
                    <Button variant="tertiary" size="sm">Custom</Button>
                </div>
                <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
                    Export Report
                </Button>
            </div>

            {/* Query Volume Chart */}
            <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-text-primary">Query Volume Trend</h3>
                        <p className="text-sm text-text-muted mt-1">Daily query count over time</p>
                    </div>
                    <select className="px-3 py-1.5 text-sm border border-surface-a40 rounded-md focus:border-primary-a30 focus:ring-2 focus:ring-primary-a30/25 bg-surface-a10 dark:bg-surface-a20 text-text-primary">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>
                </div>
                <div className="h-64">
                    <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                        <polyline
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary-a30"
                            points="0,150 100,140 200,120 300,130 400,100 500,110 600,80 700,90 800,60"
                        />
                        <polyline
                            fill="url(#gradient)"
                            points="0,150 100,140 200,120 300,130 400,100 500,110 600,80 700,90 800,60 800,200 0,200"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" className="text-primary-a30" />
                                <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary-a30" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className="flex justify-between mt-4 text-xs text-text-muted">
                    <span>Jan 1</span>
                    <span>Jan 8</span>
                    <span>Jan 15</span>
                    <span>Jan 22</span>
                    <span>Jan 29</span>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Latency Distribution */}
                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <h3 className="font-semibold text-text-primary mb-4">Response Time Distribution</h3>
                    <div className="space-y-3">
                        <LatencyBar range="0-50ms" count={8234} percentage={33} color="bg-success-a20" />
                        <LatencyBar range="50-100ms" count={10142} percentage={41} color="bg-success-a20" />
                        <LatencyBar range="100-200ms" count={4825} percentage={19} color="bg-warning-a20" />
                        <LatencyBar range="200-500ms" count={1246} percentage={5} color="bg-warning-a20" />
                        <LatencyBar range="500ms+" count={400} percentage={2} color="bg-danger-a20" />
                    </div>
                </div>

                {/* Top Documents */}
                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <h3 className="font-semibold text-text-primary mb-4">Most Referenced Documents</h3>
                    <div className="space-y-3">
                        <DocumentUsageItem
                            name="Credit Risk Model Documentation v2.3.pdf"
                            queries={1247}
                            trend="up"
                        />
                        <DocumentUsageItem
                            name="Underwriting Guidelines 2024.docx"
                            queries={982}
                            trend="up"
                        />
                        <DocumentUsageItem
                            name="ML Model Explainability Framework.pdf"
                            queries={734}
                            trend="neutral"
                        />
                        <DocumentUsageItem
                            name="Model Risk Assessment Report Q4.pdf"
                            queries={612}
                            trend="down"
                        />
                    </div>
                </div>
            </div>

            {/* Token Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <h3 className="font-semibold text-text-primary mb-4">Token Usage by Model</h3>
                    <div className="space-y-4">
                        <TokenUsageBar model="GPT-4" tokens="1.2M" cost="$24.50" percentage={50} />
                        <TokenUsageBar model="GPT-3.5 Turbo" tokens="800K" cost="$8.20" percentage={33} />
                        <TokenUsageBar model="Claude 2" tokens="400K" cost="$12.80" percentage={17} />
                    </div>
                </div>

                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <h3 className="font-semibold text-text-primary mb-4">Cost Summary</h3>
                    <div className="space-y-4">
                        <div className="text-center py-4">
                            <p className="text-3xl font-bold text-text-primary">$45.50</p>
                            <p className="text-sm text-text-muted mt-1">Total this month</p>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-surface-a30">
                            <CostItem label="Model API" amount="$32.70" />
                            <CostItem label="Embeddings" amount="$8.50" />
                            <CostItem label="Storage" amount="$4.30" />
                        </div>
                    </div>
                </div>
            </div>

            {/* User Activity */}
            <Card>
                <h3 className="font-semibold text-text-primary mb-4">Top Users</h3>
                <div className="space-y-4">
                    <UserActivityCard name={session?.user?.name || "User"} queries={623} role="Admin" />
                    <UserActivityCard name="Sarah Chen" queries={482} role="Analyst" />
                    <UserActivityCard name="Mike Ross" queries={356} role="Developer" />
                    <UserActivityCard name="Alice Johnson" queries={298} role="Analyst" />
                </div>
            </Card>
        </div>
    );
}

function LatencyBar({ range, count, percentage, color }: { range: string; count: number; percentage: number; color: string }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text-secondary">{range}</span>
                <span className="text-sm text-text-muted">{count.toLocaleString()} queries</span>
            </div>
            <div className="h-2 bg-surface-a30 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}

function DocumentUsageItem({ name, queries, trend }: { name: string; queries: number; trend: 'up' | 'down' | 'neutral' }) {
    const trendIcons = {
        up: '↑',
        down: '↓',
        neutral: '→'
    };
    const trendColors = {
        up: 'text-success-a20',
        down: 'text-danger-a20',
        neutral: 'text-text-muted'
    };

    return (
        <div className="flex items-center justify-between p-3 border border-surface-a30 rounded-lg hover:border-primary-a30 transition-colors cursor-pointer">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{name}</p>
                <p className="text-xs text-text-muted mt-0.5">{queries.toLocaleString()} queries</p>
            </div>
            <span className={cn("text-lg", trendColors[trend])}>{trendIcons[trend]}</span>
        </div>
    );
}

function TokenUsageBar({ model, tokens, cost, percentage }: { model: string; tokens: string; cost: string; percentage: number }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">{model}</span>
                <div className="text-right">
                    <p className="text-sm text-text-primary">{tokens}</p>
                    <p className="text-xs text-text-muted">{cost}</p>
                </div>
            </div>
            <div className="h-2.5 bg-surface-a30 rounded-full overflow-hidden">
                <div className="h-full bg-primary-a30 rounded-full transition-all" style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}

function CostItem({ label, amount }: { label: string; amount: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">{label}</span>
            <span className="font-medium text-text-primary">{amount}</span>
        </div>
    );
}

function UserActivityCard({ name, queries, role }: { name: string; queries: number; role: string }) {
    return (
        <div className="p-4 border border-surface-a30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-a30/10 rounded-full flex items-center justify-center text-primary-a40 font-medium">
                    {name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{name}</p>
                    <p className="text-xs text-text-muted">{role}</p>
                </div>
            </div>
            <p className="text-2xl font-semibold text-text-primary">{queries}</p>
            <p className="text-xs text-text-muted mt-0.5">queries this month</p>
        </div>
    );
}
