import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
    pages: {
        signIn: '/auth',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') ||
                nextUrl.pathname.startsWith('/documents') ||
                nextUrl.pathname.startsWith('/intelligence') ||
                nextUrl.pathname.startsWith('/analytics') ||
                nextUrl.pathname.startsWith('/risk') ||
                nextUrl.pathname.startsWith('/evaluation') ||
                nextUrl.pathname.startsWith('/settings') ||
                nextUrl.pathname.startsWith('/users') ||
                nextUrl.pathname.startsWith('/infrastructure');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && nextUrl.pathname === '/auth') {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            // Force update name and image from token if available (fixes stale DB data)
            if (token.name && session.user) {
                session.user.name = token.name;
            }
            if (token.picture && session.user) {
                session.user.image = token.picture;
            }
            return session;
        },
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.sub = user.id;
            }
            // Capture profile data from Google
            if (account?.provider === 'google' && profile) {
                token.name = profile.name;
                token.picture = profile.picture;
            }
            return token;
        }
    },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                // Mock credentials for testing
                if (credentials?.email === 'demo@example.com' && credentials?.password === 'password') {
                    return {
                        id: 'demo-user-id',
                        name: 'Demo User',
                        email: 'demo@example.com',
                        image: 'https://github.com/shadcn.png',
                    };
                }
                return null;
            },
        }),
    ],
} satisfies NextAuthConfig;
