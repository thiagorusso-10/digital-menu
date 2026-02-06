import { getOrganizationSettings } from "@/lib/actions/settings";
import { getAdminTemplate } from "@/lib/admin-templates";
import { AdminLayoutClient } from "@/components/admin/layout-client";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let template = getAdminTemplate("sunset");
    let orgName = "Cardápio";
    let logoUrl: string | null = null;

    try {
        const settings = await getOrganizationSettings();
        if (settings) {
            template = getAdminTemplate(settings.admin_theme);
            orgName = settings.name || "Cardápio";
            logoUrl = settings.logo_url;
        }
    } catch {
        // Not logged in, use defaults
    }

    return (
        <AdminLayoutClient
            template={template}
            orgName={orgName}
            logoUrl={logoUrl}
        >
            {children}
        </AdminLayoutClient>
    );
}
