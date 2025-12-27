import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { AnimatedButton } from './AnimatedButton';
import { BentoGrid } from './BentoGrid';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const rotatingTexts = [
    "Your AI. Fully accountable.",
    "Ask your documents. Get answers you can trust.",
    "Model risk, explained.",
    "Transparency for every AI decision."
];

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const [textIndex, setTextIndex] = useState(0);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const ctx = gsap.context(() => {
            // Entrance Animation
            const tl = gsap.timeline();

            tl.from("h1", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            })
                .from(".hero-text", {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.6")
                .from(".hero-cta", {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.6")
                .from(".hero-scroll", {
                    opacity: 0,
                    y: -10,
                    duration: 1,
                    delay: 0.5
                });

            // Rotating Text Animation
            const interval = setInterval(() => {
                const el = textRef.current;
                if (!el) return;

                gsap.to(el, {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    onComplete: () => {
                        setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
                        gsap.fromTo(el,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.5 }
                        );
                    }
                });
            }, 4000);

            return () => clearInterval(interval);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div ref={containerRef} className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12 bg-surface-a10 dark:bg-surface-a20 overflow-hidden relative">
            {/* Background Gradient/Noise */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-a10/5 via-transparent to-surface-a10/50 pointer-events-none" />

            {/* Theme Toggle */}
            {mounted && (
                <button
                    onClick={toggleTheme}
                    className="absolute top-6 right-6 p-3 rounded-full bg-surface-a10/80 dark:bg-surface-a20/80 border border-surface-a30 shadow-sm hover:shadow-md transition-all z-50 backdrop-blur-sm"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <Moon className="w-5 h-5 text-text-primary" />
                    ) : (
                        <Sun className="w-5 h-5 text-text-primary" />
                    )}
                </button>
            )}

            {/* Left Content */}
            <div className="flex-1 max-w-xl z-10 flex flex-col items-start text-left">
                <div>
                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-text-primary mb-6 leading-tight">
                        Govern AI. <br />
                        <span className="text-primary-a30">Explain Everything.</span>
                    </h1>
                </div>

                <div className="h-20 mb-8 hero-text">
                    <p
                        ref={textRef}
                        className="text-xl text-text-secondary font-medium"
                    >
                        {rotatingTexts[textIndex]}
                    </p>
                </div>

                <div className="hero-cta">
                    <AnimatedButton />
                </div>
            </div>

            {/* Right Content - Bento Grid */}
            <div className="flex-1 w-full max-w-2xl z-10">
                <BentoGrid />
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted">
                <span className="text-sm font-medium">Scroll to explore</span>
                <div className="animate-bounce">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
