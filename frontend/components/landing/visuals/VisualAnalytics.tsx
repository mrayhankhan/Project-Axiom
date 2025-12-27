import React from 'react';
import { themeTokens, ThemeType } from '@/tokens/theme-tokens';

interface VisualProps {
    theme: ThemeType;
    inView: boolean;
    progress: number;
}

export const VisualAnalytics: React.FC<VisualProps> = ({ theme, inView, progress }) => {
    const colors = themeTokens[theme];

    // Chart Data
    const data = [20, 45, 30, 60, 55, 80, 70];
    const max = Math.max(...data);

    // Line Path Animation
    // We'll draw the line progressively
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 300;
        const y = 150 - (val / max) * 100;
        return `${x},${y}`;
    }).join(' ');

    const pathLength = 1000; // Approx
    const dashOffset = pathLength * (1 - progress);

    return (
        <div className="w-full h-full flex items-center justify-center relative p-8">
            <div className="w-full max-w-md bg-surface p-6 rounded-2xl border shadow-sm"
                style={{ backgroundColor: colors.surface, borderColor: colors.grid }}>

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="text-xs font-medium uppercase tracking-wider opacity-50 mb-1" style={{ color: colors.textSecondary }}>Model Performance</div>
                        <div className="text-2xl font-bold" style={{ color: colors.text }}>98.4%</div>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.success + '20', color: colors.success }}>
                        +2.4%
                    </div>
                </div>

                {/* Chart Area */}
                <svg width="100%" height="150" viewBox="0 0 300 150" className="overflow-visible">
                    {/* Grid Lines */}
                    <line x1="0" y1="150" x2="300" y2="150" stroke={colors.grid} strokeWidth="1" />
                    <line x1="0" y1="100" x2="300" y2="100" stroke={colors.grid} strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke={colors.grid} strokeWidth="1" strokeDasharray="4 4" />

                    {/* Area Fill (Optional, simplified) */}
                    <path
                        d={`M0,150 ${points.split(' ').map(p => 'L' + p).join(' ')} L300,150 Z`}
                        fill={colors.primary}
                        fillOpacity="0.1"
                        style={{ opacity: progress }}
                    />

                    {/* Line Chart */}
                    <path
                        d={`M${points.split(' ').join(' L')}`}
                        fill="none"
                        stroke={colors.primary}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={dashOffset}
                    />

                    {/* Data Points */}
                    {data.map((val, i) => {
                        const x = (i / (data.length - 1)) * 300;
                        const y = 150 - (val / max) * 100;
                        // Show points sequentially
                        const showPoint = progress > (i / data.length);

                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                fill={colors.surface}
                                stroke={colors.primary}
                                strokeWidth="2"
                                style={{
                                    opacity: showPoint ? 1 : 0,
                                    transform: `scale(${showPoint ? 1 : 0})`,
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};
