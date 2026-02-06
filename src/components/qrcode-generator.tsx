"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, QrCode, Copy, Check } from "lucide-react";

interface QRCodeGeneratorProps {
    menuUrl: string;
    restaurantName: string;
    accentGradient: string;
}

export function QRCodeGenerator({ menuUrl, restaurantName, accentGradient }: QRCodeGeneratorProps) {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const generateQR = async () => {
            try {
                const dataUrl = await QRCode.toDataURL(menuUrl, {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: "#000000",
                        light: "#ffffff",
                    },
                });
                setQrCodeDataUrl(dataUrl);
            } catch (error) {
                console.error("Error generating QR code:", error);
            }
        };

        if (menuUrl) {
            generateQR();
        }
    }, [menuUrl]);

    const handleDownload = () => {
        if (!qrCodeDataUrl) return;

        const link = document.createElement("a");
        link.download = `qrcode-${restaurantName.toLowerCase().replace(/\s+/g, "-")}.png`;
        link.href = qrCodeDataUrl;
        link.click();
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(menuUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Error copying URL:", error);
        }
    };

    return (
        <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <QrCode className="size-6" />
                    QR Code do Cardápio
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* QR Code Display */}
                <div className="flex justify-center">
                    {qrCodeDataUrl ? (
                        <div className="p-4 bg-white rounded-xl border-2 border-slate-200 shadow-md">
                            <img
                                src={qrCodeDataUrl}
                                alt={`QR Code para ${restaurantName}`}
                                className="w-48 h-48"
                            />
                        </div>
                    ) : (
                        <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center">
                            <span className="text-slate-400">Gerando...</span>
                        </div>
                    )}
                </div>

                {/* URL Display */}
                <div className="text-center">
                    <p className="text-sm text-slate-500 mb-1">URL do Cardápio:</p>
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded break-all">
                        {menuUrl}
                    </code>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-center">
                    <Button
                        onClick={handleDownload}
                        disabled={!qrCodeDataUrl}
                        className={`bg-linear-to-r ${accentGradient} text-white`}
                    >
                        <Download className="size-4" />
                        Baixar QR Code
                    </Button>
                    <Button
                        onClick={handleCopyUrl}
                        variant="outline"
                        className="border-2"
                    >
                        {copied ? (
                            <>
                                <Check className="size-4" />
                                Copiado!
                            </>
                        ) : (
                            <>
                                <Copy className="size-4" />
                                Copiar URL
                            </>
                        )}
                    </Button>
                </div>

                {/* Instructions */}
                <div className="text-center text-sm text-slate-500 mt-4 p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium mb-1">💡 Dica:</p>
                    <p>Imprima o QR Code e coloque nas mesas do seu restaurante!</p>
                </div>
            </CardContent>
        </Card>
    );
}
