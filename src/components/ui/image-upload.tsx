"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onUpload: (file: File) => Promise<string>;
}

const MAX_FILE_SIZE = 500 * 1024; // 500KB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_DIMENSION = 800;

export function ImageUpload({ value, onChange, onUpload }: ImageUploadProps) {
    const [mode, setMode] = useState<"url" | "upload">("url");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [urlInput, setUrlInput] = useState(value || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Compress image before upload
    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement("img");
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let { width, height } = img;

                    // Resize if too large
                    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                        if (width > height) {
                            height = (height / width) * MAX_DIMENSION;
                            width = MAX_DIMENSION;
                        } else {
                            width = (width / height) * MAX_DIMENSION;
                            height = MAX_DIMENSION;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const compressedFile = new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
                                    type: "image/webp",
                                });
                                resolve(compressedFile);
                            } else {
                                reject(new Error("Compression failed"));
                            }
                        },
                        "image/webp",
                        0.8 // 80% quality
                    );
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        // Validate type
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError("Formato inválido. Use JPG, PNG ou WebP.");
            return;
        }

        // Validate size (before compression)
        if (file.size > MAX_FILE_SIZE * 4) {
            setError("Arquivo muito grande. Máximo 2MB.");
            return;
        }

        setIsUploading(true);

        try {
            // Compress
            const compressed = await compressImage(file);

            // Check size after compression
            if (compressed.size > MAX_FILE_SIZE) {
                setError("Imagem ainda muito grande após compressão. Use uma imagem menor.");
                setIsUploading(false);
                return;
            }

            // Upload
            const url = await onUpload(compressed);
            onChange(url);
        } catch {
            setError("Erro ao fazer upload. Tente novamente.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            onChange(urlInput.trim());
        }
    };

    const handleClear = () => {
        onChange("");
        setUrlInput("");
        setError(null);
    };

    return (
        <div className="space-y-4">
            {/* Mode Selector */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant={mode === "url" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode("url")}
                >
                    <Link className="size-4 mr-1" />
                    URL
                </Button>
                <Button
                    type="button"
                    variant={mode === "upload" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode("upload")}
                >
                    <Upload className="size-4 mr-1" />
                    Upload
                </Button>
            </div>

            {/* Current Image Preview */}
            {value && (
                <div className="relative w-32 h-32 border-2 border-black bg-muted">
                    <Image src={value} alt="Preview" fill className="object-cover" />
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            )}

            {/* URL Input */}
            {mode === "url" && !value && (
                <div className="flex gap-2">
                    <Input
                        placeholder="https://exemplo.com/imagem.jpg"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                    />
                    <Button type="button" onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                        Usar
                    </Button>
                </div>
            )}

            {/* Upload Input */}
            {mode === "upload" && !value && (
                <div className="space-y-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full h-24 border-dashed"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="size-4 mr-2 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Upload className="size-4 mr-2" />
                                Clique para selecionar imagem
                            </>
                        )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        JPG, PNG ou WebP. Máx 500KB. Será redimensionada para 800x800.
                    </p>
                </div>
            )}

            {/* Error */}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
