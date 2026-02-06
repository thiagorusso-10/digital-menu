"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Smartphone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAdminTemplate } from "@/components/admin/template-context";
import { QRCodeGenerator } from "@/components/qrcode-generator";
import { useState, useEffect } from "react";

interface PreviewClientProps {
    slug: string | null;
    restaurantName?: string;
}

export function PreviewClient({ slug, restaurantName = "Restaurante" }: PreviewClientProps) {
    const template = useAdminTemplate();
    const colors = template.colors;
    const isDark = template.id === "midnight";
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const menuUrl = (origin && slug) ? `${origin}/menu/${slug}` : "";

    if (!slug) {
        return (
            <div className="space-y-8">
                <h1 className={`text-3xl font-bold ${colors.cardText}`}>Visualizar Cardápio</h1>
                <Card className={`${isDark ? colors.cardBg : ''} border ${colors.cardBorder}`}>
                    <CardContent className="py-8 text-center">
                        <p className={colors.cardTextMuted}>
                            Você ainda não criou nenhuma categoria. Crie uma categoria primeiro para gerar seu cardápio público!
                        </p>
                        <Button asChild className={`mt-4 bg-linear-to-r ${colors.accentGradient} text-white`}>
                            <Link href="/admin/categories">Criar Categoria</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const publicUrl = `/menu/${slug}`;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Button variant="ghost" className="w-fit p-0 hover:bg-transparent" asChild>
                    <Link href="/admin" className={`flex items-center gap-2 ${colors.cardTextMuted} hover:${colors.cardText}`}>
                        <ArrowLeft className="size-4" />
                        Voltar para Dashboard
                    </Link>
                </Button>
                <div>
                    <h1 className={`text-3xl font-bold ${colors.cardText}`}>Visualizar Cardápio</h1>
                    <p className={colors.cardTextMuted}>Compartilhe este link com seus clientes!</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Column: Link + QR Code */}
                <div className="space-y-6">
                    {/* Link Card */}
                    <Card className={`${isDark ? colors.cardBg : ''} border ${colors.cardBorder}`}>
                        <CardHeader>
                            <CardTitle className={colors.cardText}>Link do seu Cardápio</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className={`flex items-center gap-2 p-4 rounded-xl ${isDark ? 'bg-zinc-700' : 'bg-slate-100'}`}>
                                <code className={`flex-1 text-sm break-all ${colors.cardText}`}>
                                    {menuUrl || `${publicUrl}`}
                                </code>
                            </div>

                            <div className="flex gap-2">
                                <Button asChild className={`bg-linear-to-r ${colors.accentGradient} text-white`}>
                                    <Link href={publicUrl} target="_blank">
                                        <ExternalLink className="size-4" />
                                        Abrir Cardápio
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* QR Code Card */}
                    {menuUrl && (
                        <QRCodeGenerator
                            menuUrl={menuUrl}
                            restaurantName={restaurantName}
                            accentGradient={colors.accentGradient}
                        />
                    )}
                </div>

                {/* Right Column: Mobile Preview */}
                <Card className={`${isDark ? colors.cardBg : ''} border ${colors.cardBorder}`}>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle className={`${colors.cardText} flex items-center gap-2`}>
                            <Smartphone className="size-5" />
                            Prévia Mobile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`border-8 rounded-3xl mx-auto max-w-sm h-[600px] overflow-hidden shadow-xl ${isDark ? 'border-zinc-600 bg-zinc-800' : 'border-slate-300 bg-white'}`}>
                            <iframe
                                src={publicUrl}
                                className="w-full h-full"
                                title="Prévia do Cardápio"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
