"use client";

import { Sidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { AdminTemplate } from "@/lib/admin-templates";
import { AdminTemplateProvider } from "@/components/admin/template-context";
import { useState } from "react";

interface AdminLayoutClientProps {
    children: React.ReactNode;
    template: AdminTemplate;
    orgName?: string;
    logoUrl?: string | null;
}



// ... imports

export function AdminLayoutClient({ children, template, orgName, logoUrl }: AdminLayoutClientProps) {
    const colors = template.colors;
    const isDark = template.id === "midnight";
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <AdminTemplateProvider template={template}>
            <div className={`min-h-screen ${colors.mainBg}`}>
                {/* Background Pattern */}
                <div className="fixed inset-0 -z-10 opacity-40">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, ${colors.mainPattern} 1px, transparent 0)`,
                            backgroundSize: '24px 24px'
                        }}
                    />
                </div>

                <Sidebar
                    template={template}
                    orgName={orgName}
                    logoUrl={logoUrl}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <main className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">
                    <AdminHeader
                        theme={{
                            headerBg: colors.headerBg,
                            headerText: colors.headerText,
                            searchBg: colors.searchBg,
                            searchBorder: colors.searchBorder,
                            searchFocus: colors.searchFocus,
                        }}
                        onMenuClick={() => setIsSidebarOpen(true)}
                    />
                    <div className={`flex-1 p-8 ${isDark ? 'text-white' : ''}`}>
                        {children}
                    </div>
                </main>
            </div>
        </AdminTemplateProvider>
    );
}
