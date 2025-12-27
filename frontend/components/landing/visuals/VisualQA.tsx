import React from 'react';
import { themeTokens, ThemeType } from '@/tokens/theme-tokens';

interface VisualProps {
    theme: ThemeType;
    inView: boolean;
    progress: number;
}

export const VisualQA: React.FC<VisualProps> = ({ theme, inView, progress }) => {
    const colors = themeTokens[theme];

    // Progress-based animations
    const bubbleScale = Math.min(1, progress * 2); // 0-0.5 -> 0-1
    const textOpacity = progress > 0.3 ? Math.min(1, (progress - 0.3) * 3) : 0; // 0.3-0.6 -> 0-1
    const cardsOffset = Math.max(0, 100 - (progress - 0.5) * 200); // 0.5-1.0 -> 100-0
    const cardsOpacity = progress > 0.5 ? Math.min(1, (progress - 0.5) * 4) : 0;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
            {/* Chat Bubble */}
            <div
                className="w-full max-w-xs p-4 rounded-2xl rounded-tl-none shadow-lg mb-8 transition-transform duration-300 ease-out"
                style={{
                    backgroundColor: colors.surfaceHighlight,
                    transform: `scale(${bubbleScale})`,
                    opacity: bubbleScale,
                    transformOrigin: 'top left'
                }}
            >
                <div className="flex gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div style={{ opacity: textOpacity }} className="space-y-2">
                    <div className="h-2 w-3/4 rounded bg-current opacity-20" style={{ color: colors.text }} />
                    <div className="h-2 w-full rounded bg-current opacity-20" style={{ color: colors.text }} />
                    <div className="h-2 w-5/6 rounded bg-current opacity-20" style={{ color: colors.text }} />
                </div>
            </div>

            {/* Source Cards */}
            <div className="w-full max-w-xs space-y-3">
                {[0, 1].map((i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl border shadow-sm transition-all duration-500"
                        style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.grid,
                            transform: `translateX(${cardsOffset + (i * 20)}px)`,
                            opacity: cardsOpacity
                        }}
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: i === 0 ? colors.info + '20' : colors.success + '20' }}>
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: i === 0 ? colors.info : colors.success }} />
                        </div>
                        <div className="flex-1">
                            <div className="h-2 w-20 rounded mb-1.5" style={{ backgroundColor: colors.textSecondary, opacity: 0.3 }} />
                            <div className="h-1.5 w-12 rounded" style={{ backgroundColor: colors.textSecondary, opacity: 0.2 }} />
                        </div>
                        <div className="text-xs font-bold" style={{ color: i === 0 ? colors.info : colors.success }}>
                            {i === 0 ? '98%' : '95%'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
