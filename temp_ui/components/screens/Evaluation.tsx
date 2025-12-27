import React, { useState } from 'react';
import { Card, MetricCard } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Input } from '../Input';
import { Play, Upload, Download, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

export function Evaluation() {
  const [showNewEval, setShowNewEval] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Model Evaluation</h2>
          <p className="text-sm text-neutral-500 mt-1">Run tests and analyze model performance</p>
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
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="font-semibold text-neutral-900 mb-4">Performance Metrics Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-neutral-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Evaluation</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Accuracy</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Precision</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Recall</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">F1 Score</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Latency</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
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
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Confusion Matrix</h3>
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
            <div />
            <div className="text-center text-xs font-medium text-neutral-700 py-2">Predicted +</div>
            <div className="text-center text-xs font-medium text-neutral-700 py-2">Predicted -</div>
            <div className="text-xs font-medium text-neutral-700 py-2 flex items-center">Actual +</div>
            <div className="bg-success-100 text-success-900 text-center py-6 rounded-lg font-semibold text-lg">842</div>
            <div className="bg-danger-100 text-danger-900 text-center py-6 rounded-lg font-semibold text-lg">23</div>
            <div className="text-xs font-medium text-neutral-700 py-2 flex items-center">Actual -</div>
            <div className="bg-danger-100 text-danger-900 text-center py-6 rounded-lg font-semibold text-lg">31</div>
            <div className="bg-success-100 text-success-900 text-center py-6 rounded-lg font-semibold text-lg">754</div>
          </div>
        </div>
        
        {/* Test Cases */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Test Case Results</h3>
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
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="font-semibold text-neutral-900 mb-4">Performance by Intent</h3>
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
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Run New Evaluation</h3>
            <div className="space-y-4">
              <Input label="Evaluation Name" placeholder="e.g., Q1 2024 Model Test" />
              <Input label="Model" placeholder="Select model to evaluate" />
              <div>
                <label className="block text-sm text-neutral-900 font-medium mb-2">Test Dataset</label>
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-700">Upload CSV file with test Q&A pairs</p>
                  <p className="text-xs text-neutral-500 mt-1">Must include 'question' and 'expected_answer' columns</p>
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
    <div className="bg-white rounded-lg border border-neutral-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-neutral-500">Evaluation {id}</p>
          <h4 className="font-semibold text-neutral-900 mt-0.5">{model}</h4>
        </div>
        <Badge variant={statusConfig[status].variant} size="sm" dot>
          {statusConfig[status].label}
        </Badge>
      </div>
      {accuracy !== null && (
        <div className="mb-3">
          <p className="text-3xl font-bold text-neutral-900">{accuracy}%</p>
          <p className="text-sm text-neutral-500">Accuracy</p>
        </div>
      )}
      {status === 'running' && (
        <div className="mb-3">
          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-neutral-500">
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
    <tr className="hover:bg-neutral-50">
      <td className="py-3 px-4 text-sm text-neutral-900 font-medium">{id}</td>
      <td className="py-3 px-4 text-sm text-right text-neutral-900">{accuracy}%</td>
      <td className="py-3 px-4 text-sm text-right text-neutral-900">{precision}%</td>
      <td className="py-3 px-4 text-sm text-right text-neutral-900">{recall}%</td>
      <td className="py-3 px-4 text-sm text-right text-neutral-900">{f1}%</td>
      <td className="py-3 px-4 text-sm text-right text-neutral-900">{latency}</td>
      <td className="py-3 px-4 text-sm text-right text-neutral-900">{tokens}</td>
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
    <div className={`p-3 rounded-lg border ${match ? 'border-success-200 bg-success-50' : 'border-danger-200 bg-danger-50'}`}>
      <div className="flex items-start gap-2 mb-2">
        {match ? (
          <CheckCircle className="w-4 h-4 text-success-700 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-4 h-4 text-danger-700 flex-shrink-0 mt-0.5" />
        )}
        <p className="text-sm text-neutral-900 font-medium">{query}</p>
      </div>
      <div className="ml-6 text-xs space-y-1">
        <p className="text-neutral-600">Expected: <span className="text-neutral-900">{expected}</span></p>
        <p className="text-neutral-600">Actual: <span className="text-neutral-900">{actual}</span></p>
      </div>
    </div>
  );
}

function IntentMetric({ intent, accuracy, count }: { intent: string; accuracy: number; count: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-neutral-900">{intent.replace(/_/g, ' ')}</span>
          <span className="text-sm font-medium text-neutral-900">{accuracy}%</span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${accuracy >= 95 ? 'bg-success-500' : accuracy >= 90 ? 'bg-warning-500' : 'bg-danger-500'}`}
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>
      <span className="text-xs text-neutral-500 ml-4">{count} tests</span>
    </div>
  );
}
