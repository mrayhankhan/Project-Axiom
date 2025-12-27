"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, Column } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Reviewer' | 'Analyst' | 'Viewer';
    status: 'active' | 'inactive' | 'pending';
    lastLogin: string;
    sso: boolean;
}

const mockUsers: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: 'Admin',
        status: 'active',
        lastLogin: '2 hours ago',
        sso: true
    },
    {
        id: '2',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        role: 'Analyst',
        status: 'active',
        lastLogin: '1 hour ago',
        sso: true
    },
    {
        id: '3',
        name: 'Alice Johnson',
        email: 'alice.johnson@company.com',
        role: 'Reviewer',
        status: 'active',
        lastLogin: '3 days ago',
        sso: false
    },
    {
        id: '4',
        name: 'Bob Smith',
        email: 'bob.smith@company.com',
        role: 'Viewer',
        status: 'active',
        lastLogin: '1 week ago',
        sso: true
    },
    {
        id: '5',
        name: 'Emma Wilson',
        email: 'emma.wilson@company.com',
        role: 'Analyst',
        status: 'pending',
        lastLogin: 'Never',
        sso: false
    }
];

export default function Users() {
    const handleEditRole = (name: string) => {
        toast.info(`Edit role for ${name}`, {
            description: "Role management is currently under development."
        });
    };

    const handleInvite = () => {
        toast.info("Invite User", {
            description: "Invitation system is currently under development."
        });
    };

    const columns: Column<User>[] = [
        {
            key: 'name',
            header: 'User',
            sortable: true,
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-a30/10 rounded-full flex items-center justify-center text-primary-a40 font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p className="font-medium text-text-primary">{user.name}</p>
                        <p className="text-sm text-text-muted">{user.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            header: 'Role',
            sortable: true,
            width: '140px',
            render: (user) => {
                const variants = {
                    Admin: 'danger' as const,
                    Reviewer: 'warning' as const,
                    Analyst: 'info' as const,
                    Viewer: 'neutral' as const
                };
                return <Badge variant={variants[user.role]} size="sm">{user.role}</Badge>;
            }
        },
        {
            key: 'status',
            header: 'Status',
            width: '120px',
            render: (user) => {
                const variants = {
                    active: 'success' as const,
                    inactive: 'neutral' as const,
                    pending: 'warning' as const
                };
                return <Badge variant={variants[user.status]} size="sm" dot>{user.status}</Badge>;
            }
        },
        {
            key: 'sso',
            header: 'SSO',
            width: '80px',
            render: (user) => user.sso ? <Badge variant="info" size="sm">Yes</Badge> : <span className="text-text-muted">No</span>
        },
        {
            key: 'lastLogin',
            header: 'Last Login',
            sortable: true,
            width: '140px'
        },
        {
            key: 'actions',
            header: '',
            width: '140px',
            render: (user) => (
                <div className="flex items-center gap-2">
                    <Button variant="tertiary" size="sm" onClick={() => handleEditRole(user.name)}>Edit</Button>
                    <Button variant="tertiary" size="sm">Remove</Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary">Users & Roles</h2>
                    <p className="text-sm text-text-muted mt-1">Manage team members and permissions</p>
                </div>
                <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleInvite}>
                    Invite User
                </Button>
            </div>

            {/* Users Table */}
            <Card padding="none">
                <div className="p-4 border-b border-surface-a30">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-text-secondary">{mockUsers.length} total users</p>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" icon={<Mail className="w-4 h-4" />} onClick={handleInvite}>
                                Send Invites
                            </Button>
                        </div>
                    </div>
                </div>
                <Table columns={columns} data={mockUsers} emptyMessage="No users found" />
            </Card>

            {/* Roles & Permissions */}
            <div>
                <h3 className="font-semibold text-text-primary mb-4">Roles & Permissions</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <RoleCard
                        role="Admin"
                        description="Full access to all features and settings"
                        userCount={1}
                        permissions={[
                            'Manage users and roles',
                            'Configure workspace settings',
                            'Access all documents',
                            'Run evaluations',
                            'Manage risk incidents',
                            'View audit logs',
                            'Manage API keys'
                        ]}
                        color="danger"
                        onEdit={() => handleEditRole('Admin Role')}
                    />
                    <RoleCard
                        role="Reviewer"
                        description="Review and manage risk incidents and policies"
                        userCount={1}
                        permissions={[
                            'View all documents',
                            'Create and manage risk incidents',
                            'Review evaluation results',
                            'Comment on documents',
                            'Export reports'
                        ]}
                        color="warning"
                        onEdit={() => handleEditRole('Reviewer Role')}
                    />
                    <RoleCard
                        role="Analyst"
                        description="Run queries, evaluations, and analyze results"
                        userCount={2}
                        permissions={[
                            'Upload documents',
                            'Run Q&A queries',
                            'Run evaluations',
                            'View analytics',
                            'Download documents',
                            'Create annotations'
                        ]}
                        color="info"
                        onEdit={() => handleEditRole('Analyst Role')}
                    />
                    <RoleCard
                        role="Viewer"
                        description="Read-only access to documents and reports"
                        userCount={1}
                        permissions={[
                            'View documents',
                            'View analytics (read-only)',
                            'View evaluation results',
                            'Export reports'
                        ]}
                        color="neutral"
                        onEdit={() => handleEditRole('Viewer Role')}
                    />
                </div>
            </div>

            {/* SSO Configuration */}
            <Card>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-a30/10 rounded-lg flex items-center justify-center text-primary-a40 flex-shrink-0">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">Single Sign-On (SSO)</h3>
                        <p className="text-sm text-text-secondary mb-4">
                            Configure SAML-based SSO for secure authentication through your identity provider
                        </p>
                        <div className="flex items-center gap-3">
                            <Badge variant="success" size="sm" dot>Enabled</Badge>
                            <span className="text-sm text-text-muted">Okta • company.okta.com</span>
                        </div>
                        <div className="mt-4">
                            <Button variant="secondary" size="sm">Configure SSO</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function RoleCard({ role, description, userCount, permissions, color, onEdit }: {
    role: string;
    description: string;
    userCount: number;
    permissions: string[];
    color: 'danger' | 'warning' | 'info' | 'neutral';
    onEdit?: () => void;
}) {
    const colors = {
        danger: 'border-danger-a20/20 bg-danger-a20/10',
        warning: 'border-warning-a20/20 bg-warning-a20/10',
        info: 'border-info-a20/20 bg-info-a20/10',
        neutral: 'border-surface-a30 bg-surface-a10 dark:bg-surface-a20'
    };

    return (
        <Card className={`${colors[color]}`}>
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="font-semibold text-text-primary">{role}</h4>
                    <p className="text-sm text-text-secondary mt-1">{description}</p>
                </div>
                <Badge variant={color} size="sm">{userCount} user{userCount !== 1 ? 's' : ''}</Badge>
            </div>
            <div className="mt-4">
                <p className="text-xs font-medium text-text-primary mb-2">Permissions:</p>
                <ul className="space-y-1.5">
                    {permissions.map((permission, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                            <span className="text-success-a20 mt-0.5">✓</span>
                            <span>{permission}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4 pt-4 border-t border-surface-a30">
                <Button variant="tertiary" size="sm" fullWidth onClick={onEdit}>Edit Role</Button>
            </div>
        </Card>
    );
}
