// Admin Panel Templates
// 3 distinct visual themes for the admin panel

export type AdminTemplateId = "sunset" | "ocean" | "midnight";

export interface AdminTemplate {
    id: AdminTemplateId;
    name: string;
    description: string;
    icon: string;
    colors: {
        // Sidebar
        sidebarBg: string;
        sidebarText: string;
        sidebarTextMuted: string;
        sidebarBorder: string;
        sidebarHover: string;
        sidebarActive: string;
        sidebarActiveShadow: string;
        // Logo area
        logoBg: string;
        logoAccent: string;
        logoShadow: string;
        // Header
        headerBg: string;
        headerText: string;
        headerTextMuted: string;
        searchBg: string;
        searchBorder: string;
        searchFocus: string;
        // Main content
        mainBg: string;
        mainPattern: string;
        // Cards
        cardBg: string;
        cardBorder: string;
        cardText: string;
        cardTextMuted: string;
        // Dashboard Banner
        bannerGradient: string;
        bannerText: string;
        // Quick Actions
        actionPrimary: string;
        actionSecondary: string;
        actionTertiary: string;
        // Accent colors
        accent: string;
        accentLight: string;
        accentGradient: string;
    };
}

export const adminTemplates: Record<AdminTemplateId, AdminTemplate> = {
    sunset: {
        id: "sunset",
        name: "Sunset",
        description: "Tons quentes de âmbar e laranja",
        icon: "🌅",
        colors: {
            // Sidebar
            sidebarBg: "bg-linear-to-b from-slate-900 via-slate-800 to-slate-900",
            sidebarText: "text-white",
            sidebarTextMuted: "text-slate-400",
            sidebarBorder: "border-slate-700/50",
            sidebarHover: "hover:text-white hover:bg-slate-700/50",
            sidebarActive: "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25",
            sidebarActiveShadow: "shadow-amber-500/25",
            // Logo area
            logoBg: "bg-linear-to-r from-amber-500/10 to-orange-500/10",
            logoAccent: "bg-linear-to-br from-amber-400 to-orange-500",
            logoShadow: "shadow-amber-500/20",
            // Header
            headerBg: "bg-white/80",
            headerText: "text-slate-900",
            headerTextMuted: "text-slate-500",
            searchBg: "bg-slate-50",
            searchBorder: "border-slate-200",
            searchFocus: "focus:ring-amber-500/50 focus:border-amber-500",
            // Main content
            mainBg: "bg-linear-to-br from-slate-50 via-white to-slate-100",
            mainPattern: "rgb(226 232 240)",
            // Cards
            cardBg: "bg-white/80",
            cardBorder: "border-slate-200/50",
            cardText: "text-slate-900",
            cardTextMuted: "text-slate-500",
            // Dashboard Banner
            bannerGradient: "bg-linear-to-r from-amber-500 via-orange-500 to-rose-500",
            bannerText: "text-white",
            // Quick Actions
            actionPrimary: "bg-blue-500 hover:bg-blue-600",
            actionSecondary: "bg-amber-500 hover:bg-amber-600",
            actionTertiary: "bg-emerald-500 hover:bg-emerald-600",
            // Accent
            accent: "amber",
            accentLight: "text-amber-400",
            accentGradient: "from-amber-500 to-orange-500",
        }
    },
    ocean: {
        id: "ocean",
        name: "Ocean",
        description: "Azul profundo e tons de cyan",
        icon: "🌊",
        colors: {
            // Sidebar
            sidebarBg: "bg-linear-to-b from-blue-950 via-blue-900 to-slate-900",
            sidebarText: "text-white",
            sidebarTextMuted: "text-blue-300/70",
            sidebarBorder: "border-blue-700/30",
            sidebarHover: "hover:text-white hover:bg-blue-800/50",
            sidebarActive: "bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25",
            sidebarActiveShadow: "shadow-cyan-500/25",
            // Logo area
            logoBg: "bg-linear-to-r from-cyan-500/10 to-blue-500/10",
            logoAccent: "bg-linear-to-br from-cyan-400 to-blue-500",
            logoShadow: "shadow-cyan-500/20",
            // Header
            headerBg: "bg-white/80",
            headerText: "text-slate-900",
            headerTextMuted: "text-slate-500",
            searchBg: "bg-slate-50",
            searchBorder: "border-slate-200",
            searchFocus: "focus:ring-cyan-500/50 focus:border-cyan-500",
            // Main content
            mainBg: "bg-linear-to-br from-blue-50/50 via-white to-cyan-50/30",
            mainPattern: "rgb(219 234 254)",
            // Cards
            cardBg: "bg-white/80",
            cardBorder: "border-blue-100",
            cardText: "text-slate-900",
            cardTextMuted: "text-slate-500",
            // Dashboard Banner
            bannerGradient: "bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500",
            bannerText: "text-white",
            // Quick Actions
            actionPrimary: "bg-cyan-500 hover:bg-cyan-600",
            actionSecondary: "bg-blue-500 hover:bg-blue-600",
            actionTertiary: "bg-teal-500 hover:bg-teal-600",
            // Accent
            accent: "cyan",
            accentLight: "text-cyan-400",
            accentGradient: "from-cyan-500 to-blue-500",
        }
    },
    midnight: {
        id: "midnight",
        name: "Midnight",
        description: "Modo escuro elegante",
        icon: "🌙",
        colors: {
            // Sidebar
            sidebarBg: "bg-linear-to-b from-zinc-950 via-zinc-900 to-black",
            sidebarText: "text-white",
            sidebarTextMuted: "text-zinc-500",
            sidebarBorder: "border-zinc-800",
            sidebarHover: "hover:text-white hover:bg-zinc-800",
            sidebarActive: "bg-linear-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25",
            sidebarActiveShadow: "shadow-violet-500/25",
            // Logo area
            logoBg: "bg-linear-to-r from-violet-500/10 to-purple-500/10",
            logoAccent: "bg-linear-to-br from-violet-400 to-purple-500",
            logoShadow: "shadow-violet-500/20",
            // Header
            headerBg: "bg-zinc-900/90",
            headerText: "text-white",
            headerTextMuted: "text-zinc-400",
            searchBg: "bg-zinc-800",
            searchBorder: "border-zinc-700",
            searchFocus: "focus:ring-violet-500/50 focus:border-violet-500",
            // Main content
            mainBg: "bg-linear-to-br from-zinc-900 via-zinc-950 to-black",
            mainPattern: "rgb(39 39 42)",
            // Cards
            cardBg: "bg-zinc-800/80",
            cardBorder: "border-zinc-700/50",
            cardText: "text-white",
            cardTextMuted: "text-zinc-400",
            // Dashboard Banner
            bannerGradient: "bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600",
            bannerText: "text-white",
            // Quick Actions
            actionPrimary: "bg-violet-500 hover:bg-violet-600",
            actionSecondary: "bg-purple-500 hover:bg-purple-600",
            actionTertiary: "bg-fuchsia-500 hover:bg-fuchsia-600",
            // Accent
            accent: "violet",
            accentLight: "text-violet-400",
            accentGradient: "from-violet-500 to-purple-500",
        }
    }
};

export function getAdminTemplate(id: AdminTemplateId | string | null | undefined): AdminTemplate {
    if (id && id in adminTemplates) {
        return adminTemplates[id as AdminTemplateId];
    }
    return adminTemplates.sunset; // Default
}
