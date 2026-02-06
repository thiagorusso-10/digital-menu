import { auth } from "@clerk/nextjs/server";
import { getOrganizationByUserId } from "@/lib/actions/public";
import { redirect } from "next/navigation";
import { PreviewClient } from "./preview-client";
import { getOrganizationSettings } from "@/lib/actions/settings";

export default async function PreviewPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const slug = await getOrganizationByUserId(userId);
    const settings = await getOrganizationSettings();

    return <PreviewClient slug={slug} restaurantName={settings?.name || "Restaurante"} />;
}
