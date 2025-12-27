import React, { useEffect, useRef } from 'react';
import { themeTokens, ThemeType } from '@/tokens/theme-tokens';

interface VisualProps {
    theme: ThemeType;
    inView: boolean;
    progress: number;
}

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

export const VisualVectorize: React.FC<VisualProps> = ({ theme, inView, progress }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const nodesRef = useRef<Node[]>([]);
    const colors = themeTokens[theme];

    // Initialize nodes
    useEffect(() => {
        const count = 30;
        const nodes: Node[] = [];
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * 400,
                y: Math.random() * 300,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
        nodesRef.current = nodes;
    }, []);

    // Animation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            if (!inView && progress === 0) return; // Optimization

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw nodes
            const nodes = nodesRef.current;

            // If progress is low, scatter nodes. If high, cluster them.
            const clusterStrength = progress * 0.05;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            nodes.forEach((node, i) => {
                // Movement
                node.x += node.vx;
                node.y += node.vy;

                // Clustering force
                if (progress > 0) {
                    node.x += (centerX - node.x) * clusterStrength;
                    node.y += (centerY - node.y) * clusterStrength;
                }

                // Bounce off walls
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                // Draw Node
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = colors.primary;
                ctx.fill();

                // Draw Connections
                for (let j = i + 1; j < nodes.length; j++) {
                    const other = nodes[j];
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 60) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = colors.primary;
                        ctx.globalAlpha = (1 - dist / 60) * 0.5 * progress; // Fade in connections with progress
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            });

            animationRef.current = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationRef.current);
    }, [theme, inView, progress, colors]);

    return (
        <div className="w-full h-full flex items-center justify-center relative">
            <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 text-sm font-medium" style={{ color: colors.textSecondary, opacity: progress }}>
                Vectorizing Content...
            </div>
        </div>
    );
};
