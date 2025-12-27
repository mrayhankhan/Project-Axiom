import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedButton } from './AnimatedButton';
import { cn } from '@/lib/utils';

export const FloatingCTA = () => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: ".hero-cta", // Trigger based on the Hero's CTA
                start: "bottom top+=100", // When the Hero CTA scrolls out of view (plus a bit)
                onEnter: () => setVisible(true),
                onLeaveBack: () => setVisible(false),
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={buttonRef}
            className={cn(
                "fixed bottom-8 right-8 z-50 transition-all duration-500 transform",
                visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
            )}
        >
            <AnimatedButton className="shadow-2xl shadow-primary-a30/20" />
        </div>
    );
};
