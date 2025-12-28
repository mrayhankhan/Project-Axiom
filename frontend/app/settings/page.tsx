"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Key, Webhook, Database, Copy, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useSession } from 'next-auth/react';

export default function Settings() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<'workspace' | 'api' | 'integrations' | 'audit'>('workspace');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-text-primary">Settings</h2>
                <p className="text-sm text-text-muted mt-1">Manage workspace configuration and integrations</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-surface-a30">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('workspace')}
                        className={cn(
                            "pb-3 px-1 border-b-2 transition-colors",
                            activeTab === 'workspace'
                                ? 'border-primary-a30 text-primary-a40'
                                : 'border-transparent text-text-secondary hover:text-text-primary'
                        )}
                    >
                        Workspace
                    </button>
                    <button
                        onClick={() => setActiveTab('api')}
                        className={cn(
                            "pb-3 px-1 border-b-2 transition-colors",
                            activeTab === 'api'
                                ? 'border-primary-a30 text-primary-a40'
                                : 'border-transparent text-text-secondary hover:text-text-primary'
                        )}
                    >
                        API Keys
                    </button>
                    <button
                        onClick={() => setActiveTab('integrations')}
                        className={cn(
                            "pb-3 px-1 border-b-2 transition-colors",
                            activeTab === 'integrations'
                                ? 'border-primary-a30 text-primary-a40'
                                : 'border-transparent text-text-secondary hover:text-text-primary'
                        )}
                    >
                        Integrations
                    </button>
                    <button
                        onClick={() => setActiveTab('audit')}
                        className={cn(
                            "pb-3 px-1 border-b-2 transition-colors",
                            activeTab === 'audit'
                                ? 'border-primary-a30 text-primary-a40'
                                : 'border-transparent text-text-secondary hover:text-text-primary'
                        )}
                    >
                        Audit Logs
                    </button>
                </div>
            </div>

            {/* Workspace Settings */}
            {activeTab === 'workspace' && (
                <div className="space-y-6">
                    <Card>
                        <h3 className="font-semibold text-text-primary mb-4">Workspace Information</h3>
                        <div className="space-y-4">
                            <Input label="Workspace Name" defaultValue="Axiom Enterprise" />
                            <Select
                                label="Timezone"
                                options={[
                                    { value: 'UTC', label: 'UTC' },
                                    { value: 'America/New_York', label: 'Eastern Time (ET)' },
                                    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                                    { value: 'Europe/London', label: 'London (GMT)' }
                                ]}
                                defaultValue="America/New_York"
                            />
                            <Select
                                label="Default Language"
                                options={[
                                    { value: 'en', label: 'English' },
                                    { value: 'es', label: 'Spanish' },
                                    { value: 'fr', label: 'French' },
                                    { value: 'de', label: 'German' }
                                ]}
                                defaultValue="en"
                            />
                            <div className="pt-4">
                                <Button variant="primary">Save Changes</Button>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-semibold text-text-primary mb-4">Data Retention Policy</h3>
                        <div className="space-y-4">
                            <Select
                                label="Document Retention"
                                options={[
                                    { value: '30', label: '30 days' },
                                    { value: '90', label: '90 days' },
                                    { value: '180', label: '180 days' },
                                    { value: '365', label: '1 year' },
                                    { value: '-1', label: 'Indefinite' }
                                ]}
                                defaultValue="365"
                                helperText="How long to retain uploaded documents"
                            />
                            <Select
                                label="Audit Log Retention"
                                options={[
                                    { value: '90', label: '90 days' },
                                    { value: '180', label: '180 days' },
                                    { value: '365', label: '1 year' },
                                    { value: '730', label: '2 years' }
                                ]}
                                defaultValue="365"
                                helperText="How long to retain audit trail records"
                            />
                            <div className="pt-4">
                                <Button variant="primary">Update Policy</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* API Keys */}
            {activeTab === 'api' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-text-secondary">Manage API keys for programmatic access</p>
                        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                            Create API Key
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <APIKeyCard
                            name="Production API Key"
                            key_preview="ax_prod_••••••••••••4f2a"
                            created="2024-01-10"
                            lastUsed="2 hours ago"
                            usage="2.4M requests"
                        />
                        <APIKeyCard
                            name="Development API Key"
                            key_preview="ax_dev_••••••••••••8b3c"
                            created="2024-01-05"
                            lastUsed="1 day ago"
                            usage="842K requests"
                        />
                        <APIKeyCard
                            name="Testing API Key"
                            key_preview="ax_test_••••••••••••1a9d"
                            created="2024-01-01"
                            lastUsed="Never"
                            usage="0 requests"
                        />
                    </div>
                </div>
            )}

            {/* Integrations */}
            {activeTab === 'integrations' && (
                <div className="space-y-6">
                    <p className="text-sm text-text-secondary">Connect external data sources and services</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <IntegrationCard
                            name="Amazon S3"
                            description="Import documents from S3 buckets"
                            icon={<Database className="w-6 h-6" />}
                            connected={true}
                            bucket="axiom-docs-prod"
                        />
                        <IntegrationCard
                            name="SharePoint"
                            description="Sync documents from SharePoint"
                            icon={<Database className="w-6 h-6" />}
                            connected={true}
                            bucket="company.sharepoint.com"
                        />
                        <IntegrationCard
                            name="Google Drive"
                            description="Import documents from Google Drive"
                            icon={<Database className="w-6 h-6" />}
                            connected={false}
                        />
                        <IntegrationCard
                            name="Box"
                            description="Sync documents from Box"
                            icon={<Database className="w-6 h-6" />}
                            connected={false}
                        />
                    </div>

                    <Card>
                        <h3 className="font-semibold text-text-primary mb-4">Webhooks</h3>
                        <div className="space-y-3">
                            <WebhookItem
                                url="https://api.company.com/webhooks/axiom"
                                events={['evaluation.completed', 'document.indexed', 'risk.alert']}
                                status="active"
                            />
                            <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />}>
                                Add Webhook
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Audit Logs */}
            {activeTab === 'audit' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Input placeholder="Search audit logs..." className="flex-1" />
                        <Select
                            options={[
                                { value: 'all', label: 'All Actions' },
                                { value: 'document', label: 'Document Actions' },
                                { value: 'user', label: 'User Actions' },
                                { value: 'settings', label: 'Settings Changes' }
                            ]}
                            placeholder="Filter by action"
                            className="w-48"
                        />
                    </div>

                    <Card padding="none">
                        <div className="divide-y divide-surface-a30">
                            <AuditLogItem
                                action="Document uploaded"
                                user="Sarah Chen"
                                details="Credit Risk Model Documentation v2.3.pdf"
                                timestamp="2024-01-15 10:23:45"
                            />
                            <AuditLogItem
                                action="Evaluation started"
                                user={session?.user?.name || "User"}
                                details="Evaluation #342 for Claims Processor v2"
                                timestamp="2024-01-15 09:15:22"
                            />
                            <AuditLogItem
                                action="API key created"
                                user="Admin"
                                details="Production API Key"
                                timestamp="2024-01-14 14:32:11"
                            />
                            <AuditLogItem
                                action="User invited"
                                user={session?.user?.name || "User"}
                                details="alice.johnson@company.com as Analyst"
                                timestamp="2024-01-14 11:08:33"
                            />
                            <AuditLogItem
                                action="Risk alert created"
                                user="System"
                                details="Model drift detected in Claims Processor v2"
                                timestamp="2024-01-13 16:42:18"
                            />
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

function APIKeyCard({ name, key_preview, created, lastUsed, usage }: {
    name: string;
    key_preview: string;
    created: string;
    lastUsed: string;
    usage: string;
}) {
    return (
        <Card>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Key className="w-4 h-4 text-text-muted" />
                        <h4 className="font-medium text-text-primary">{name}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                        <code className="px-2 py-1 bg-surface-a20 rounded font-mono text-xs">{key_preview}</code>
                        <button className="text-primary-a40 hover:text-primary-a50" title="Copy full key">
                            <Copy className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span>Created {created}</span>
                        <span>•</span>
                        <span>Last used {lastUsed}</span>
                        <span>•</span>
                        <span>{usage}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="tertiary" size="sm">Configure</Button>
                    <Button variant="danger" size="sm" icon={<Trash2 className="w-4 h-4" />}>
                        Revoke
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function IntegrationCard({ name, description, icon, connected, bucket }: {
    name: string;
    description: string;
    icon: React.ReactNode;
    connected: boolean;
    bucket?: string;
}) {
    return (
        <Card>
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-a30/10 rounded-lg flex items-center justify-center text-primary-a40 flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-text-primary">{name}</h4>
                        {connected && <Badge variant="success" size="sm" dot>Connected</Badge>}
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{description}</p>
                    {bucket && (
                        <p className="text-xs text-text-muted font-mono">{bucket}</p>
                    )}
                    <div className="mt-3">
                        {connected ? (
                            <div className="flex items-center gap-2">
                                <Button variant="secondary" size="sm">Configure</Button>
                                <Button variant="tertiary" size="sm">Disconnect</Button>
                            </div>
                        ) : (
                            <Button variant="primary" size="sm">Connect</Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

function WebhookItem({ url, events, status }: {
    url: string;
    events: string[];
    status: 'active' | 'inactive';
}) {
    return (
        <div className="flex items-start justify-between p-4 border border-surface-a30 rounded-lg">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Webhook className="w-4 h-4 text-text-muted" />
                    <code className="text-sm text-text-primary font-mono">{url}</code>
                    <Badge variant={status === 'active' ? 'success' : 'neutral'} size="sm" dot>
                        {status}
                    </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                    {events.map((event) => (
                        <Badge key={event} variant="neutral" size="sm">{event}</Badge>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
                <Button variant="tertiary" size="sm">Test</Button>
                <Button variant="tertiary" size="sm">Edit</Button>
            </div>
        </div>
    );
}

function AuditLogItem({ action, user, details, timestamp }: {
    action: string;
    user: string;
    details: string;
    timestamp: string;
}) {
    return (
        <div className="p-4 hover:bg-surface-a20 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-text-primary">{action}</span>
                        <Badge variant="neutral" size="sm">{user}</Badge>
                    </div>
                    <p className="text-sm text-text-secondary">{details}</p>
                </div>
                <span className="text-xs text-text-muted whitespace-nowrap ml-4">{timestamp}</span>
            </div>
        </div>
    );
}
