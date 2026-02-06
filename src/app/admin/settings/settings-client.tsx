"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Upload, Save, Image as ImageIcon, FileImage } from "lucide-react";
import { templateList, TemplateId, Template } from "@/lib/templates";
import { adminTemplates, AdminTemplateId, AdminTemplate } from "@/lib/admin-templates";
import { updateOrganizationTheme, updateAdminTheme, updateOrganizationInfo, uploadImage } from "@/lib/actions/settings";
import Image from "next/image";
import { useAdminTemplate } from "@/components/admin/template-context";

interface Settings {
    id: string;
    name: string;
    slug: string;
    theme_preset: string | null;
    admin_theme: string | null;
    logo_url: string | null;
    favicon_url: string | null;
}

interface SettingsClientProps {
    settings: Settings;
}

export function SettingsClient({ settings }: SettingsClientProps) {
    const template = useAdminTemplate();
    const colors = template.colors;
    const isDark = template.id === "midnight";

    const [name, setName] = useState(settings.name);
    const [logoUrl, setLogoUrl] = useState(settings.logo_url || "");
    const [faviconUrl, setFaviconUrl] = useState(settings.favicon_url || "");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<"logo" | "favicon" | null>(null);

    const currentMenuTheme = settings.theme_preset || "neo-brutal";
    const currentAdminTheme = settings.admin_theme || "sunset";

    const handleSaveInfo = async () => {
        setSaving(true);
        try {
            await updateOrganizationInfo({
                name,
                logo_url: logoUrl || null,
                favicon_url: faviconUrl || null,
            });
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "favicon") => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(type);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const url = await uploadImage(formData);

            if (type === "logo") {
                setLogoUrl(url);
            } else {
                setFaviconUrl(url);
            }
        } catch (error) {
            console.error(error);
            alert("Erro no upload. Verifique se o bucket 'menu-images' foi criado no Supabase Storage.");
        }
        setUploading(null);
    };

    return (
        <div className="space-y-10">
            {/* Section 1: Restaurant Info */}
            <section className="space-y-4">
                <div>
                    <h2 className={`text-xl font-bold ${colors.cardText}`}>🏢 Informações do Restaurante</h2>
                    <p className={`text-sm ${colors.cardTextMuted}`}>Personalize o nome, logo e favicon do seu restaurante</p>
                </div>

                <Card className={`${isDark ? colors.cardBg : ''} border ${colors.cardBorder}`}>
                    <CardContent className="pt-6 space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className={colors.cardText}>Nome do Restaurante</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Meu Restaurante"
                            />
                        </div>

                        {/* Logo */}
                        <div className="space-y-2">
                            <Label className={colors.cardText}>Logo</Label>
                            <div className="flex items-start gap-4">
                                <div className={`w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${isDark ? 'border-zinc-600 bg-zinc-800' : 'border-slate-200 bg-slate-50'}`}>
                                    {logoUrl ? (
                                        <Image src={logoUrl} alt="Logo" width={80} height={80} className="object-cover" />
                                    ) : (
                                        <ImageIcon className={`size-8 ${isDark ? 'text-zinc-500' : 'text-slate-300'}`} />
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Input
                                        placeholder="URL da logo ou faça upload"
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="file"
                                            id="logo-upload"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleUpload(e, "logo")}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={uploading === "logo"}
                                            onClick={() => document.getElementById('logo-upload')?.click()}
                                        >
                                            <Upload className="size-4" />
                                            {uploading === "logo" ? "Enviando..." : "Upload"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Favicon */}
                        <div className="space-y-2">
                            <Label className={colors.cardText}>Favicon (ícone da aba)</Label>
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden ${isDark ? 'border-zinc-600 bg-zinc-800' : 'border-slate-200 bg-slate-50'}`}>
                                    {faviconUrl ? (
                                        <Image src={faviconUrl} alt="Favicon" width={48} height={48} className="object-cover" />
                                    ) : (
                                        <FileImage className={`size-5 ${isDark ? 'text-zinc-500' : 'text-slate-300'}`} />
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Input
                                        placeholder="URL do favicon ou faça upload"
                                        value={faviconUrl}
                                        onChange={(e) => setFaviconUrl(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="file"
                                            id="favicon-upload"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleUpload(e, "favicon")}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={uploading === "favicon"}
                                            onClick={() => document.getElementById('favicon-upload')?.click()}
                                        >
                                            <Upload className="size-4" />
                                            {uploading === "favicon" ? "Enviando..." : "Upload"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleSaveInfo} disabled={saving} className={`w-full sm:w-auto bg-linear-to-r ${colors.accentGradient} text-white`}>
                            <Save className="size-4" />
                            {saving ? "Salvando..." : "Salvar Informações"}
                        </Button>
                    </CardContent>
                </Card>
            </section>

            {/* Section 2: Menu Templates */}
            <section className="space-y-4">
                <div>
                    <h2 className={`text-xl font-bold ${colors.cardText}`}>🎨 Template do Cardápio</h2>
                    <p className={`text-sm ${colors.cardTextMuted}`}>Escolha o visual do seu cardápio público</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {templateList.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            isSelected={currentMenuTheme === template.id}
                            onSelect={() => updateOrganizationTheme(template.id as TemplateId)}
                            isDark={isDark}
                            colors={colors}
                        />
                    ))}
                </div>
            </section>

            {/* Section 3: Admin Templates */}
            <section className="space-y-4">
                <div>
                    <h2 className={`text-xl font-bold ${colors.cardText}`}>💎 Template do Admin</h2>
                    <p className={`text-sm ${colors.cardTextMuted}`}>Escolha o visual do seu painel administrativo</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {Object.values(adminTemplates).map((adminTemplate) => (
                        <AdminTemplateCard
                            key={adminTemplate.id}
                            template={adminTemplate}
                            isSelected={currentAdminTheme === adminTemplate.id}
                            onSelect={() => updateAdminTheme(adminTemplate.id as AdminTemplateId)}
                            isDark={isDark}
                            colors={colors}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

function TemplateCard({ template, isSelected, onSelect, isDark, colors }: {
    template: Template;
    isSelected: boolean;
    onSelect: () => void;
    isDark: boolean;
    colors: AdminTemplate["colors"];
}) {
    return (
        <form action={onSelect}>
            <button
                type="submit"
                className={`w-full text-left transition-all ${isSelected ? `ring-4 ring-${colors.accent}-500 ring-offset-2` : ""}`}
            >
                <Card className={`h-full hover:shadow-lg transition-shadow ${isDark ? colors.cardBg : ''} border ${colors.cardBorder}`}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{template.preview}</span>
                                <CardTitle className={`text-lg ${colors.cardText}`}>{template.name}</CardTitle>
                            </div>
                            {isSelected && (
                                <div className={`bg-linear-to-r ${colors.accentGradient} text-white rounded-full p-1`}>
                                    <Check className="size-4" />
                                </div>
                            )}
                        </div>
                        <CardDescription className={colors.cardTextMuted}>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-1 h-8">
                            <div className="flex-1 rounded-l border" style={{ backgroundColor: template.styles.primary }} />
                            <div className="flex-1 border" style={{ backgroundColor: template.styles.secondary }} />
                            <div className="flex-1 border" style={{ backgroundColor: template.styles.background }} />
                            <div className="flex-1 rounded-r border" style={{ backgroundColor: template.styles.accent }} />
                        </div>
                    </CardContent>
                </Card>
            </button>
        </form>
    );
}

function AdminTemplateCard({ template, isSelected, onSelect, isDark, colors }: {
    template: AdminTemplate;
    isSelected: boolean;
    onSelect: () => void;
    isDark: boolean;
    colors: AdminTemplate["colors"];
}) {
    const previewColors = {
        sunset: ["#f59e0b", "#ea580c", "#1e293b"],
        ocean: ["#06b6d4", "#3b82f6", "#172554"],
        midnight: ["#8b5cf6", "#a855f7", "#09090b"],
    };

    const templateColors = previewColors[template.id];

    return (
        <form action={onSelect}>
            <button
                type="submit"
                className={`w-full text-left transition-all ${isSelected ? `ring-4 ring-${colors.accent}-500 ring-offset-2` : ""}`}
            >
                <Card className={`h-full hover:shadow-lg transition-shadow ${isDark ? colors.cardBg : ''} border ${colors.cardBorder}`}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{template.icon}</span>
                                <CardTitle className={`text-lg ${colors.cardText}`}>{template.name}</CardTitle>
                            </div>
                            {isSelected && (
                                <div className={`bg-linear-to-r ${colors.accentGradient} text-white rounded-full p-1`}>
                                    <Check className="size-4" />
                                </div>
                            )}
                        </div>
                        <CardDescription className={colors.cardTextMuted}>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-1 h-8">
                            <div className="flex-1 rounded-l border" style={{ backgroundColor: templateColors[0] }} />
                            <div className="flex-1 border" style={{ backgroundColor: templateColors[1] }} />
                            <div className="flex-1 rounded-r border" style={{ backgroundColor: templateColors[2] }} />
                        </div>
                    </CardContent>
                </Card>
            </button>
        </form>
    );
}
