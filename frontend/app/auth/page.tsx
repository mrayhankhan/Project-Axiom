"use client";

import React from 'react';
import { AuthCard } from '@/components/auth/AuthCard';

export default function AuthPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-a10 dark:bg-surface-a20 p-4 relative overflow-hidden">
            {/* Background Gradient/Noise */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-a10/5 via-transparent to-surface-a10/50 pointer-events-none" />

            <div className="z-10 w-full max-w-md">
                <AuthCard />
            </div>
        </div>
    );
}
