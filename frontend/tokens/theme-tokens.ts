export const themeTokens = {
    light: {
        primary: '#8cbe4a', // primary-a30
        primaryLight: '#b7fc5e', // primary-a10
        primaryDark: '#4f682e', // primary-a60
        surface: '#ffffff', // surface-a10
        surfaceHighlight: '#f0f0f0', // surface-a20
        text: '#111827', // text-primary
        textSecondary: '#4b5563', // text-secondary
        success: '#28be8a', // success-a20
        warning: '#dfae44', // warning-a20
        danger: '#d06262', // danger-a20
        info: '#347ada', // info-a20
        grid: '#e1e1e1', // surface-a30
    },
    dark: {
        primary: '#de6885', // primary-a30
        primaryLight: '#ce3266', // primary-a10
        primaryDark: '#eb95a6', // primary-a50
        surface: '#121212', // surface-a10
        surfaceHighlight: '#282828', // surface-a20
        text: '#e6e6e6', // text-primary
        textSecondary: '#a3a3a3', // text-secondary
        success: '#47d5a6', // success-a20
        warning: '#d7ac61', // warning-a20
        danger: '#d94a4a', // danger-a20
        info: '#4077d1', // info-a20
        grid: '#3f3f3f', // surface-a30
    }
};

export type ThemeType = 'light' | 'dark';
