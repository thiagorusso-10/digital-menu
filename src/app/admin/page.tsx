import { getCategories } from "@/lib/actions/categories";
import { getMenuItems } from "@/lib/actions/items";
import { getOrganizationSettings } from "@/lib/actions/settings";
import { getAdminTemplate } from "@/lib/admin-templates";
import { DashboardClient } from "./dashboard-client";

export default async function AdminDashboard() {
    let categoriesCount = 0;
    let itemsCount = 0;
    let template = getAdminTemplate("sunset");

    try {
        const [categories, items, settings] = await Promise.all([
            getCategories(),
            getMenuItems(),
            getOrganizationSettings(),
        ]);
        categoriesCount = categories?.length || 0;
        itemsCount = items?.length || 0;
        if (settings) {
            template = getAdminTemplate(settings.admin_theme);
        }
    } catch {
        // Not logged in or no org
    }

    return (
        <DashboardClient
            categoriesCount={categoriesCount}
            itemsCount={itemsCount}
            template={template}
        />
    );
}
