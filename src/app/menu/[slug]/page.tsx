import { getPublicMenu } from "@/lib/actions/public";
import { getTemplate, TemplateId } from "@/lib/templates";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ImageIcon, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

// Force dynamic rendering to always get fresh data
export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO and Open Graph
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const data = await getPublicMenu(slug);

    if (!data) {
        return {
            title: "Cardápio não encontrado",
            description: "Este cardápio não existe ou foi removido.",
        };
    }

    const { organization } = data;
    const itemCount = data.items.length;
    const categoryCount = data.categories.length;

    return {
        title: `${organization.name} | Cardápio Digital`,
        description: `Confira o cardápio de ${organization.name}. ${categoryCount} categorias e ${itemCount} itens disponíveis.`,
        openGraph: {
            title: `${organization.name} | Cardápio Digital`,
            description: `Confira o cardápio de ${organization.name}. ${categoryCount} categorias e ${itemCount} itens disponíveis.`,
            type: "website",
            locale: "pt_BR",
            siteName: "Cardápio Digital",
            images: organization.logo_url ? [
                {
                    url: organization.logo_url,
                    width: 200,
                    height: 200,
                    alt: `Logo de ${organization.name}`,
                }
            ] : [],
        },
        twitter: {
            card: "summary",
            title: `${organization.name} | Cardápio Digital`,
            description: `Confira o cardápio de ${organization.name}`,
            images: organization.logo_url ? [organization.logo_url] : [],
        },
    };
}

export default async function PublicMenuPage({ params }: Props) {
    const { slug } = await params;
    const data = await getPublicMenu(slug);

    if (!data) {
        notFound();
    }

    const { organization, categories, items } = data;
    const template = getTemplate(organization.theme_preset as TemplateId);

    // Check if user is logged in to show back button
    const { userId } = await auth();

    // Group items by category
    const itemsByCategory = categories.map((cat) => ({
        ...cat,
        items: items.filter((item) => item.category_id === cat.id),
    }));

    return (
        <div
            className="min-h-screen overflow-x-hidden"
            style={{
                // @ts-expect-error CSS custom properties
                "--background": template.styles.background,
                "--foreground": template.styles.foreground,
                "--primary": template.styles.primary,
                "--primary-foreground": template.styles.primaryForeground,
                "--secondary": template.styles.secondary,
                "--secondary-foreground": template.styles.secondaryForeground,
                "--muted": template.styles.muted,
                "--muted-foreground": template.styles.mutedForeground,
                "--accent": template.styles.accent,
                "--accent-foreground": template.styles.accentForeground,
                "--border": template.styles.border,
                "--radius": template.styles.borderRadius,
                backgroundColor: template.styles.background,
                color: template.styles.foreground,
                fontFamily: template.styles.fontBody,
            }}
        >
            {/* Header */}
            <header
                className="sticky top-0 z-50"
                style={{
                    backgroundColor: template.styles.primary,
                    color: template.styles.primaryForeground,
                    borderBottom: `${template.styles.borderWidth} solid ${template.styles.border}`,
                }}
            >
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    {userId ? (
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
                            style={{ color: template.styles.primaryForeground }}
                        >
                            <ArrowLeft className="size-4" />
                            Admin
                        </Link>
                    ) : (
                        <div className="w-16"></div>
                    )}
                    <div className="flex items-center gap-3 flex-1 justify-center">
                        {organization.logo_url && (
                            <Image
                                src={organization.logo_url}
                                alt={`Logo ${organization.name}`}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                                style={{ border: `2px solid ${template.styles.primaryForeground}` }}
                            />
                        )}
                        <h1
                            className="text-2xl font-bold text-center"
                            style={{ fontFamily: template.styles.fontHeading }}
                        >
                            {organization.name}
                        </h1>
                    </div>
                    <div className="w-16"></div>
                </div>
            </header>

            {/* Category Navigation */}
            <nav
                className="sticky top-[60px] z-40 overflow-x-auto"
                style={{
                    backgroundColor: template.styles.background,
                    borderBottom: `${template.styles.borderWidth} solid ${template.styles.border}`,
                }}
            >
                <div className="container mx-auto px-4 py-3 flex gap-2">
                    {categories.map((cat) => (
                        <a
                            key={cat.id}
                            href={`#${cat.id}`}
                            className="px-4 py-2 whitespace-nowrap font-bold text-sm transition-opacity hover:opacity-80"
                            style={{
                                backgroundColor: template.styles.secondary,
                                color: template.styles.secondaryForeground,
                                border: `${template.styles.borderWidth} solid ${template.styles.border}`,
                                borderRadius: template.styles.borderRadius,
                                boxShadow: template.styles.shadow,
                            }}
                        >
                            {cat.name}
                        </a>
                    ))}
                </div>
            </nav>

            {/* Menu Content */}
            <main className="container mx-auto px-4 py-8">
                {itemsByCategory.map((category) => (
                    <section key={category.id} id={category.id} className="mb-12 scroll-mt-32">
                        {/* Category Header */}
                        <div className="mb-6">
                            <h2
                                className="text-2xl font-bold pb-2 inline-block"
                                style={{
                                    fontFamily: template.styles.fontHeading,
                                    borderBottom: `4px solid ${template.styles.primary}`,
                                }}
                            >
                                {category.name}
                            </h2>
                            {category.description && (
                                <p style={{ color: template.styles.mutedForeground }} className="mt-2">
                                    {category.description}
                                </p>
                            )}
                        </div>

                        {/* Items Grid */}
                        {category.items.length === 0 ? (
                            <p style={{ color: template.styles.mutedForeground }}>
                                Nenhum item nesta categoria.
                            </p>
                        ) : (
                            <div className="grid gap-4">
                                {category.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-4 overflow-hidden"
                                        style={{
                                            backgroundColor: template.styles.secondary,
                                            border: `${template.styles.borderWidth} solid ${template.styles.border}`,
                                            borderRadius: template.styles.borderRadius,
                                            boxShadow: template.styles.shadow,
                                        }}
                                    >
                                        {/* Image */}
                                        <div
                                            className="relative w-24 h-24 shrink-0 flex items-center justify-center"
                                            style={{
                                                backgroundColor: template.styles.muted,
                                                border: `${template.styles.borderWidth} solid ${template.styles.border}`,
                                                borderRadius: template.styles.borderRadius,
                                                overflow: "hidden",
                                            }}
                                        >
                                            {item.image_path && item.image_path.startsWith("http") ? (
                                                <Image
                                                    src={item.image_path}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <ImageIcon
                                                    className="size-8"
                                                    style={{ color: template.styles.mutedForeground }}
                                                />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3
                                                className="font-bold text-lg truncate"
                                                style={{ fontFamily: template.styles.fontHeading }}
                                            >
                                                {item.name}
                                            </h3>
                                            {item.description && (
                                                <p
                                                    className="text-sm line-clamp-2"
                                                    style={{ color: template.styles.mutedForeground }}
                                                >
                                                    {item.description}
                                                </p>
                                            )}
                                            <p
                                                className="mt-2 text-xl font-bold px-2 py-1 inline-block"
                                                style={{
                                                    backgroundColor: template.styles.accent,
                                                    color: template.styles.accentForeground,
                                                    borderRadius: template.styles.borderRadius,
                                                }}
                                            >
                                                R$ {parseFloat(item.price).toFixed(2).replace(".", ",")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                ))}
            </main>

            {/* Footer */}
            <footer
                className="py-6 text-center text-sm"
                style={{
                    borderTop: `${template.styles.borderWidth} solid ${template.styles.border}`,
                    color: template.styles.mutedForeground,
                }}
            >
                <p>Cardápio Digital • {organization.name}</p>
                <p className="text-xs mt-1 opacity-60">Template: {template.name}</p>
            </footer>
        </div>
    );
}
