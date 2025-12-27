import React from 'react';
import { cn } from '@/lib/utils';

export interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    onClose?: () => void;
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    const styles = {
        success: 'bg-success-a20/10 border-success-a20/20 text-success-a20',
        error: 'bg-danger-a20/10 border-danger-a20/20 text-danger-a20',
        warning: 'bg-warning-a20/10 border-warning-a20/20 text-warning-a20',
        info: 'bg-info-a20/10 border-info-a20/20 text-info-a20'
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    return (
        <div className={cn(
            "fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border shadow-lg animate-slide-in",
            styles[type]
        )}>
            <div className="flex items-start gap-3">
                <span className="text-lg">{icons[type]}</span>
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        onClose?.();
                    }}
                    className="text-current opacity-70 hover:opacity-100 transition-opacity"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeStyles = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={cn(
                "relative bg-surface-a10 dark:bg-surface-a20 rounded-lg shadow-xl w-full flex flex-col max-h-[90vh]",
                sizeStyles[size]
            )}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-surface-a30">
                    <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-surface-a30 rounded transition-colors text-text-muted hover:text-text-primary"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 text-text-primary">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 border-t border-surface-a30 bg-tonal-a10 dark:bg-tonal-a20 rounded-b-lg">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

export interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
    return (
        <label className={cn(
            "flex items-center gap-3",
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        )}>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only"
                />
                <div className={cn(
                    "w-11 h-6 rounded-full transition-colors",
                    checked ? 'bg-primary-a30' : 'bg-surface-a40'
                )}>
                    <div className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform",
                        checked ? 'translate-x-5' : 'translate-x-0'
                    )} />
                </div>
            </div>
            {label && <span className="text-sm text-text-primary">{label}</span>}
        </label>
    );
}

export function EmptyState({
    icon,
    title,
    description,
    action
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 bg-surface-a20 rounded-full flex items-center justify-center text-text-muted mb-4">
                {icon}
            </div>
            <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
            <p className="text-text-muted mb-6 max-w-sm">{description}</p>
            {action}
        </div>
    );
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={cn("animate-pulse bg-surface-a30 rounded", className)} />
    );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <svg
            className={cn("animate-spin text-primary-a30", sizes[size])}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}
