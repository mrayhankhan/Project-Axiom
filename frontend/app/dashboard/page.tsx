"use client";

import React from 'react';
import { MetricCard } from '@/components/ui/card';
import { FileText, Database, Brain, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <MetricCard
                    label="Total Documents"
                    value="2,847"
                    change="+12% this month"
                    trend="up"
                    icon={<FileText className="w-5 h-5" />}
                />
                <MetricCard
                    label="Indexed Vectors"
                    value="1.2M"
                    change="+8% this week"
                    trend="up"
                    icon={<Database className="w-5 h-5" />}
                />
                <MetricCard
                    label="Active Models"
                    value="14"
                    change="2 pending review"
                    trend="neutral"
                    icon={<Brain className="w-5 h-5" />}
                />
                <MetricCard
                    label="Avg. Latency"
                    value="124ms"
                    change="-5% improvement"
                    trend="down"
                    icon={<Clock className="w-5 h-5" />}
                />
                <MetricCard
                    label="Risk Alerts"
                    value="3"
                    change="2 critical"
                    trend="up"
                    icon={<AlertTriangle className="w-5 h-5" />}
                />
                <MetricCard
                    label="Monthly Tokens"
                    value="2.4M"
                    change="+18% vs last month"
                    trend="up"
                    icon={<TrendingUp className="w-5 h-5" />}
                />
            </div>

            {/* Time Range Selector and Quick Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">Last 7 days</Button>
                    <Button variant="tertiary" size="sm">Last 30 days</Button>
                    <Button variant="tertiary" size="sm">Last 90 days</Button>
                    <Button variant="tertiary" size="sm">Custom</Button>
                </div>
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Chart */}
                <div className="lg:col-span-2 bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-text-primary">Query Volume</h3>
                        <Badge variant="success" size="sm">Live</Badge>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[45, 52, 48, 65, 72, 68, 80, 75, 85, 78, 90, 88, 95, 92].map((height, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-primary-a20 rounded-t hover:bg-primary-a30 transition-colors cursor-pointer"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-text-muted">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <h3 className="font-semibold text-text-primary mb-4">System Health</h3>
                    <div className="space-y-4">
                        <HealthItem label="FAISS Index" status="healthy" value="99.9%" />
                        <HealthItem label="Ingestion Queue" status="healthy" value="2 jobs" />
                        <HealthItem label="API Gateway" status="healthy" value="Active" />
                        <HealthItem label="Vector Store" status="warning" value="85% capacity" />
                        <HealthItem label="Embedding Service" status="healthy" value="Online" />
                    </div>
                </div>
            </div>

            {/* Risk Matrix and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Matrix */}
                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-text-primary">Risk Matrix</h3>
                        <Button variant="tertiary" size="sm">View All</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <RiskCell level="low" count={42} label="Low Impact / Low Probability" />
                        <RiskCell level="medium" count={18} label="High Impact / Low Probability" />
                        <RiskCell level="medium" count={12} label="Low Impact / High Probability" />
                        <RiskCell level="critical" count={3} label="High Impact / High Probability" />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-text-primary">Recent Activity</h3>
                        <Button variant="tertiary" size="sm">View All</Button>
                    </div>
                    <div className="space-y-3">
                        <ActivityItem
                            action="Evaluation completed"
                            details="Model 'Claims v2' - Accuracy: 94.2%"
                            user="Sarah Chen"
                            time="5 min ago"
                        />
                        <ActivityItem
                            action="Documents indexed"
                            details="15 PDFs added to knowledge base"
                            user="System"
                            time="12 min ago"
                        />
                        <ActivityItem
                            action="Risk alert created"
                            details="Model drift detected on 'Underwriting AI'"
                            user="John Doe"
                            time="1 hour ago"
                            alert
                        />
                        <ActivityItem
                            action="Policy updated"
                            details="Model retention policy changed to 90 days"
                            user="Admin"
                            time="2 hours ago"
                        />
                        <ActivityItem
                            action="User invited"
                            details="Alice Johnson added as Analyst"
                            user="John Doe"
                            time="3 hours ago"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-6">
                <h3 className="font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickActionCard
                        icon={<FileText className="w-6 h-6" />}
                        title="Upload Documents"
                        description="Add new documents to your knowledge base"
                    />
                    <QuickActionCard
                        icon={<Brain className="w-6 h-6" />}
                        title="Run Evaluation"
                        description="Test model performance with new datasets"
                    />
                    <QuickActionCard
                        icon={<Database className="w-6 h-6" />}
                        title="Reindex Vectors"
                        description="Rebuild FAISS index for optimal search"
                    />
                    <QuickActionCard
                        icon={<AlertTriangle className="w-6 h-6" />}
                        title="Create Policy"
                        description="Define new risk management rules"
                    />
                </div>
            </div>
        </div>
    );
}

function HealthItem({ label, status, value }: { label: string; status: 'healthy' | 'warning' | 'error'; value: string }) {
    const statusColors = {
        healthy: 'bg-success-a20',
        warning: 'bg-warning-a20',
        error: 'bg-danger-a20'
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />
                <span className="text-sm text-text-secondary">{label}</span>
            </div>
            <span className="text-sm text-text-muted">{value}</span>
        </div>
    );
}

function RiskCell({ level, count, label }: { level: 'low' | 'medium' | 'critical'; count: number; label: string }) {
    const bgColors = {
        low: 'bg-success-a20/10 border-success-a20/20 hover:bg-success-a20/20',
        medium: 'bg-warning-a20/10 border-warning-a20/20 hover:bg-warning-a20/20',
        critical: 'bg-danger-a20/10 border-danger-a20/20 hover:bg-danger-a20/20'
    };

    const textColors = {
        low: 'text-success-a20',
        medium: 'text-warning-a20',
        critical: 'text-danger-a20'
    };

    return (
        <div className={cn("p-4 rounded-lg border-2 cursor-pointer transition-all", bgColors[level])}>
            <div className={cn("text-3xl font-bold mb-1", textColors[level])}>{count}</div>
            <div className="text-xs text-text-secondary">{label}</div>
        </div>
    );
}

function ActivityItem({ action, details, user, time, alert = false }: {
    action: string;
    details: string;
    user: string;
    time: string;
    alert?: boolean;
}) {
    return (
        <div className={cn(
            "flex items-start gap-3 p-3 rounded-md transition-colors",
            alert ? 'bg-danger-a20/10' : 'hover:bg-surface-a20 dark:hover:bg-surface-a30'
        )}>
            <div className={cn(
                "w-2 h-2 mt-2 rounded-full",
                alert ? 'bg-danger-a20' : 'bg-primary-a30'
            )} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{action}</p>
                <p className="text-sm text-text-secondary truncate">{details}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                    <span>{user}</span>
                    <span>•</span>
                    <span>{time}</span>
                </div>
            </div>
        </div>
    );
}

function QuickActionCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <button className="p-4 text-left rounded-lg border border-surface-a30 hover:border-primary-a30 hover:shadow-md transition-all group">
            <div className="text-primary-a40 mb-2 group-hover:text-primary-a50 transition-colors">
                {icon}
            </div>
            <h4 className="font-medium text-text-primary mb-1">{title}</h4>
            <p className="text-sm text-text-muted">{description}</p>
        </button>
    );
}
