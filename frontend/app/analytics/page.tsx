"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ScatterChart,
    Scatter,
    ZAxis
} from "recharts";
import { api, SystemMetrics } from "@/lib/api";
import { BarChart3, TrendingUp, ShieldAlert, Activity, FileText } from "lucide-react";

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f97316', '#ef4444'];

export default function AnalyticsPage() {
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

    // Prepare data for charts
    const riskData = Object.entries(metrics?.risk_category_distribution || {}).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
    }));

    const confidenceData = Object.entries(metrics?.confidence_distribution || {}).map(([name, value]) => ({
        name,
        value
    }));

    const activityData = Object.entries(metrics?.questions_per_day || {}).map(([date, count]) => ({
        date,
        count
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Mock scatter data for confidence vs coverage if not available
    const scatterData = [
        { x: 0.85, y: 0.90, z: 10 },
        { x: 0.75, y: 0.80, z: 15 },
        { x: 0.60, y: 0.50, z: 5 },
        { x: 0.90, y: 0.95, z: 20 },
        { x: 0.40, y: 0.30, z: 3 },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
                <p className="text-muted-foreground">
                    System performance, risk distribution, and usage metrics.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                        <Activity className="h-4 w-4" />
                        <span className="text-sm font-medium">Total Queries</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{metrics?.total_questions}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">Avg Confidence</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                        {((metrics?.avg_confidence || 0) * 100).toFixed(1)}%
                    </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">Evidence Coverage</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                        {((metrics?.avg_evidence_coverage || 0) * 100).toFixed(1)}%
                    </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                        <ShieldAlert className="h-4 w-4" />
                        <span className="text-sm font-medium">Top Risk Category</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground capitalize">
                        {riskData.sort((a, b) => b.value - a.value)[0]?.name || "None"}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Risk Distribution Chart */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Risk Category Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Confidence Distribution Chart */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Confidence Score Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={confidenceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--accent))' }}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                                />
                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activity Chart */}
                <div className="rounded-xl border border-border bg-card p-6 col-span-2">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Query Activity (Last 30 Days)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--accent))' }}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                                />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
