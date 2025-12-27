import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from 'next-themes';
import { ThemeType } from '@/tokens/theme-tokens';
import { cn } from '@/lib/utils';

// Register ScrollTrigger (safety check)
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface FeatureSectionProps {
    id: string;
    title: string;
    description: string;
    visualComponent: React.ComponentType<{ theme: ThemeType; inView: boolean; progress: number }>;
    align?: 'left' | 'right';
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
    id,
    title,
    description,
    visualComponent: Visual,
    align = 'left'
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [inView, setInView] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    // Handle hydration mismatch by only rendering theme-dependent visual on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Ensure theme is valid, default to light if undefined/system during SSR
    const currentTheme = (mounted && theme === 'dark' ? 'dark' : 'light') as ThemeType;

    useEffect(() => {
        if (!containerRef.current || !mounted) return;

        const ctx = gsap.context(() => {
            // Pin the section and scrub progress
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom+=100% bottom", // Pin for 100% of viewport height extra
                pin: true,
                scrub: 0.5,
                pinSpacing: true, // Ensure spacing is added
                onUpdate: (self) => {
                    setProgress(self.progress);
                },
                onToggle: (self) => {
                    setInView(self.isActive);
                }
            });

            // Animate text content
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top center",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={containerRef} id={id} className="min-h-screen w-full flex items-center justify-center py-12 relative overflow-hidden bg-surface-a10 dark:bg-surface-a20">
            <div className="max-w-7xl w-full mx-auto px-6 lg:px-12">
                <div className={cn(
                    "flex flex-col lg:flex-row items-center gap-12 lg:gap-24 h-full",
                    align === 'right' ? "lg:flex-row-reverse" : ""
                )}>

                    {/* Text Content */}
                    <div ref={contentRef} className="flex-1 text-left z-10">
                        <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight">
                            {title}
                        </h2>
                        <p className="text-xl text-text-secondary leading-relaxed max-w-lg">
                            {description}
                        </p>
                    </div>

                    {/* Visual Container */}
                    <div className="flex-1 w-full aspect-video lg:aspect-square max-h-[600px] relative">
                        <div className="absolute inset-0 bg-surface-a10 dark:bg-surface-a20 rounded-3xl border border-surface-a30 shadow-2xl overflow-hidden">
                            {mounted ? (
                                <Visual theme={currentTheme} inView={inView} progress={progress} />
                            ) : (
                                <div className="w-full h-full bg-surface-a10 dark:bg-surface-a20 animate-pulse" />
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
