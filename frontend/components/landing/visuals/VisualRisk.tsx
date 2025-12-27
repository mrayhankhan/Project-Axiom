import React from 'react';
import { themeTokens, ThemeType } from '@/tokens/theme-tokens';
import styles from '@/styles/landing.module.css';

interface VisualProps {
    theme: ThemeType;
    inView: boolean;
    progress: number;
}

export const VisualRisk: React.FC<VisualProps> = ({ theme, inView, progress }) => {
    const colors = themeTokens[theme];

    // Staggered entry for cards
    const getCardStyle = (index: number) => {
        const start = index * 0.2;
        const p = Math.max(0, Math.min(1, (progress - start) * 2)); // Fast pop-in
        return {
            opacity: p,
            transform: `translateY(${(1 - p) * 20}px) scale(${0.8 + (p * 0.2)})`
        };
    };

    return (
        <div className="w-full h-full flex items-center justify-center relative p-8">
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {/* Safe Card */}
                <div
                    className="p-4 rounded-xl border shadow-sm flex flex-col gap-2"
                    style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.grid,
                        ...getCardStyle(0)
                    }}
                >
                    <div className="flex justify-between items-center">
                        <div className="h-2 w-16 rounded bg-current opacity-30" style={{ color: colors.text }} />
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }} />
                    </div>
                    <div className="h-1.5 w-full rounded bg-current opacity-10" style={{ color: colors.text }} />
                    <div className="h-1.5 w-2/3 rounded bg-current opacity-10" style={{ color: colors.text }} />
                </div>

                {/* Risk Card */}
                <div
                    className="p-4 rounded-xl border shadow-md flex flex-col gap-2 relative overflow-hidden"
                    style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.danger,
                        ...getCardStyle(1)
                    }}
                >
                    {/* Pulse Effect */}
                    <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-red-500/20 ${styles['pulse-ring']}`} />

                    <div className="flex justify-between items-center relative z-10">
                        <div className="h-2 w-16 rounded bg-current opacity-30" style={{ color: colors.text }} />
                        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: colors.danger }}>
                            HIGH RISK
                        </div>
                    </div>
                    <div className="h-1.5 w-full rounded bg-current opacity-10" style={{ color: colors.text }} />
                    <div className="h-1.5 w-2/3 rounded bg-current opacity-10" style={{ color: colors.text }} />
                </div>

                {/* Another Safe Card */}
                <div
                    className="p-4 rounded-xl border shadow-sm flex flex-col gap-2 col-span-2"
                    style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.grid,
                        ...getCardStyle(2)
                    }}
                >
                    <div className="flex justify-between items-center">
                        <div className="h-2 w-24 rounded bg-current opacity-30" style={{ color: colors.text }} />
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }} />
                    </div>
                    <div className="h-1.5 w-full rounded bg-current opacity-10" style={{ color: colors.text }} />
                </div>
            </div>
        </div>
    );
};
