import React, { useEffect, useRef } from 'react';
import { themeTokens, ThemeType } from '@/tokens/theme-tokens';
import styles from '@/styles/landing.module.css';

interface VisualProps {
    theme: ThemeType;
    inView: boolean;
    progress: number;
}

export const VisualDocIngest: React.FC<VisualProps> = ({ theme, inView, progress }) => {
    const colors = themeTokens[theme];

    // Calculate animation states based on progress (0 to 1)
    // We want documents to slide in and "funnel" down

    // 3 documents
    const docs = [0, 1, 2].map(i => {
        // Staggered entry: 0-0.3, 0.2-0.5, 0.4-0.7
        const start = i * 0.2;
        const end = start + 0.4;

        // Normalize progress for this item
        let p = (progress - start) / (end - start);
        p = Math.max(0, Math.min(1, p)); // Clamp 0-1

        // Y position: start at -50, end at 150 (funnel)
        const y = -50 + (p * 200);

        // Scale: start 1, shrink to 0.2 as it enters funnel
        const scale = 1 - (p * 0.8);

        // Opacity: fade out at the very end
        const opacity = p > 0.9 ? 1 - ((p - 0.9) * 10) : 1;

        return { y, scale, opacity };
    });

    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 400 300" className="overflow-visible">
                <defs>
                    <linearGradient id="funnelGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={colors.surfaceHighlight} stopOpacity="0" />
                        <stop offset="50%" stopColor={colors.surfaceHighlight} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={colors.primary} stopOpacity="0.1" />
                    </linearGradient>
                    <mask id="funnelMask">
                        <rect x="100" y="150" width="200" height="150" fill="white" />
                        <path d="M100,150 L150,300 L250,300 L300,150 Z" fill="black" />
                    </mask>
                </defs>

                {/* Funnel Graphic */}
                <path
                    d="M120,180 L180,280 L220,280 L280,180"
                    fill="none"
                    stroke={colors.grid}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />

                {/* Documents */}
                <g transform="translate(200, 50)">
                    {docs.map((doc, i) => (
                        <g key={i} transform={`translate(0, ${doc.y}) scale(${doc.scale})`} opacity={doc.opacity}>
                            {/* Document Sheet */}
                            <rect
                                x="-30"
                                y="-40"
                                width="60"
                                height="80"
                                rx="4"
                                fill={colors.surface}
                                stroke={colors.primary}
                                strokeWidth="2"
                                className="shadow-sm"
                            />
                            {/* Text Lines */}
                            <line x1="-20" y1="-20" x2="20" y2="-20" stroke={colors.textSecondary} strokeWidth="2" />
                            <line x1="-20" y1="-10" x2="10" y2="-10" stroke={colors.textSecondary} strokeWidth="2" />
                            <line x1="-20" y1="0" x2="20" y2="0" stroke={colors.textSecondary} strokeWidth="2" />
                            <line x1="-20" y1="10" x2="0" y2="10" stroke={colors.textSecondary} strokeWidth="2" />

                            {/* File Type Badge */}
                            <rect x="10" y="20" width="15" height="15" rx="2" fill={i === 0 ? colors.info : i === 1 ? colors.danger : colors.warning} />
                        </g>
                    ))}
                </g>

                {/* Processed Node (Output) */}
                <g transform="translate(200, 280)" opacity={progress > 0.8 ? (progress - 0.8) * 5 : 0}>
                    <circle r="20" fill={colors.primary} />
                    <path d="M-8,-4 L0,6 L8,-8" stroke="white" strokeWidth="3" fill="none" />
                </g>

            </svg>

            {/* Label */}
            <div className="absolute bottom-4 text-sm font-medium" style={{ color: colors.textSecondary }}>
                Ingesting & Parsing...
            </div>
        </div>
    );
};
