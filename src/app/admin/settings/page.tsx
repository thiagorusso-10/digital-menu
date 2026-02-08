import { getOrganizationSettings } from "@/lib/actions/settings";
import { redirect } from "next/navigation";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
    let org = await getOrganizationSettings();

    if (!org) {
        // Auto-fix: Create organization if it doesn't exist
        // This handles cases where webhook failed or user was created before DB setup
        try {
            const { createDefaultOrganization } = await import("@/lib/actions/settings");
            await createDefaultOrganization();
            org = await getOrganizationSettings();
        } catch (error) {
            console.error("Auto-creation failed:", error);
        }

        if (!org) {
            redirect("/admin/categories");
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Configurações</h1>
                <p className="text-slate-500">Personalize seu restaurante e cardápio</p>
            </div>

            <SettingsClient settings={org} />
        </div>
    );
}
