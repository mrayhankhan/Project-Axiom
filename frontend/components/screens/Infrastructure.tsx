import React from 'react';
import { Card, MetricCard } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Server, Cpu, HardDrive, Activity, AlertCircle, CheckCircle } from 'lucide-react';

export function Infrastructure() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Infrastructure & DevOps</h2>
        <p className="text-sm text-neutral-500 mt-1">Monitor system health and manage resources</p>
      </div>
      
      {/* System Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="CPU Usage"
          value="42%"
          change="Normal range"
          trend="neutral"
          icon={<Cpu className="w-5 h-5" />}
        />
        <MetricCard
          label="Memory Usage"
          value="6.2 GB"
          change="of 16 GB"
          trend="neutral"
          icon={<Server className="w-5 h-5" />}
        />
        <MetricCard
          label="Storage Used"
          value="284 GB"
          change="of 500 GB"
          trend="neutral"
          icon={<HardDrive className="w-5 h-5" />}
        />
        <MetricCard
          label="Active Workers"
          value="8"
          change="All healthy"
          trend="up"
          icon={<Activity className="w-5 h-5" />}
        />
      </div>
      
      {/* Service Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-neutral-900 mb-4">Service Status</h3>
          <div className="space-y-3">
            <ServiceStatus
              name="API Gateway"
              status="healthy"
              uptime="99.98%"
              latency="42ms"
            />
            <ServiceStatus
              name="FAISS Vector Store"
              status="healthy"
              uptime="99.95%"
              latency="18ms"
            />
            <ServiceStatus
              name="Embedding Service"
              status="healthy"
              uptime="99.92%"
              latency="124ms"
            />
            <ServiceStatus
              name="Ingestion Queue"
              status="warning"
              uptime="99.87%"
              latency="312ms"
            />
            <ServiceStatus
              name="Database"
              status="healthy"
              uptime="100%"
              latency="8ms"
            />
          </div>
        </Card>
        
        <Card>
          <h3 className="font-semibold text-neutral-900 mb-4">Ingestion Queue</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-700">Jobs in Queue</span>
              <span className="text-2xl font-semibold text-neutral-900">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-700">Processing</span>
              <span className="text-2xl font-semibold text-primary-700">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-700">Completed Today</span>
              <span className="text-2xl font-semibold text-success-700">47</span>
            </div>
            <div className="pt-4 border-t border-neutral-200">
              <Button variant="secondary" size="sm" fullWidth>View Queue Details</Button>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Vector Store Details */}
      <Card>
        <h3 className="font-semibold text-neutral-900 mb-4">FAISS Vector Store</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Total Vectors</p>
            <p className="text-2xl font-semibold text-neutral-900">1,247,832</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Index Size</p>
            <p className="text-2xl font-semibold text-neutral-900">4.2 GB</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Last Rebuild</p>
            <p className="text-2xl font-semibold text-neutral-900">3 days ago</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Memory Usage</p>
            <p className="text-2xl font-semibold text-neutral-900">2.8 GB</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button variant="primary" size="sm">Rebuild Index</Button>
          <Button variant="secondary" size="sm">Create Snapshot</Button>
          <Button variant="secondary" size="sm">Optimize</Button>
        </div>
      </Card>
      
      {/* Recent Logs */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Recent Logs</h3>
          <Button variant="tertiary" size="sm">View All Logs</Button>
        </div>
        <div className="space-y-2 font-mono text-xs">
          <LogEntry level="info" message="Document indexed successfully: credit_model_v2.pdf" time="10:23:45" />
          <LogEntry level="info" message="Evaluation job started: #342" time="10:22:18" />
          <LogEntry level="warning" message="Ingestion queue latency increased to 312ms" time="10:15:33" />
          <LogEntry level="info" message="API request processed: POST /api/query" time="10:12:08" />
          <LogEntry level="error" message="Failed to parse document: corrupted_file.pdf" time="09:58:42" />
          <LogEntry level="info" message="Vector index optimized, 1.2M vectors" time="09:45:11" />
        </div>
      </Card>
      
      {/* Docker Containers */}
      <Card>
        <h3 className="font-semibold text-neutral-900 mb-4">Container Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ContainerCard name="axiom-api" status="running" uptime="5d 12h" />
          <ContainerCard name="axiom-worker" status="running" uptime="5d 12h" />
          <ContainerCard name="faiss-service" status="running" uptime="5d 12h" />
          <ContainerCard name="postgres-db" status="running" uptime="12d 8h" />
          <ContainerCard name="redis-cache" status="running" uptime="12d 8h" />
          <ContainerCard name="nginx-proxy" status="running" uptime="12d 8h" />
        </div>
      </Card>
    </div>
  );
}

function ServiceStatus({ name, status, uptime, latency }: {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  latency: string;
}) {
  const statusConfig = {
    healthy: { icon: CheckCircle, color: 'text-success-500', bg: 'bg-success-50' },
    warning: { icon: AlertCircle, color: 'text-warning-500', bg: 'bg-warning-50' },
    error: { icon: AlertCircle, color: 'text-danger-500', bg: 'bg-danger-50' }
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
        <div>
          <p className="font-medium text-neutral-900">{name}</p>
          <p className="text-xs text-neutral-500">Uptime: {uptime}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-neutral-900">{latency}</p>
        <p className="text-xs text-neutral-500">avg latency</p>
      </div>
    </div>
  );
}

function LogEntry({ level, message, time }: {
  level: 'info' | 'warning' | 'error';
  message: string;
  time: string;
}) {
  const colors = {
    info: 'text-neutral-600',
    warning: 'text-warning-700',
    error: 'text-danger-700'
  };
  
  return (
    <div className={`p-2 rounded ${level === 'error' ? 'bg-danger-50' : level === 'warning' ? 'bg-warning-50' : 'hover:bg-neutral-50'}`}>
      <span className="text-neutral-500">{time}</span>
      {' '}
      <span className={`font-semibold ${colors[level]}`}>[{level.toUpperCase()}]</span>
      {' '}
      <span className="text-neutral-900">{message}</span>
    </div>
  );
}

function ContainerCard({ name, status, uptime }: {
  name: string;
  status: 'running' | 'stopped';
  uptime: string;
}) {
  return (
    <div className="p-4 border border-neutral-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'running' ? 'bg-success-500' : 'bg-neutral-400'}`} />
          <span className="font-medium text-neutral-900">{name}</span>
        </div>
        <Badge variant={status === 'running' ? 'success' : 'neutral'} size="sm">
          {status}
        </Badge>
      </div>
      <p className="text-xs text-neutral-500 mb-3">Uptime: {uptime}</p>
      <Button variant="tertiary" size="sm" fullWidth>Restart</Button>
    </div>
  );
}
