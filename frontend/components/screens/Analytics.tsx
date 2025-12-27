import React from 'react';
import { Card, MetricCard } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Download, TrendingUp, Activity, Clock, Zap } from 'lucide-react';

export function Analytics() {
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
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-neutral-900">Query Volume Trend</h3>
            <p className="text-sm text-neutral-500 mt-1">Daily query count over time</p>
          </div>
          <select className="px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:border-primary-500 focus:ring-2 focus:ring-primary-200">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
        <div className="h-64">
          <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#0077a3"
              strokeWidth="2"
              points="0,150 100,140 200,120 300,130 400,100 500,110 600,80 700,90 800,60"
            />
            <polyline
              fill="url(#gradient)"
              points="0,150 100,140 200,120 300,130 400,100 500,110 600,80 700,90 800,60 800,200 0,200"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0077a3" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0077a3" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="flex justify-between mt-4 text-xs text-neutral-500">
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
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Response Time Distribution</h3>
          <div className="space-y-3">
            <LatencyBar range="0-50ms" count={8234} percentage={33} color="bg-success-500" />
            <LatencyBar range="50-100ms" count={10142} percentage={41} color="bg-success-500" />
            <LatencyBar range="100-200ms" count={4825} percentage={19} color="bg-warning-500" />
            <LatencyBar range="200-500ms" count={1246} percentage={5} color="bg-warning-500" />
            <LatencyBar range="500ms+" count={400} percentage={2} color="bg-danger-500" />
          </div>
        </div>
        
        {/* Top Documents */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Most Referenced Documents</h3>
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
        <div className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Token Usage by Model</h3>
          <div className="space-y-4">
            <TokenUsageBar model="GPT-4" tokens="1.2M" cost="$24.50" percentage={50} />
            <TokenUsageBar model="GPT-3.5 Turbo" tokens="800K" cost="$8.20" percentage={33} />
            <TokenUsageBar model="Claude 2" tokens="400K" cost="$12.80" percentage={17} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Cost Summary</h3>
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-neutral-900">$45.50</p>
              <p className="text-sm text-neutral-500 mt-1">Total this month</p>
            </div>
            <div className="space-y-2 pt-4 border-t border-neutral-200">
              <CostItem label="Model API" amount="$32.70" />
              <CostItem label="Embeddings" amount="$8.50" />
              <CostItem label="Storage" amount="$4.30" />
            </div>
          </div>
        </div>
      </div>
      
      {/* User Activity */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="font-semibold text-neutral-900 mb-4">User Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <UserActivityCard name="Sarah Chen" queries={847} role="Analyst" />
          <UserActivityCard name="John Doe" queries={623} role="Admin" />
          <UserActivityCard name="Alice Johnson" queries={542} role="Reviewer" />
          <UserActivityCard name="Bob Smith" queries={312} role="Viewer" />
        </div>
      </div>
    </div>
  );
}

function LatencyBar({ range, count, percentage, color }: { range: string; count: number; percentage: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-neutral-700">{range}</span>
        <span className="text-sm text-neutral-600">{count.toLocaleString()} queries</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
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
    up: 'text-success-500',
    down: 'text-danger-500',
    neutral: 'text-neutral-500'
  };
  
  return (
    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">{name}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{queries.toLocaleString()} queries</p>
      </div>
      <span className={`text-lg ${trendColors[trend]}`}>{trendIcons[trend]}</span>
    </div>
  );
}

function TokenUsageBar({ model, tokens, cost, percentage }: { model: string; tokens: string; cost: string; percentage: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-900">{model}</span>
        <div className="text-right">
          <p className="text-sm text-neutral-900">{tokens}</p>
          <p className="text-xs text-neutral-500">{cost}</p>
        </div>
      </div>
      <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function CostItem({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-600">{label}</span>
      <span className="font-medium text-neutral-900">{amount}</span>
    </div>
  );
}

function UserActivityCard({ name, queries, role }: { name: string; queries: number; role: string }) {
  return (
    <div className="p-4 border border-neutral-200 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-neutral-900 truncate">{name}</p>
          <p className="text-xs text-neutral-500">{role}</p>
        </div>
      </div>
      <p className="text-2xl font-semibold text-neutral-900">{queries}</p>
      <p className="text-xs text-neutral-500 mt-0.5">queries this month</p>
    </div>
  );
}
