"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderTree, UtensilsCrossed, Eye, Settings, Plus, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { AdminTemplate } from "@/lib/admin-templates";

interface DashboardClientProps {
    categoriesCount: number;
    itemsCount: number;
    template: AdminTemplate;
}

export function DashboardClient({ categoriesCount, itemsCount, template }: DashboardClientProps) {
    const colors = template.colors;
    const isDark = template.id === "midnight";

    const stats = [
        {
            label: "Categorias",
            value: categoriesCount,
            icon: FolderTree,
            href: "/admin/categories"
        },
        {
            label: "Itens",
            value: itemsCount,
            icon: UtensilsCrossed,
            href: "/admin/items"
        },
    ];

    const quickActions = [
        { label: "Nova Categoria", href: "/admin/categories", icon: FolderTree, color: colors.actionPrimary },
        { label: "Novo Item", href: "/admin/items", icon: UtensilsCrossed, color: colors.actionSecondary },
        { label: "Ver Cardápio", href: "/admin/preview", icon: Eye, color: colors.actionTertiary },
        { label: "Configurações", href: "/admin/settings", icon: Settings, color: "bg-slate-500 hover:bg-slate-600" },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className={`relative overflow-hidden rounded-2xl ${colors.bannerGradient} p-8 ${colors.bannerText} shadow-xl`}>
                <div className="absolute -right-10 -top-10 opacity-20">
                    <Sparkles className="size-48" />
                </div>
                <div className="relative">
                    <h1 className="text-3xl font-bold mb-2">Bem-vindo ao seu Cardápio! 👋</h1>
                    <p className="text-white/80 text-lg">
                        {categoriesCount === 0 && itemsCount === 0
                            ? "Vamos começar? Crie sua primeira categoria para organizar seus produtos."
                            : `Você tem ${categoriesCount} categoria${categoriesCount !== 1 ? 's' : ''} e ${itemsCount} item${itemsCount !== 1 ? 's' : ''} no cardápio.`
                        }
                    </p>
                    {categoriesCount === 0 && (
                        <Button asChild className="mt-4 bg-white text-slate-900 hover:bg-white/90 shadow-lg">
                            <Link href="/admin/categories">
                                <Plus className="size-4" />
                                Criar Primeira Categoria
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href}>
                        <Card className={`group overflow-hidden border ${colors.cardBorder} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${isDark ? colors.cardBg : ''}`}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium ${colors.cardTextMuted}`}>{stat.label}</p>
                                        <p className={`text-4xl font-bold ${colors.cardText} mt-1`}>{stat.value}</p>
                                    </div>
                                    <div className={`p-4 rounded-2xl bg-linear-to-br ${colors.accentGradient} group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="size-8 text-white" />
                                    </div>
                                </div>
                                <div className={`mt-4 flex items-center text-sm ${colors.cardTextMuted} group-hover:opacity-80`}>
                                    <span>Ver detalhes</span>
                                    <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className={`text-xl font-bold ${colors.cardText} mb-4`}>Ações Rápidas</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action) => (
                        <Button
                            key={action.label}
                            asChild
                            className={`h-auto py-6 ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                        >
                            <Link href={action.href} className="flex flex-col items-center gap-2">
                                <action.icon className="size-8" />
                                <span className="font-medium">{action.label}</span>
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Tips Card */}
            <Card className={`border ${colors.cardBorder} shadow-lg ${isDark ? colors.cardBg : 'bg-linear-to-r from-slate-50 to-slate-100'}`}>
                <CardContent className="p-6">
                    <h3 className={`font-bold ${colors.cardText} mb-2`}>💡 Dica do dia</h3>
                    <p className={colors.cardTextMuted}>
                        Use fotos de alta qualidade nos seus itens! Cardápios com imagens vendem até 30% mais do que cardápios apenas com texto.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
