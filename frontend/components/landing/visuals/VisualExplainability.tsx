import React from 'react';
import { themeTokens, ThemeType } from '@/tokens/theme-tokens';
import styles from '@/styles/landing.module.css';

interface VisualProps {
    theme: ThemeType;
    inView: boolean;
    progress: number;
}

export const VisualExplainability: React.FC<VisualProps> = ({ theme, inView, progress }) => {
    const colors = themeTokens[theme];

    // Spotlight position moves across text
    const spotlightX = -50 + (progress * 200); // -50% to 150%

    // Citation line animation
    const lineDashOffset = 100 - (progress * 100);

    return (
        <div className="w-full h-full flex items-center justify-center relative p-8 overflow-hidden">
            <div className="flex gap-8 items-start max-w-2xl">
                {/* Document Text with Spotlight */}
                <div className="flex-1 relative p-6 rounded-xl border" style={{ backgroundColor: colors.surface, borderColor: colors.grid }}>
                    <div className="space-y-3 relative z-10">
                        <div className="h-2 w-full rounded bg-current opacity-10" style={{ color: colors.text }} />
                        <div className="h-2 w-5/6 rounded bg-current opacity-10" style={{ color: colors.text }} />
                        <div className="h-2 w-full rounded bg-current opacity-10" style={{ color: colors.text }} />

                        {/* Highlighted Span */}
                        <div className="relative inline-block w-3/4 h-2 rounded bg-yellow-400/30">
                            {/* Connector Start Point */}
                            <div className="absolute right-0 top-1/2 w-2 h-2 bg-yellow-400 rounded-full translate-x-1/2 -translate-y-1/2"
                                style={{ opacity: progress > 0.3 ? 1 : 0, transition: 'opacity 0.3s' }} />
                        </div>

                        <div className="h-2 w-4/5 rounded bg-current opacity-10" style={{ color: colors.text }} />
                    </div>

                    {/* Spotlight Overlay */}
                    <div
                        className={`absolute inset-0 pointer-events-none ${styles['spotlight-gradient']}`}
                        style={{
                            transform: `translateX(${spotlightX}%) skewX(-20deg)`,
                            opacity: 0.5
                        }}
                    />
                </div>

                {/* Citation Card */}
                <div
                    className="w-48 p-4 rounded-xl border shadow-lg transition-all duration-500"
                    style={{
                        backgroundColor: colors.surfaceHighlight,
                        borderColor: colors.warning,
                        opacity: progress > 0.4 ? 1 : 0,
                        transform: `translateY(${progress > 0.4 ? 0 : 20}px)`
                    }}
                >
                    <div className="text-xs font-bold mb-2" style={{ color: colors.warning }}>Citation #1</div>
                    <div className="h-1.5 w-full rounded mb-2 bg-current opacity-20" style={{ color: colors.text }} />
                    <div className="h-1.5 w-2/3 rounded bg-current opacity-20" style={{ color: colors.text }} />
                </div>
            </div>

            {/* SVG Connector Layer */}
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
                <path
                    d="M 180 140 C 220 140, 220 140, 260 140"
                    fill="none"
                    stroke={colors.warning}
                    strokeWidth="2"
                    strokeDasharray="100"
                    strokeDashoffset={Math.max(0, lineDashOffset)}
                    style={{ opacity: progress > 0.3 ? 1 : 0 }}
                />
            </svg>
        </div>
    );
};
