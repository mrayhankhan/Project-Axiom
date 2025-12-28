import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '../ui/button';

export const AuthCard = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        await signIn('google', { callbackUrl: '/dashboard' });
    };

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
            callbackUrl: '/dashboard'
        });

        if (result?.error) {
            setIsLoading(false);
            // You might want to show an error toast here
            console.error("Login failed");
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md bg-surface-a10 dark:bg-surface-a20 rounded-2xl shadow-xl border border-surface-a30 p-8"
        >
            <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 bg-primary-a30/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6 text-primary-a30" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome to Axiom</h2>
                <p className="text-text-secondary">Sign in to govern and explain your AI</p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-surface-a30 text-gray-700 dark:text-white px-4 py-3 rounded-lg border border-gray-200 dark:border-surface-a40 hover:bg-gray-50 dark:hover:bg-surface-a40 transition-colors font-medium relative overflow-hidden"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary-a30" />
                    ) : (
                        <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Continue with Google</span>
                        </>
                    )}
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-surface-a30" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-surface-a10 dark:bg-surface-a20 px-2 text-text-muted">
                            Or continue with
                        </span>
                    </div>
                </div>

                <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Email or Username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-surface-a10 dark:bg-surface-a30 border border-surface-a30 focus:border-primary-a30 focus:ring-2 focus:ring-primary-a30/20 outline-none transition-all text-text-primary placeholder:text-text-muted"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-surface-a10 dark:bg-surface-a30 border border-surface-a30 focus:border-primary-a30 focus:ring-2 focus:ring-primary-a30/20 outline-none transition-all text-text-primary placeholder:text-text-muted"
                            required
                        />
                    </div>
                    <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                    </Button>
                </form>
            </div>

            <p className="mt-8 text-center text-xs text-text-muted">
                By continuing, you agree to our{' '}
                <a href="#" className="underline hover:text-text-primary">
                    Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="underline hover:text-text-primary">
                    Privacy Policy
                </a>
                .
            </p>
        </motion.div>
    );
};
