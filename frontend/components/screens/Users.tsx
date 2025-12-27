import React from 'react';
import { Card } from '../Card';
import { Table, Column } from '../Table';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Plus, Mail, Shield } from 'lucide-react';

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

export function Users() {
  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-neutral-900">{user.name}</p>
            <p className="text-sm text-neutral-500">{user.email}</p>
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
      render: (user) => user.sso ? <Badge variant="info" size="sm">Yes</Badge> : <span className="text-neutral-400">No</span>
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
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="tertiary" size="sm">Edit</Button>
          <Button variant="tertiary" size="sm">Remove</Button>
        </div>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Users & Roles</h2>
          <p className="text-sm text-neutral-500 mt-1">Manage team members and permissions</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
          Invite User
        </Button>
      </div>
      
      {/* Users Table */}
      <Card padding="none">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">{mockUsers.length} total users</p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" icon={<Mail className="w-4 h-4" />}>
                Send Invites
              </Button>
            </div>
          </div>
        </div>
        <Table columns={columns} data={mockUsers} emptyMessage="No users found" />
      </Card>
      
      {/* Roles & Permissions */}
      <div>
        <h3 className="font-semibold text-neutral-900 mb-4">Roles & Permissions</h3>
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
          />
        </div>
      </div>
      
      {/* SSO Configuration */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-700 flex-shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900 mb-1">Single Sign-On (SSO)</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Configure SAML-based SSO for secure authentication through your identity provider
            </p>
            <div className="flex items-center gap-3">
              <Badge variant="success" size="sm" dot>Enabled</Badge>
              <span className="text-sm text-neutral-500">Okta • company.okta.com</span>
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

function RoleCard({ role, description, userCount, permissions, color }: {
  role: string;
  description: string;
  userCount: number;
  permissions: string[];
  color: 'danger' | 'warning' | 'info' | 'neutral';
}) {
  const colors = {
    danger: 'border-danger-200 bg-danger-50',
    warning: 'border-warning-200 bg-warning-50',
    info: 'border-info-200 bg-info-50',
    neutral: 'border-neutral-200 bg-neutral-50'
  };
  
  return (
    <Card className={`${colors[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-neutral-900">{role}</h4>
          <p className="text-sm text-neutral-600 mt-1">{description}</p>
        </div>
        <Badge variant={color} size="sm">{userCount} user{userCount !== 1 ? 's' : ''}</Badge>
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium text-neutral-700 mb-2">Permissions:</p>
        <ul className="space-y-1.5">
          {permissions.map((permission, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600">
              <span className="text-success-600 mt-0.5">✓</span>
              <span>{permission}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <Button variant="tertiary" size="sm" fullWidth>Edit Role</Button>
      </div>
    </Card>
  );
}
