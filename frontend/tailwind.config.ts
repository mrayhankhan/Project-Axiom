import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    a10: "var(--primary-a10)",
                    a20: "var(--primary-a20)",
                    a30: "var(--primary-a30)",
                    a40: "var(--primary-a40)",
                    a50: "var(--primary-a50)",
                    a60: "var(--primary-a60)",
                },
                surface: {
                    a10: "var(--surface-a10)",
                    a20: "var(--surface-a20)",
                    a30: "var(--surface-a30)",
                    a40: "var(--surface-a40)",
                    a50: "var(--surface-a50)",
                    a60: "var(--surface-a60)",
                },
                tonal: {
                    a10: "var(--tonal-a10)",
                    a20: "var(--tonal-a20)",
                    a30: "var(--tonal-a30)",
                    a40: "var(--tonal-a40)",
                    a50: "var(--tonal-a50)",
                    a60: "var(--tonal-a60)",
                },
                success: {
                    a10: "var(--success-a10)",
                    a20: "var(--success-a20)",
                    a30: "var(--success-a30)",
                },
                warning: {
                    a10: "var(--warning-a10)",
                    a20: "var(--warning-a20)",
                    a30: "var(--warning-a30)",
                },
                danger: {
                    a10: "var(--danger-a10)",
                    a20: "var(--danger-a20)",
                    a30: "var(--danger-a30)",
                },
                info: {
                    a10: "var(--info-a10)",
                    a20: "var(--info-a20)",
                    a30: "var(--info-a30)",
                },
                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                    muted: "var(--text-muted)",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
            borderRadius: {
                xs: "4px",
                sm: "8px",
                md: "12px",
                lg: "20px",
            },
            spacing: {
                1: "4px",
                2: "8px",
                3: "12px",
                4: "16px",
                5: "20px",
                6: "24px",
                8: "32px",
                10: "40px",
                12: "48px",
                16: "64px",
            },
        },
    },
    plugins: [],
};
export default config;
