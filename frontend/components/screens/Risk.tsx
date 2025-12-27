import React from 'react';
import { Card, MetricCard } from '../Card';
import { Table, Column } from '../Table';
import { Button } from '../Button';
import { RiskBadge, Badge } from '../Badge';
import { AlertTriangle, TrendingUp, Shield, Plus } from 'lucide-react';

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

export function Risk() {
  const columns: Column<RiskIncident>[] = [
    {
      key: 'title',
      header: 'Incident',
      sortable: true,
      render: (incident) => (
        <div>
          <p className="font-medium text-neutral-900">{incident.title}</p>
          <p className="text-sm text-neutral-500 mt-0.5">{incident.model}</p>
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
        <span className={incident.sla.includes('hour') ? 'text-danger-700 font-medium' : 'text-neutral-900'}>
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
        <div className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-neutral-900">Risk Distribution</h3>
            <select className="px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:border-primary-500 focus:ring-2 focus:ring-primary-200">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="space-y-4">
            <RiskBar label="Critical" count={3} total={75} color="bg-danger-500" />
            <RiskBar label="High" count={12} total={75} color="bg-[#f97316]" />
            <RiskBar label="Medium" count={18} total={75} color="bg-warning-500" />
            <RiskBar label="Low" count={42} total={75} color="bg-success-500" />
          </div>
        </div>
        
        {/* Top Risk Models */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Top Risk Models</h3>
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
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Risk Incidents</h3>
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
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Policy Compliance</h3>
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
        
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Recent Resolutions</h3>
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
        <span className="text-sm font-medium text-neutral-900">{label}</span>
        <span className="text-sm text-neutral-600">{count} incidents</span>
      </div>
      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
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
    up: 'text-danger-500',
    down: 'text-success-500',
    neutral: 'text-neutral-500'
  };
  
  const scoreColor = score >= 7 ? 'text-danger-700' : score >= 5 ? 'text-warning-700' : 'text-success-700';
  
  return (
    <div className="p-3 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-neutral-900 truncate">{name}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{issues} active issue{issues !== 1 ? 's' : ''}</p>
        </div>
        <div className={`text-lg font-semibold ${scoreColor}`}>{score.toFixed(1)}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs ${trendColors[trend]}`}>{trendIcons[trend]}</span>
        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${score >= 7 ? 'bg-danger-500' : score >= 5 ? 'bg-warning-500' : 'bg-success-500'}`} 
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
    pass: 'bg-success-500',
    warning: 'bg-warning-500',
    fail: 'bg-danger-500'
  };
  
  return (
    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
        <div>
          <p className="text-sm font-medium text-neutral-900">{name}</p>
          <p className="text-xs text-neutral-500">{compliant}/{total} models compliant</p>
        </div>
      </div>
      <span className="text-sm text-neutral-600">{Math.round((compliant / total) * 100)}%</span>
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
    <div className="p-3 border border-neutral-200 rounded-lg">
      <p className="text-sm font-medium text-neutral-900 mb-1">{title}</p>
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>{resolvedBy} • {date}</span>
        <Badge variant="success" size="sm">{duration}</Badge>
      </div>
    </div>
  );
}
