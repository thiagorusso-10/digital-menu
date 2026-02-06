"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { useAdminTemplate } from "@/components/admin/template-context";
import { createCategory, deleteCategory } from "@/lib/actions/categories";

interface Category {
    id: string;
    name: string;
    description?: string | null;
}

interface CategoriesClientProps {
    categories: Category[];
}

export function CategoriesClient({ categories }: CategoriesClientProps) {
    const template = useAdminTemplate();
    const colors = template.colors;
    const isDark = template.id === "midnight";

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${colors.cardText}`}>Categorias</h1>
                    <p className={colors.cardTextMuted}>Organize seu cardápio em categorias.</p>
                </div>
            </div>

            {/* Create Form */}
            <Card className={`${isDark ? colors.cardBg : ''} border ${colors.cardBorder}`}>
                <CardHeader>
                    <CardTitle className={colors.cardText}>Nova Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createCategory} className="flex flex-col gap-4 md:flex-row md:items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="name" className={colors.cardText}>Nome *</Label>
                            <Input id="name" name="name" placeholder="Ex: Bebidas" required />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="description" className={colors.cardText}>Descrição (opcional)</Label>
                            <Input id="description" name="description" placeholder="Sucos, refrigerantes..." />
                        </div>
                        <Button type="submit" className={`bg-linear-to-r ${colors.accentGradient} text-white`}>
                            <Plus className="size-4" />
                            Criar
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* List */}
            <div className="space-y-4">
                <h2 className={`text-xl font-bold ${colors.cardText}`}>Suas Categorias ({categories.length})</h2>

                {categories.length === 0 ? (
                    <Card className={`${isDark ? colors.cardBg : ''} border ${colors.cardBorder}`}>
                        <CardContent className={`py-8 text-center ${colors.cardTextMuted}`}>
                            Nenhuma categoria criada ainda. Crie a primeira acima!
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((cat) => (
                            <Card key={cat.id} className={`${isDark ? colors.cardBg : ''} border ${colors.cardBorder}`}>
                                <CardContent className="flex items-center justify-between py-4">
                                    <div>
                                        <p className={`font-bold ${colors.cardText}`}>{cat.name}</p>
                                        {cat.description && (
                                            <p className={`text-sm ${colors.cardTextMuted}`}>{cat.description}</p>
                                        )}
                                    </div>
                                    <form action={deleteCategory.bind(null, cat.id)}>
                                        <Button variant="destructive" size="icon" type="submit">
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
