import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FileText, Database, MessageSquare, Search, ShieldAlert, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TileData {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    size: 'small' | 'medium' | 'large';
}

const initialTiles: TileData[] = [
    {
        id: 'bento-doc-ingest',
        icon: <FileText className="w-6 h-6" />,
        title: "Document Ingestion",
        description: "Upload policies & PDFs",
        color: "bg-primary-a30/10 text-primary-a30",
        size: 'medium'
    },
    {
        id: 'bento-vectorize',
        icon: <Database className="w-6 h-6" />,
        title: "Vectorization",
        description: "Documents → Embeddings",
        color: "bg-info-a30/10 text-info-a30",
        size: 'small'
    },
    {
        id: 'bento-rag-chat',
        icon: <MessageSquare className="w-6 h-6" />,
        title: "Q&A Interface",
        description: "Ask in natural language",
        color: "bg-success-a30/10 text-success-a30",
        size: 'large'
    },
    {
        id: 'bento-explainability',
        icon: <Search className="w-6 h-6" />,
        title: "Explainability",
        description: "See exact citations",
        color: "bg-warning-a30/10 text-warning-a30",
        size: 'medium'
    },
    {
        id: 'bento-risk-alert',
        icon: <ShieldAlert className="w-6 h-6" />,
        title: "Risk Detection",
        description: "Detect policy gaps",
        color: "bg-danger-a30/10 text-danger-a30",
        size: 'small'
    },
    {
        id: 'bento-analytics',
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Performance",
        description: "Track accuracy",
        color: "bg-tonal-a30/10 text-tonal-a30",
        size: 'medium'
    }
];

export const BentoGrid = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [tiles, setTiles] = useState(initialTiles);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial fade in
            gsap.from(".bento-tile", {
                opacity: 0,
                scale: 0.8,
                y: 20,
                stagger: 0.1,
                duration: 0.8,
                ease: "back.out(1.7)"
            });

            // Random swap animation loop
            const swapInterval = setInterval(() => {
                const tiles = document.querySelectorAll(".bento-tile");
                if (tiles.length < 2) return;

                // Pick two random indices
                const idx1 = Math.floor(Math.random() * tiles.length);
                let idx2 = Math.floor(Math.random() * tiles.length);
                while (idx1 === idx2) idx2 = Math.floor(Math.random() * tiles.length);

                const tile1 = tiles[idx1] as HTMLElement;
                const tile2 = tiles[idx2] as HTMLElement;

                // Get current positions
                const state1 = Flip.getState(tile1);
                const state2 = Flip.getState(tile2);

                // Swap in DOM (React state update would be cleaner but complex with GSAP Flip without a plugin wrapper)
                // For this demo, we'll just animate a "pulse" on random tiles to show activity
                // since full layout swapping with CSS Grid + React + GSAP is complex to get perfect without Flip plugin

                gsap.to([tile1, tile2], {
                    scale: 0.95,
                    yoyo: true,
                    repeat: 1,
                    duration: 0.2,
                    ease: "power2.inOut"
                });

            }, 3000);

            return () => clearInterval(swapInterval);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 h-full max-h-[600px] w-full max-w-2xl mx-auto">
            {tiles.map((tile, i) => (
                <div
                    key={tile.id}
                    className={cn(
                        "bento-tile rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm border border-surface-a30 shadow-sm hover:shadow-md transition-shadow cursor-default group",
                        "bg-surface-a10/80 dark:bg-surface-a20/80",
                        tile.size === 'large' ? 'col-span-2 row-span-2' :
                            tile.size === 'medium' ? 'col-span-1 row-span-1' : 'col-span-1 row-span-1'
                    )}
                >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300", tile.color)}>
                        {tile.icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-primary mb-1">{tile.title}</h3>
                        <p className="text-sm text-text-secondary">{tile.description}</p>
                    </div>

                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                        {tile.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Mock Flip for type safety if not imported (we are not using the full Flip plugin to avoid extra deps complexity for now)
const Flip = {
    getState: (el: Element) => ({})
};
