"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, ImageIcon, Link, Upload, Pencil, X, Check, FolderOpen } from "lucide-react";
import { compressImage } from "@/lib/compress-image";
import Image from "next/image";
import { useAdminTemplate } from "@/components/admin/template-context";

interface Category {
    id: string;
    name: string;
}

interface MenuItem {
    id: string;
    name: string;
    description?: string | null;
    price: string;
    image_path?: string | null;
    category_id?: string | null;
    categories?: { name: string } | null;
}

interface ItemsClientProps {
    initialItems: MenuItem[];
    initialCategories: Category[];
    createItem: (formData: FormData) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    updateItem: (formData: FormData) => Promise<void>;
    uploadImage: (formData: FormData) => Promise<string>;
}

export function ItemsClient({ initialItems, initialCategories, createItem, deleteItem, updateItem, uploadImage }: ItemsClientProps) {
    const template = useAdminTemplate();
    const colors = template.colors;
    const isDark = template.id === "midnight";

    const [items, setItems] = useState(initialItems);
    const [categories] = useState(initialCategories);
    const [imageMode, setImageMode] = useState<"url" | "upload">("url");
    const [imageUrl, setImageUrl] = useState("");
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [editForm, setEditForm] = useState({ name: "", price: "", imagePath: "", categoryId: "" });
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        try {
            // Compress image before upload to avoid payload limits
            const compressedFile = await compressImage(file);

            if (compressedFile.size > 4 * 1024 * 1024) {
                alert("A imagem ainda é muito grande após compressão. Tente uma imagem menor.");
                return;
            }

            const formData = new FormData();
            formData.append("file", compressedFile);
            const url = await uploadImage(formData);
            setImageUrl(url);
        } catch (error) {
            console.error("Upload failed:", error);
            const msg = error instanceof Error ? error.message : "Verifique se o bucket 'menu-images' está criado e público no Supabase.";
            alert(`Erro no upload: ${msg}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleEditFileUpload = async (file: File) => {
        setIsUploading(true);
        try {
            // Compress image before upload to avoid payload limits
            const compressedFile = await compressImage(file);

            if (compressedFile.size > 4 * 1024 * 1024) {
                alert("A imagem ainda é muito grande após compressão. Tente uma imagem menor.");
                return;
            }

            const formData = new FormData();
            formData.append("file", compressedFile);
            const url = await uploadImage(formData);
            setEditForm(f => ({ ...f, imagePath: url }));
        } catch (error) {
            console.error("Upload failed:", error);
            const msg = error instanceof Error ? error.message : "Verifique se o bucket 'menu-images' está criado e público no Supabase.";
            alert(`Erro no upload: ${msg}`);
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const handleSubmit = async (formData: FormData) => {
        formData.set("imagePath", imageUrl);
        await createItem(formData);
        setImageUrl("");
    };

    const startEditing = (item: MenuItem) => {
        setEditingItem(item);
        setEditForm({
            name: item.name,
            price: item.price,
            imagePath: item.image_path || "",
            categoryId: item.category_id || "",
        });
    };

    const cancelEditing = () => {
        setEditingItem(null);
        setEditForm({ name: "", price: "", imagePath: "", categoryId: "" });
    };

    const saveEdit = async () => {
        if (!editingItem) return;

        const formData = new FormData();
        formData.set("id", editingItem.id);
        formData.set("name", editForm.name);
        formData.set("price", editForm.price);
        formData.set("imagePath", editForm.imagePath);
        formData.set("categoryId", editForm.categoryId);

        await updateItem(formData);
        setEditingItem(null);
    };

    // Group items by category
    const itemsByCategory = categories.map((cat) => ({
        ...cat,
        items: items.filter((item) => item.category_id === cat.id),
    }));

    // Items without category
    const uncategorizedItems = items.filter((item) => !item.category_id);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className={`text-3xl font-bold ${colors.cardText}`}>Itens do Cardápio</h1>
                <p className={colors.cardTextMuted}>Adicione produtos ao seu cardápio.</p>
            </div>

            {/* Create Form */}
            <Card className={`${isDark ? colors.cardBg : ''} border ${colors.cardBorder}`}>
                <CardHeader>
                    <CardTitle className={colors.cardText}>Novo Item</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name" className={colors.cardText}>Nome *</Label>
                            <Input id="name" name="name" placeholder="Ex: Café Expresso" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price" className={colors.cardText}>Preço (R$) *</Label>
                            <Input id="price" name="price" type="number" step="0.01" placeholder="5.50" required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description" className={colors.cardText}>Descrição</Label>
                            <Input id="description" name="description" placeholder="Café forte e encorpado..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="categoryId" className={colors.cardText}>Categoria</Label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                className={`flex h-11 w-full rounded-xl border px-3 py-2 text-sm ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                            >
                                <option value="">Selecione...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Image Section */}
                        <div className="space-y-4">
                            <Label className={colors.cardText}>Imagem</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => setImageMode("url")}
                                    className={imageMode === "url"
                                        ? `bg-linear-to-r ${colors.accentGradient} text-white`
                                        : `${isDark ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`
                                    }
                                >
                                    <Link className="size-4 mr-1" />
                                    URL
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => setImageMode("upload")}
                                    className={imageMode === "upload"
                                        ? `bg-linear-to-r ${colors.accentGradient} text-white`
                                        : `${isDark ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`
                                    }
                                >
                                    <Upload className="size-4 mr-1" />
                                    Upload
                                </Button>
                            </div>
                            {imageMode === "upload" && (
                                <div className="space-y-2">
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileUpload(file);
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isUploading}
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                        className="w-full"
                                    >
                                        {isUploading ? "Enviando..." : "Selecionar Arquivo"}
                                    </Button>
                                    <p className={`text-xs ${colors.cardTextMuted}`}>Envie uma imagem do seu computador (Máx: 4MB)</p>
                                </div>
                            )}
                            {imageMode === "url" && (
                                <div className="space-y-2">
                                    <Input
                                        placeholder="https://exemplo.com/imagem.jpg"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                    />
                                    <p className={`text-xs ${colors.cardTextMuted}`}>Cole a URL de uma imagem da web</p>
                                </div>
                            )}
                            {imageUrl && (
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden border">
                                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl("")}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <Button type="submit" className={`bg-linear-to-r ${colors.accentGradient} text-white`}>
                                <Plus className="size-4" />
                                Adicionar Item
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Items List - Grouped by Category */}
            <div className="space-y-8">
                <h2 className={`text-xl font-bold ${colors.cardText}`}>Seus Itens ({items.length})</h2>

                {items.length === 0 ? (
                    <Card className={`${isDark ? colors.cardBg : ''} border ${colors.cardBorder}`}>
                        <CardContent className={`py-8 text-center ${colors.cardTextMuted}`}>
                            Nenhum item criado. Adicione o primeiro acima!
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-8">
                        {/* Categories with items */}
                        {itemsByCategory.filter(cat => cat.items.length > 0).map((category) => (
                            <div key={category.id} className="space-y-4">
                                {/* Category Header */}
                                <div className={`flex items-center gap-2 pb-2 border-b-2 ${isDark ? 'border-zinc-700' : 'border-slate-200'}`}>
                                    <FolderOpen className={`size-5 ${colors.cardText}`} />
                                    <h3 className={`text-lg font-bold ${colors.cardText}`}>
                                        {category.name}
                                    </h3>
                                    <span className={`text-sm px-2 py-0.5 rounded-full ${isDark ? 'bg-zinc-700 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>
                                        {category.items.length}
                                    </span>
                                </div>

                                {/* Items Grid */}
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {category.items.map((item) => (
                                        <ItemCard
                                            key={item.id}
                                            item={item}
                                            isDark={isDark}
                                            colors={colors}
                                            editingItem={editingItem}
                                            editForm={editForm}
                                            setEditForm={setEditForm}
                                            categories={categories}
                                            startEditing={startEditing}
                                            cancelEditing={cancelEditing}
                                            saveEdit={saveEdit}
                                            deleteItem={deleteItem}
                                            handleEditFileUpload={handleEditFileUpload}
                                            isUploading={isUploading}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Uncategorized items */}
                        {uncategorizedItems.length > 0 && (
                            <div className="space-y-4">
                                <div className={`flex items-center gap-2 pb-2 border-b-2 ${isDark ? 'border-zinc-700' : 'border-slate-200'}`}>
                                    <FolderOpen className={`size-5 ${colors.cardTextMuted}`} />
                                    <h3 className={`text-lg font-bold ${colors.cardTextMuted}`}>
                                        Sem Categoria
                                    </h3>
                                    <span className={`text-sm px-2 py-0.5 rounded-full ${isDark ? 'bg-zinc-700 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>
                                        {uncategorizedItems.length}
                                    </span>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {uncategorizedItems.map((item) => (
                                        <ItemCard
                                            key={item.id}
                                            item={item}
                                            isDark={isDark}
                                            colors={colors}
                                            editingItem={editingItem}
                                            editForm={editForm}
                                            setEditForm={setEditForm}
                                            categories={categories}
                                            startEditing={startEditing}
                                            cancelEditing={cancelEditing}
                                            saveEdit={saveEdit}
                                            deleteItem={deleteItem}
                                            handleEditFileUpload={handleEditFileUpload}
                                            isUploading={isUploading}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Item Card Component with inline editing
interface ItemCardProps {
    item: MenuItem;
    isDark: boolean;
    colors: ReturnType<typeof useAdminTemplate>["colors"];
    editingItem: MenuItem | null;
    editForm: { name: string; price: string; imagePath: string; categoryId: string };
    setEditForm: React.Dispatch<React.SetStateAction<{ name: string; price: string; imagePath: string; categoryId: string }>>;
    categories: Category[];
    startEditing: (item: MenuItem) => void;
    cancelEditing: () => void;
    saveEdit: () => void;
    deleteItem: (id: string) => Promise<void>;
    handleEditFileUpload: (file: File) => Promise<void>;
    isUploading: boolean;
}

function ItemCard({
    item,
    isDark,
    colors,
    editingItem,
    editForm,
    setEditForm,
    categories,
    startEditing,
    cancelEditing,
    saveEdit,
    deleteItem,
    handleEditFileUpload,
    isUploading
}: ItemCardProps) {
    const isEditing = editingItem?.id === item.id;
    const [editImageMode, setEditImageMode] = useState<"url" | "upload">("url");

    if (isEditing) {
        return (
            <Card className={`overflow-hidden ${isDark ? colors.cardBg : ''} border-2 border-blue-500`}>
                <CardContent className="p-4 space-y-3">
                    {/* Edit Image */}
                    <div className="space-y-2">
                        <Label className={colors.cardText}>Imagem</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => setEditImageMode("url")}
                                className={editImageMode === "url"
                                    ? `bg-blue-500 text-white`
                                    : `${isDark ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`
                                }
                            >
                                <Link className="size-4 mr-1" />
                                URL
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => setEditImageMode("upload")}
                                className={editImageMode === "upload"
                                    ? `bg-blue-500 text-white`
                                    : `${isDark ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`
                                }
                            >
                                <Upload className="size-4 mr-1" />
                                Upload
                            </Button>
                        </div>
                        {editImageMode === "url" && (
                            <Input
                                value={editForm.imagePath}
                                onChange={(e) => setEditForm(f => ({ ...f, imagePath: e.target.value }))}
                                placeholder="https://exemplo.com/imagem.jpg"
                            />
                        )}
                        {editImageMode === "upload" && (
                            <div className="space-y-2">
                                <input
                                    id={`edit-image-upload-${item.id}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleEditFileUpload(file);
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isUploading}
                                    onClick={() => document.getElementById(`edit-image-upload-${item.id}`)?.click()}
                                    className="w-full"
                                >
                                    {isUploading ? "Enviando..." : "Selecionar Arquivo"}
                                </Button>
                            </div>
                        )}
                        {editForm.imagePath && (
                            <div className="relative w-full h-32 rounded-xl overflow-hidden">
                                <Image src={editForm.imagePath} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Edit Name */}
                    <div className="space-y-2">
                        <Label className={colors.cardText}>Nome</Label>
                        <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                        />
                    </div>

                    {/* Edit Price */}
                    <div className="space-y-2">
                        <Label className={colors.cardText}>Preço (R$)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={editForm.price}
                            onChange={(e) => setEditForm(f => ({ ...f, price: e.target.value }))}
                        />
                    </div>

                    {/* Edit Category */}
                    <div className="space-y-2">
                        <Label className={colors.cardText}>Categoria</Label>
                        <select
                            value={editForm.categoryId}
                            onChange={(e) => setEditForm(f => ({ ...f, categoryId: e.target.value }))}
                            className={`flex h-11 w-full rounded-xl border px-3 py-2 text-sm ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                        >
                            <option value="">Sem categoria</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button onClick={saveEdit} size="sm" className={`bg-linear-to-r ${colors.accentGradient} text-white flex-1`}>
                            <Check className="size-4" />
                            Salvar
                        </Button>
                        <Button onClick={cancelEditing} size="sm" variant="outline" className="flex-1">
                            <X className="size-4" />
                            Cancelar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`overflow-hidden ${isDark ? colors.cardBg : ''} border ${colors.cardBorder} group hover:shadow-lg transition-shadow`}>
            <CardContent className="p-0">
                <div
                    className={`relative h-40 flex items-center justify-center ${isDark ? 'bg-zinc-700' : 'bg-slate-100'} cursor-pointer`}
                    onClick={() => startEditing(item)}
                >
                    {item.image_path && item.image_path.startsWith("http") ? (
                        <Image src={item.image_path} alt={item.name} fill className="object-cover" />
                    ) : (
                        <ImageIcon className={`size-12 ${colors.cardTextMuted}`} />
                    )}
                    {/* Edit overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Pencil className="size-8 text-white" />
                    </div>
                </div>
                <div className="p-4 flex items-start justify-between gap-2">
                    <div className="flex-1 cursor-pointer" onClick={() => startEditing(item)}>
                        <p className={`font-bold ${colors.cardText}`}>{item.name}</p>
                        <p className={`mt-2 text-lg font-bold bg-linear-to-r ${colors.accentGradient} bg-clip-text text-transparent`}>
                            R$ {parseFloat(item.price).toFixed(2)}
                        </p>
                    </div>
                    <form action={deleteItem.bind(null, item.id)}>
                        <Button variant="destructive" size="icon" type="submit">
                            <Trash2 className="size-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
