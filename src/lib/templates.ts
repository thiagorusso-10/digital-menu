// Theme/Template definitions for the digital menu

export type TemplateId = "neo-brutal" | "minimal" | "dark" | "colorful" | "rustic";

export interface Template {
    id: TemplateId;
    name: string;
    description: string;
    preview: string; // Emoji for preview
    styles: {
        // Background & Text
        background: string;
        foreground: string;
        // Primary (headers, CTAs)
        primary: string;
        primaryForeground: string;
        // Secondary (cards)
        secondary: string;
        secondaryForeground: string;
        // Muted (descriptions)
        muted: string;
        mutedForeground: string;
        // Accent (prices, highlights)
        accent: string;
        accentForeground: string;
        // Border
        border: string;
        borderWidth: string;
        borderRadius: string;
        // Shadow
        shadow: string;
        // Font
        fontHeading: string;
        fontBody: string;
    };
}

export const templates: Record<TemplateId, Template> = {
    "neo-brutal": {
        id: "neo-brutal",
        name: "Neo Brutal",
        description: "Bordas marcadas, sombras duras, alto contraste",
        preview: "⚡",
        styles: {
            background: "#FFFBEB", // Warm white
            foreground: "#1C1917",
            primary: "#FACC15", // Yellow
            primaryForeground: "#1C1917",
            secondary: "#FEF3C7",
            secondaryForeground: "#1C1917",
            muted: "#F5F5F4",
            mutedForeground: "#78716C",
            accent: "#1C1917",
            accentForeground: "#FACC15",
            border: "#1C1917",
            borderWidth: "2px",
            borderRadius: "0px",
            shadow: "4px 4px 0px #1C1917",
            fontHeading: "'Space Grotesk', sans-serif",
            fontBody: "'Inter', sans-serif",
        },
    },
    minimal: {
        id: "minimal",
        name: "Minimal",
        description: "Clean, elegante, muito espaço branco",
        preview: "✨",
        styles: {
            background: "#FFFFFF",
            foreground: "#171717",
            primary: "#171717",
            primaryForeground: "#FFFFFF",
            secondary: "#FAFAFA",
            secondaryForeground: "#171717",
            muted: "#F5F5F5",
            mutedForeground: "#737373",
            accent: "#171717",
            accentForeground: "#FFFFFF",
            border: "#E5E5E5",
            borderWidth: "1px",
            borderRadius: "8px",
            shadow: "0 1px 3px rgba(0,0,0,0.1)",
            fontHeading: "'Outfit', sans-serif",
            fontBody: "'Inter', sans-serif",
        },
    },
    dark: {
        id: "dark",
        name: "Dark Mode",
        description: "Fundo escuro, detalhes dourados, sofisticado",
        preview: "🌙",
        styles: {
            background: "#0A0A0A",
            foreground: "#FAFAFA",
            primary: "#D4AF37", // Gold
            primaryForeground: "#0A0A0A",
            secondary: "#1C1C1C",
            secondaryForeground: "#FAFAFA",
            muted: "#262626",
            mutedForeground: "#A3A3A3",
            accent: "#D4AF37",
            accentForeground: "#0A0A0A",
            border: "#2A2A2A",
            borderWidth: "1px",
            borderRadius: "4px",
            shadow: "0 4px 12px rgba(0,0,0,0.5)",
            fontHeading: "'Playfair Display', serif",
            fontBody: "'Inter', sans-serif",
        },
    },
    colorful: {
        id: "colorful",
        name: "Colorful",
        description: "Vibrante, gradientes suaves, divertido",
        preview: "🌈",
        styles: {
            background: "#FDF2F8", // Light pink
            foreground: "#1E293B",
            primary: "#EC4899", // Pink
            primaryForeground: "#FFFFFF",
            secondary: "#E0F2FE", // Light blue
            secondaryForeground: "#1E293B",
            muted: "#F1F5F9",
            mutedForeground: "#64748B",
            accent: "#8B5CF6", // Purple
            accentForeground: "#FFFFFF",
            border: "#E2E8F0",
            borderWidth: "2px",
            borderRadius: "16px",
            shadow: "0 4px 14px rgba(236, 72, 153, 0.15)",
            fontHeading: "'Poppins', sans-serif",
            fontBody: "'Inter', sans-serif",
        },
    },
    rustic: {
        id: "rustic",
        name: "Rustic",
        description: "Tons terrosos, acolhedor, tradicional",
        preview: "🍕",
        styles: {
            background: "#FFFBF5", // Cream
            foreground: "#3D2314",
            primary: "#8B4513", // Saddle brown
            primaryForeground: "#FFFBF5",
            secondary: "#F5E6D3",
            secondaryForeground: "#3D2314",
            muted: "#EDE0D4",
            mutedForeground: "#6B5344",
            accent: "#2D5016", // Forest green
            accentForeground: "#FFFBF5",
            border: "#D4C4B0",
            borderWidth: "1px",
            borderRadius: "4px",
            shadow: "0 2px 8px rgba(61, 35, 20, 0.1)",
            fontHeading: "'Playfair Display', serif",
            fontBody: "'Lora', serif",
        },
    },
};

export const templateList = Object.values(templates);

export function getTemplate(id: TemplateId | string | null | undefined): Template {
    return templates[id as TemplateId] || templates["neo-brutal"];
}

// Generate CSS variables from template
export function getTemplateCSS(template: Template): string {
    const { styles } = template;
    return `
    --background: ${styles.background};
    --foreground: ${styles.foreground};
    --primary: ${styles.primary};
    --primary-foreground: ${styles.primaryForeground};
    --secondary: ${styles.secondary};
    --secondary-foreground: ${styles.secondaryForeground};
    --muted: ${styles.muted};
    --muted-foreground: ${styles.mutedForeground};
    --accent: ${styles.accent};
    --accent-foreground: ${styles.accentForeground};
    --border: ${styles.border};
    --border-width: ${styles.borderWidth};
    --radius: ${styles.borderRadius};
    --shadow: ${styles.shadow};
    --font-heading: ${styles.fontHeading};
    --font-body: ${styles.fontBody};
  `;
}
