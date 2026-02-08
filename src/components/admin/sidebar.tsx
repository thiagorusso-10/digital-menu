"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderTree, UtensilsCrossed, Eye, Settings, ChefHat } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { AdminTemplate } from "@/lib/admin-templates";
import Image from "next/image";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/categories", label: "Categorias", icon: FolderTree },
    { href: "/admin/items", label: "Itens", icon: UtensilsCrossed },
    { href: "/admin/preview", label: "Visualizar", icon: Eye },
    { href: "/admin/settings", label: "Configurações", icon: Settings },
];

interface SidebarProps {
    template: AdminTemplate;
    orgName?: string;
    logoUrl?: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ template, orgName, logoUrl, isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const colors = template.colors;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                `fixed left-0 top-0 z-40 h-screen w-64 ${colors.sidebarBg} flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0`,
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo */}
                <div className={`h-20 flex items-center justify-center border-b ${colors.sidebarBorder} ${colors.logoBg}`}>
                    <div className="flex items-center gap-3">
                        {logoUrl ? (
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                                <Image src={logoUrl} alt="Logo" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className={`p-2 rounded-xl ${colors.logoAccent} shadow-lg ${colors.logoShadow}`}>
                                <ChefHat className="size-6 text-white" />
                            </div>
                        )}
                        <div>
                            <span className={`font-bold text-lg ${colors.sidebarText}`}>
                                {orgName || "Cardápio"}
                            </span>
                            <span className={`block text-xs ${colors.accentLight} font-medium`}>Painel Admin</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    <p className={`text-xs font-semibold ${colors.sidebarTextMuted} uppercase tracking-wider px-3 mb-3`}>
                        Menu
                    </p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()} // Fecha ao clicar no mobile
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                                    isActive
                                        ? colors.sidebarActive
                                        : `${colors.sidebarTextMuted} ${colors.sidebarHover}`
                                )}
                            >
                                <item.icon className={cn(
                                    "size-5 transition-transform duration-200",
                                    !isActive && "group-hover:scale-110"
                                )} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className={`p-4 border-t ${colors.sidebarBorder} bg-black/20`}>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: `w-10 h-10 ring-2 ring-${template.colors.accent}-500/50`
                                }
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${colors.sidebarText} truncate`}>Minha Conta</p>
                            <p className={`text-xs ${colors.sidebarTextMuted}`}>Gerenciar perfil</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
