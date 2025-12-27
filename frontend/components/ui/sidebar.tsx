import React, { useState } from 'react';
import {
  LayoutDashboard, MessageSquare, FileText, BarChart3,
  AlertTriangle, FlaskConical, Users, Settings,
  Server, HelpCircle, ChevronLeft, Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export interface SidebarProps {
  onNavigate: (id: string) => void;
  activeItem: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ onNavigate, activeItem, collapsed = false, onToggleCollapse }: SidebarProps) {
  const navGroups: NavGroup[] = [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> }
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'qa', label: 'Q&A', icon: <MessageSquare className="w-5 h-5" /> },
        { id: 'documents', label: 'Documents', icon: <FileText className="w-5 h-5" /> }
      ]
    },
    {
      title: 'Analysis',
      items: [
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
        { id: 'risk', label: 'Risk', icon: <AlertTriangle className="w-5 h-5" />, badge: 3 },
        { id: 'evaluation', label: 'Evaluation', icon: <FlaskConical className="w-5 h-5" /> }
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'users', label: 'Users & Roles', icon: <Users className="w-5 h-5" /> },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
        { id: 'infrastructure', label: 'Infrastructure', icon: <Server className="w-5 h-5" /> }
      ]
    },
    {
      items: [
        { id: 'help', label: 'Help', icon: <HelpCircle className="w-5 h-5" /> }
      ]
    }
  ];

  return (
    <aside className={cn(
      "h-screen flex flex-col transition-all duration-300 border-r",
      "bg-surface-a10 dark:bg-surface-a20 border-surface-a30 text-text-primary",
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b border-surface-a30",
        collapsed ? 'justify-center' : ''
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-a30 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-lg font-semibold">Axiom</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary-a30 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className={`${groupIndex > 0 ? 'mt-6' : ''}`}>
            {group.title && !collapsed && (
              <div className="px-3 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {group.title}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
                    collapsed ? 'justify-center' : '',
                    activeItem === item.id
                      ? 'bg-primary-a30/10 text-primary-a40 font-medium'
                      : 'text-text-secondary hover:bg-surface-a20 dark:hover:bg-surface-a30 hover:text-text-primary'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-danger-a20 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer - Collapse Toggle */}
      {onToggleCollapse && (
        <div className={cn(
          "p-4 border-t border-surface-a30",
          collapsed ? 'flex justify-center' : ''
        )}>
          <button
            onClick={onToggleCollapse}
            className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", collapsed ? 'rotate-180' : '')} />
            {!collapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      )}
    </aside>
  );
}

export function MobileSidebar({ onNavigate, activeItem, isOpen, onClose }: SidebarProps & { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-surface-a10 dark:bg-surface-a20 z-50 lg:hidden">
        <Sidebar onNavigate={(id) => { onNavigate(id); onClose(); }} activeItem={activeItem} />
      </div>
    </>
  );
}
