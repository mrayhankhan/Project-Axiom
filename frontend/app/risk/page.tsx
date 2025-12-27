"use client";

import React from 'react';
import { MetricCard } from '@/components/ui/card';
import { Table, Column } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RiskBadge, Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Shield, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskIncident {
    id: string;
    title: string;
    model: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in-progress' | 'resolved';
    assignee: string;
    createdDate: string;
    sla: string;
}

const mockIncidents: RiskIncident[] = [
    {
        id: '1',
        title: 'Model drift detected in Claims Processor v2',
        model: 'Claims Processor v2',
        severity: 'critical',
        status: 'open',
        assignee: 'Sarah Chen',
        createdDate: '2024-01-15',
        sla: '2 hours'
    },
    {
        id: '2',
        title: 'Accuracy below threshold',
        model: 'Underwriting AI',
        severity: 'high',
        status: 'in-progress',
        assignee: 'John Doe',
        createdDate: '2024-01-14',
        sla: '1 day'
    },
    {
        id: '3',
        title: 'Missing explainability documentation',
        model: 'Credit Scorer v3',
        severity: 'medium',
        status: 'open',
        assignee: 'Alice Johnson',
        createdDate: '2024-01-13',
        sla: '5 days'
    }
];

export default function Risk() {
    const columns: Column<RiskIncident>[] = [
        {
            key: 'title',
            header: 'Incident',
            sortable: true,
            render: (incident) => (
                <div>
                    <p className="font-medium text-text-primary">{incident.title}</p>
                    <p className="text-sm text-text-muted mt-0.5">{incident.model}</p>
                </div>
            )
        },
        {
            key: 'severity',
            header: 'Severity',
            width: '140px',
            render: (incident) => <RiskBadge level={incident.severity} />
        },
        {
            key: 'status',
            header: 'Status',
            width: '120px',
            render: (incident) => {
                const variants = {
                    open: 'danger' as const,
                    'in-progress': 'warning' as const,
                    resolved: 'success' as const
                };
                const labels = {
                    open: 'Open',
                    'in-progress': 'In Progress',
                    resolved: 'Resolved'
                };
                return <Badge variant={variants[incident.status]} size="sm" dot>{labels[incident.status]}</Badge>;
            }
        },
        {
            key: 'assignee',
            header: 'Assignee',
            width: '140px'
        },
        {
            key: 'createdDate',
            header: 'Created',
            sortable: true,
            width: '120px'
        },
        {
            key: 'sla',
            header: 'SLA',
            width: '100px',
            render: (incident) => (
                <span className={cn(
                    incident.sla.includes('hour') ? 'text-danger-a20 font-medium' : 'text-text-primary'
                )}>
                    {incident.sla}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Active Incidents"
                    value="3"
                    change="+1 this week"
                    trend="up"
                    icon={<AlertTriangle className="w-5 h-5" />}
                />
                <MetricCard
                    label="Policy Compliance"
                    value="94.2%"
                    change="+2% this month"
                    trend="up"
                    icon={<Shield className="w-5 h-5" />}
                />
                <MetricCard
                    label="Models at Risk"
                    value="5"
                    change="2 critical"
                    trend="neutral"
                    icon={<TrendingUp className="w-5 h-5" />}
                />
                <MetricCard
                    label="Avg. Resolution Time"
                    value="3.2 days"
                    change="-15% improvement"
                    trend="down"
                    icon={<TrendingUp className="w-5 h-5" />}
                />
            </div>

            {/* Risk Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Risk Distribution */}
                <div className="lg:col-span-2 bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-text-primary">Risk Distribution</h3>
                        <select className="px-3 py-1.5 text-sm border border-surface-a40 rounded-md focus:border-primary-a30 focus:ring-2 focus:ring-primary-a30/25 bg-surface-a10 dark:bg-surface-a20 text-text-primary">
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                            <option>Last year</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        <RiskBar label="Critical" count={3} total={75} color="bg-danger-a20" />
                        <RiskBar label="High" count={12} total={75} color="bg-warning-a30" />
                        <RiskBar label="Medium" count={18} total={75} color="bg-warning-a20" />
                        <RiskBar label="Low" count={42} total={75} color="bg-success-a20" />
                    </div>
                </div>

                {/* Top Risk Models */}
                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <h3 className="font-semibold text-text-primary mb-4">Top Risk Models</h3>
                    <div className="space-y-3">
                        <ModelRiskCard
                            name="Claims Processor v2"
                            score={8.7}
                            trend="up"
                            issues={2}
                        />
                        <ModelRiskCard
                            name="Underwriting AI"
                            score={7.2}
                            trend="up"
                            issues={1}
                        />
                        <ModelRiskCard
                            name="Credit Scorer v3"
                            score={5.8}
                            trend="down"
                            issues={1}
                        />
                        <ModelRiskCard
                            name="Fraud Detection Pro"
                            score={4.3}
                            trend="neutral"
                            issues={0}
                        />
                    </div>
                </div>
            </div>

            {/* Incidents Table */}
            <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-text-primary">Risk Incidents</h3>
                    <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
                        Create Incident
                    </Button>
                </div>
                <Table
                    columns={columns}
                    data={mockIncidents}
                    emptyMessage="No risk incidents found"
                />
            </div>

            {/* Policy Compliance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <h3 className="font-semibold text-text-primary mb-4">Policy Compliance</h3>
                    <div className="space-y-4">
                        <PolicyItem
                            name="Model Documentation Required"
                            compliant={14}
                            total={14}
                            status="pass"
                        />
                        <PolicyItem
                            name="Quarterly Review Schedule"
                            compliant={12}
                            total={14}
                            status="warning"
                        />
                        <PolicyItem
                            name="Explainability Artifacts"
                            compliant={10}
                            total={14}
                            status="warning"
                        />
                        <PolicyItem
                            name="Accuracy Threshold (>92%)"
                            compliant={11}
                            total={14}
                            status="fail"
                        />
                    </div>
                </div>

                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <h3 className="font-semibold text-text-primary mb-4">Recent Resolutions</h3>
                    <div className="space-y-3">
                        <ResolutionItem
                            title="Feature drift in Loan Approval Model"
                            resolvedBy="Sarah Chen"
                            date="2024-01-12"
                            duration="2.3 days"
                        />
                        <ResolutionItem
                            title="Missing validation dataset"
                            resolvedBy="John Doe"
                            date="2024-01-10"
                            duration="1.5 days"
                        />
                        <ResolutionItem
                            title="Documentation update required"
                            resolvedBy="Alice Johnson"
                            date="2024-01-08"
                            duration="4.2 days"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function RiskBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
    const percentage = (count / total) * 100;

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">{label}</span>
                <span className="text-sm text-text-muted">{count} incidents</span>
            </div>
            <div className="h-3 bg-surface-a30 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}

function ModelRiskCard({ name, score, trend, issues }: {
    name: string;
    score: number;
    trend: 'up' | 'down' | 'neutral';
    issues: number;
}) {
    const trendIcons = {
        up: '↑',
        down: '↓',
        neutral: '→'
    };
    const trendColors = {
        up: 'text-danger-a20',
        down: 'text-success-a20',
        neutral: 'text-text-muted'
    };

    const scoreColor = score >= 7 ? 'text-danger-a20' : score >= 5 ? 'text-warning-a20' : 'text-success-a20';

    return (
        <div className="p-3 border border-surface-a30 rounded-lg hover:border-primary-a30 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{issues} active issue{issues !== 1 ? 's' : ''}</p>
                </div>
                <div className={cn("text-lg font-semibold", scoreColor)}>{score.toFixed(1)}</div>
            </div>
            <div className="flex items-center gap-2">
                <span className={cn("text-xs", trendColors[trend])}>{trendIcons[trend]}</span>
                <div className="flex-1 h-1.5 bg-surface-a30 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full",
                            score >= 7 ? 'bg-danger-a20' : score >= 5 ? 'bg-warning-a20' : 'bg-success-a20'
                        )}
                        style={{ width: `${(score / 10) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

function PolicyItem({ name, compliant, total, status }: {
    name: string;
    compliant: number;
    total: number;
    status: 'pass' | 'warning' | 'fail';
}) {
    const statusColors = {
        pass: 'bg-success-a20',
        warning: 'bg-warning-a20',
        fail: 'bg-danger-a20'
    };

    return (
        <div className="flex items-center justify-between p-3 border border-surface-a30 rounded-lg">
            <div className="flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />
                <div>
                    <p className="text-sm font-medium text-text-primary">{name}</p>
                    <p className="text-xs text-text-muted">{compliant}/{total} models compliant</p>
                </div>
            </div>
            <span className="text-sm text-text-secondary">{Math.round((compliant / total) * 100)}%</span>
        </div>
    );
}

function ResolutionItem({ title, resolvedBy, date, duration }: {
    title: string;
    resolvedBy: string;
    date: string;
    duration: string;
}) {
    return (
        <div className="p-3 border border-surface-a30 rounded-lg">
            <p className="text-sm font-medium text-text-primary mb-1">{title}</p>
            <div className="flex items-center justify-between text-xs text-text-muted">
                <span>{resolvedBy} • {date}</span>
                <Badge variant="success" size="sm">{duration}</Badge>
            </div>
        </div>
    );
}
