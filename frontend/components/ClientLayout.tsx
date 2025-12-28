"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar, MobileSidebar } from "@/components/ui/sidebar";
import { TopBar } from "@/components/ui/TopBar";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Determine active item based on pathname
    const getActiveItem = () => {
        if (pathname === "/" || pathname === "/dashboard") return "dashboard";
        if (pathname.startsWith("/documents")) return "documents";
        if (pathname.startsWith("/intelligence")) return "qa";
        if (pathname.startsWith("/analytics")) return "analytics";
        if (pathname.startsWith("/risk")) return "risk";
        if (pathname.startsWith("/evaluation")) return "evaluation";
        if (pathname.startsWith("/users")) return "users";
        if (pathname.startsWith("/settings")) return "settings";
        if (pathname.startsWith("/infrastructure")) return "infrastructure";
        return "dashboard";
    };

    const activeItem = getActiveItem();

    const handleNavigate = (id: string) => {
        switch (id) {
            case "dashboard":
                router.push("/dashboard");
                break;
            case "documents":
                router.push("/documents");
                break;
            case "qa":
                router.push("/intelligence");
                break;
            case "analytics":
                router.push("/analytics");
                break;
            case "risk":
                router.push("/risk");
                break;
            case "evaluation":
                router.push("/evaluation");
                break;
            case "users":
                router.push("/users");
                break;
            case "settings":
                router.push("/settings");
                break;
            case "infrastructure":
                router.push("/infrastructure");
                break;
            default:
                router.push("/dashboard");
        }
    };

    const getPageTitle = () => {
        switch (activeItem) {
            case "dashboard": return "Dashboard";
            case "documents": return "Documents";
            case "qa": return "Intelligence Q&A";
            case "analytics": return "Analytics";
            case "risk": return "Risk Management";
            case "evaluation": return "Model Evaluation";
            case "users": return "Users & Roles";
            case "settings": return "Settings";
            case "infrastructure": return "Infrastructure";
            default: return "Axiom";
        }
    };

    const isPublicPage = pathname === "/" || pathname.startsWith("/auth");

    if (isPublicPage) {
        return (
            <SessionProvider>
                <div className="min-h-screen bg-surface-a10 dark:bg-surface-a20 text-text-primary">
                    {children}
                </div>
            </SessionProvider>
        );
    }

    return (
        <SessionProvider>
            <div className="flex h-screen overflow-hidden bg-surface-a10 dark:bg-surface-a20">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block">
                    <Sidebar
                        activeItem={activeItem}
                        onNavigate={handleNavigate}
                        collapsed={sidebarCollapsed}
                        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                    />
                </div>

                {/* Mobile Sidebar */}
                <MobileSidebar
                    activeItem={activeItem}
                    onNavigate={handleNavigate}
                    isOpen={mobileSidebarOpen}
                    onClose={() => setMobileSidebarOpen(false)}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <TopBar
                        title={getPageTitle()}
                        onMenuClick={() => setMobileSidebarOpen(true)}
                        breadcrumbs={["Home", getPageTitle()]}
                    />
                    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SessionProvider>
    );
}
