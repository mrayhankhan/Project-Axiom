import React from 'react';
import { Search, Bell, Upload, Plus, Menu, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

export interface TopBarProps {
  title: string;
  breadcrumbs?: string[];
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
  environmentTag?: 'dev' | 'staging' | 'prod';
}

export function TopBar({ title, breadcrumbs, onMenuClick, onSearch, environmentTag = 'prod' }: TopBarProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showAccountMenu, setShowAccountMenu] = React.useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };
  
  const envStyles = {
    dev: 'bg-info-100 text-info-700 border-info-200',
    staging: 'bg-warning-100 text-warning-700 border-warning-200',
    prod: 'bg-success-100 text-success-700 border-success-200'
  };
  
  return (
    <div className="bg-white border-b border-neutral-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left section */}
        <div className="flex items-center gap-4 flex-1">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-neutral-700" />
            </button>
          )}
          
          <div className="flex-1 max-w-2xl">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <span>/</span>}
                    <span className={index === breadcrumbs.length - 1 ? 'text-neutral-900' : 'hover:text-neutral-700 cursor-pointer'}>
                      {crumb}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}
            <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
          </div>
        </div>
        
        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search documents, models, policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-sm"
            />
          </form>
        </div>
        
        {/* Right section */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Environment tag */}
          <Badge variant={environmentTag === 'dev' ? 'info' : environmentTag === 'staging' ? 'warning' : 'success'} size="sm">
            {environmentTag.toUpperCase()}
          </Badge>
          
          {/* Quick actions - hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Upload className="w-4 h-4" />}>
              Upload
            </Button>
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
              New
            </Button>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-neutral-100 rounded-md transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-neutral-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="font-semibold text-neutral-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <NotificationItem
                    title="Evaluation complete"
                    message="Model evaluation run #342 completed successfully"
                    time="5 min ago"
                    unread
                  />
                  <NotificationItem
                    title="High risk alert"
                    message="Model 'Claims Processor v2' flagged for review"
                    time="1 hour ago"
                    type="warning"
                  />
                  <NotificationItem
                    title="Document indexed"
                    message="15 documents successfully indexed to FAISS"
                    time="3 hours ago"
                  />
                </div>
                <div className="p-3 border-t border-neutral-200 text-center">
                  <button className="text-sm text-primary-700 hover:text-primary-900">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Account menu */}
          <div className="relative">
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="flex items-center gap-2 p-1 hover:bg-neutral-100 rounded-md transition-colors"
              aria-label="Account menu"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-700 hidden lg:block" />
            </button>
            
            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
                <div className="p-3 border-b border-neutral-200">
                  <p className="font-medium text-neutral-900">John Doe</p>
                  <p className="text-sm text-neutral-500">john.doe@company.com</p>
                </div>
                <div className="py-2">
                  <MenuItem label="Profile Settings" />
                  <MenuItem label="Team Settings" />
                  <MenuItem label="Keyboard Shortcuts" />
                  <MenuItem label="Documentation" />
                </div>
                <div className="py-2 border-t border-neutral-200">
                  <MenuItem label="Sign Out" variant="danger" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ title, message, time, unread = false, type = 'default' }: {
  title: string;
  message: string;
  time: string;
  unread?: boolean;
  type?: 'default' | 'warning' | 'error';
}) {
  const bgColor = unread ? 'bg-primary-50' : 'bg-white';
  const iconColor = type === 'warning' ? 'text-warning-500' : type === 'error' ? 'text-danger-500' : 'text-primary-500';
  
  return (
    <div className={`p-4 border-b border-neutral-200 hover:bg-neutral-50 cursor-pointer ${bgColor}`}>
      <div className="flex gap-3">
        <div className={`w-2 h-2 mt-1.5 rounded-full ${unread ? iconColor : 'bg-transparent'}`} />
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-900">{title}</p>
          <p className="text-sm text-neutral-600 mt-0.5">{message}</p>
          <p className="text-xs text-neutral-500 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ label, variant = 'default' }: { label: string; variant?: 'default' | 'danger' }) {
  const textColor = variant === 'danger' ? 'text-danger-500 hover:text-danger-700' : 'text-neutral-700 hover:text-neutral-900';
  
  return (
    <button className={`w-full px-4 py-2 text-left text-sm ${textColor} hover:bg-neutral-50 transition-colors`}>
      {label}
    </button>
  );
}
