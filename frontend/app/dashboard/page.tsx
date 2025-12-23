"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BarChart3,
    FileText,
    AlertTriangle,
    CheckCircle,
    ArrowUpRight,
    BrainCircuit
} from "lucide-react";
import { api, SystemMetrics } from "@/lib/api";
import { RiskBadge } from "@/components/RiskBadge";

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await api.getMetrics();
                setMetrics(data);
            } catch (error) {
                console.error("Failed to fetch metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    const stats = [
        {
            name: "Total Questions",
            value: metrics?.total_questions || 0,
            icon: BrainCircuit,
            change: "+12%",
            changeType: "increase",
        },
        {
            name: "Avg Confidence",
            value: `${((metrics?.avg_confidence || 0) * 100).toFixed(1)}%`,
            icon: CheckCircle,
            change: "+2.1%",
            changeType: "increase",
        },
        {
            name: "Evidence Coverage",
            value: `${((metrics?.avg_evidence_coverage || 0) * 100).toFixed(1)}%`,
            icon: FileText,
            change: "+4.5%",
            changeType: "increase",
        },
        {
            name: "Risk Alerts",
            value: "3",
            icon: AlertTriangle,
            change: "-1",
            changeType: "decrease",
        },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of model risk intelligence and governance status.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="rounded-xl border border-border bg-card p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {stat.name}
                                </p>
                                <p className="text-2xl font-bold text-foreground mt-2">
                                    {stat.value}
                                </p>
                            </div>
                            <div className="rounded-full bg-primary/10 p-3 text-primary">
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs">
                            <span className="text-green-500 font-medium flex items-center">
                                {stat.change}
                                <ArrowUpRight className="h-3 w-3 ml-1" />
                            </span>
                            <span className="text-muted-foreground ml-2">from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-foreground">Risk Category Distribution</h3>
                        <Link href="/analytics" className="text-sm text-primary hover:underline">
                            View details
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(metrics?.risk_category_distribution || {}).map(([category, count]) => {
                            const total = metrics?.total_questions || 1;
                            const percentage = Math.round((count / total) * 100);

                            return (
                                <div key={category} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center">
                                            <RiskBadge category={category} />
                                        </div>
                                        <span className="text-muted-foreground">{count} queries ({percentage}%)</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary">
                                        <div
                                            className="h-2 rounded-full bg-primary"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {(!metrics?.risk_category_distribution || Object.keys(metrics.risk_category_distribution).length === 0) && (
                            <div className="text-center py-8 text-muted-foreground">
                                No data available yet. Start asking questions in the Intelligence tab.
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-3 rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-foreground">Recent Activity</h3>
                        <Link href="/intelligence" className="text-sm text-primary hover:underline">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-6">
                        <div className="relative border-l border-border pl-6 pb-6 last:pb-0">
                            <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full border border-border bg-background" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-foreground">
                                    New Model Card Uploaded
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    2 hours ago by Sarah Chen
                                </span>
                            </div>
                        </div>
                        <div className="relative border-l border-border pl-6 pb-6 last:pb-0">
                            <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full border border-border bg-background" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-foreground">
                                    Bias Audit Completed
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    5 hours ago • Found 2 risks
                                </span>
                            </div>
                        </div>
                        <div className="relative border-l border-border pl-6 pb-6 last:pb-0">
                            <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full border border-border bg-background" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-foreground">
                                    Validation Report Approved
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Yesterday by Michael Torres
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                        <Link
                            href="/documents"
                            className="flex w-full items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                        >
                            Upload New Document
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
