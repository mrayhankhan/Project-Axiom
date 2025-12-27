import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AnimatedButtonProps {
    className?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ className }) => {
    const router = useRouter();

    const handleClick = () => {
        // Trigger page transition logic here if needed
        router.push('/auth');
    };

    return (
        <motion.button
            onClick={handleClick}
            className={`relative group px-8 py-4 bg-primary-a30 text-white rounded-full font-semibold text-lg overflow-hidden ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            {/* Gradient Shimmer Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-a30 via-primary-a20 to-primary-a30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] animate-shimmer" />

            {/* Pulse Glow Effect */}
            <div className="absolute inset-0 rounded-full ring-2 ring-primary-a30/50 animate-pulse-slow" />

            {/* Content */}
            <div className="relative flex items-center gap-2 z-10">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
        </motion.button>
    );
};
