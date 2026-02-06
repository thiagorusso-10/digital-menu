"use client";

import { usePathname } from "next/navigation";
import { Search, Menu } from "lucide-react";

const pageTitles: Record<string, { title: string; description: string }> = {
    "/admin": { title: "Dashboard", description: "Visão geral do seu cardápio" },
    "/admin/categories": { title: "Categorias", description: "Gerencie as categorias do menu" },
    "/admin/items": { title: "Itens", description: "Adicione e edite produtos" },
    "/admin/preview": { title: "Visualizar", description: "Veja como seu cardápio aparece" },
    "/admin/settings": { title: "Configurações", description: "Personalize seu restaurante" },
};

interface AdminHeaderProps {
    theme?: {
        headerBg: string;
        headerText: string;
        searchBg: string;
        searchBorder: string;
        searchFocus: string;
    };
    onMenuClick: () => void;
}

export function AdminHeader({ theme, onMenuClick }: AdminHeaderProps) {
    const pathname = usePathname();
    const page = pageTitles[pathname] || { title: "Admin", description: "" };

    const styles = theme || {
        headerBg: "bg-white/80",
        headerText: "text-slate-900",
        searchBg: "bg-slate-50",
        searchBorder: "border-slate-200",
        searchFocus: "focus:ring-amber-500/50 focus:border-amber-500"
    };

    return (
        <header className={`h-20 border-b border-slate-200/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 ${styles.headerBg}`}>
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                    <Menu className={`size-6 ${styles.headerText}`} />
                </button>

                {/* Page Title */}
                <div>
                    <h1 className={`text-xl md:text-2xl font-bold ${styles.headerText}`}>{page.title}</h1>
                    <p className="text-xs md:text-sm text-slate-500 hidden md:block">{page.description}</p>
                </div>
            </div>

            {/* Search */}
            {/* Search removed as requested */}
            <div className="w-8"></div>
        </header>
    );
}
