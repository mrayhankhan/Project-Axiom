import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Search, Bell, Upload, Plus, Menu, ChevronDown, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { Button } from './button';
import { Badge } from './badge';
import { Input } from './input';
import { cn } from '@/lib/utils';

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
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    const { data: session } = useSession();
    const user = session?.user;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(searchQuery);
    };

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
        toast.success('Signed out successfully');
    };

    const handleMenuAction = (action: string) => {
        toast.info(`${action} is coming soon!`, {
            description: "This feature is currently under development."
        });
        setShowAccountMenu(false);
    };

    const handleGlobalAction = (action: string) => {
        toast.info(`${action} initiated`, {
            description: "This global action is not yet fully implemented."
        });
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="bg-surface-a10 dark:bg-surface-a20 border-b border-surface-a30 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 lg:px-6 h-16">
                {/* Left section */}
                <div className="flex items-center gap-4 flex-1">
                    {onMenuClick && (
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 hover:bg-surface-a20 rounded-md transition-colors"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5 text-text-primary" />
                        </button>
                    )}

                    <div className="flex-1 max-w-2xl">
                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && <span>/</span>}
                                        <span className={index === breadcrumbs.length - 1 ? 'text-text-primary' : 'hover:text-text-primary cursor-pointer'}>
                                            {crumb}
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
                    </div>
                </div>

                {/* Center - Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-4">
                    <form onSubmit={handleSearch} className="w-full relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search documents, models, policies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "w-full pl-10 pr-4 py-2 rounded-md border transition-all text-sm",
                                "bg-surface-a10 dark:bg-surface-a20 border-surface-a40",
                                "focus:border-primary-a30 focus:ring-2 focus:ring-primary-a30/25",
                                "text-text-primary placeholder:text-text-muted"
                            )}
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
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<Upload className="w-4 h-4" />}
                            onClick={() => handleGlobalAction('Upload')}
                        >
                            Upload
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            icon={<Plus className="w-4 h-4" />}
                            onClick={() => handleGlobalAction('New Item')}
                        >
                            New
                        </Button>
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 hover:bg-surface-a20 rounded-md transition-colors"
                            aria-label="Notifications"
                        >
                            <Bell className="w-5 h-5 text-text-secondary" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-a20 rounded-full" />
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-surface-a10 dark:bg-surface-a20 rounded-lg shadow-lg border border-surface-a30 z-50">
                                <div className="p-4 border-b border-surface-a30">
                                    <h3 className="font-semibold text-text-primary">Notifications</h3>
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
                                <div className="p-3 border-t border-surface-a30 text-center">
                                    <button className="text-sm text-primary-a40 hover:text-primary-a50">
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
                            className="flex items-center gap-2 p-1 hover:bg-surface-a20 rounded-md transition-colors"
                            aria-label="Account menu"
                        >
                            <div className="w-8 h-8 bg-primary-a30 rounded-full flex items-center justify-center text-white text-sm font-medium overflow-hidden">
                                {user?.image ? (
                                    <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{(user?.name || 'U').charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <ChevronDown className="w-4 h-4 text-text-secondary hidden lg:block" />
                        </button>

                        {showAccountMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-surface-a10 dark:bg-surface-a20 rounded-lg shadow-lg border border-surface-a30 z-50">
                                <div className="p-3 border-b border-surface-a30">
                                    <p className="font-medium text-text-primary">{user?.name || 'Guest User'}</p>
                                    <p className="text-sm text-text-muted">{user?.email || 'No email'}</p>
                                </div>
                                <div className="py-2">
                                    <MenuItem label="Profile Settings" onClick={() => handleMenuAction('Profile Settings')} />
                                    <MenuItem label="Team Settings" onClick={() => handleMenuAction('Team Settings')} />
                                    <MenuItem label="Keyboard Shortcuts" onClick={() => handleMenuAction('Keyboard Shortcuts')} />
                                    <MenuItem label="Documentation" onClick={() => handleMenuAction('Documentation')} />
                                </div>
                                <div className="py-2 border-t border-surface-a30">
                                    <button
                                        onClick={toggleTheme}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-surface-a20 transition-colors text-text-secondary hover:text-text-primary flex items-center justify-between"
                                    >
                                        <span>Theme</span>
                                        {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                    </button>
                                    <MenuItem label="Sign Out" variant="danger" onClick={handleSignOut} />
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
    const bgColor = unread ? 'bg-primary-a30/5' : 'bg-surface-a10 dark:bg-surface-a20';
    const iconColor = type === 'warning' ? 'text-warning-a20' : type === 'error' ? 'text-danger-a20' : 'text-primary-a30';

    return (
        <div className={cn("p-4 border-b border-surface-a30 hover:bg-surface-a20 cursor-pointer", bgColor)}>
            <div className="flex gap-3">
                <div className={cn("w-2 h-2 mt-1.5 rounded-full", unread ? iconColor : 'bg-transparent')} />
                <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{title}</p>
                    <p className="text-sm text-text-secondary mt-0.5">{message}</p>
                    <p className="text-xs text-text-muted mt-1">{time}</p>
                </div>
            </div>
        </div>
    );
}

function MenuItem({ label, variant = 'default', onClick }: { label: string; variant?: 'default' | 'danger'; onClick?: () => void }) {
    const textColor = variant === 'danger' ? 'text-danger-a20 hover:text-danger-a30' : 'text-text-secondary hover:text-text-primary';

    return (
        <button
            onClick={onClick}
            className={cn("w-full px-4 py-2 text-left text-sm hover:bg-surface-a20 transition-colors", textColor)}
        >
            {label}
        </button>
    );
}
