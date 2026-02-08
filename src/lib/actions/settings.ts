"use server";

import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { TemplateId } from "@/lib/templates";
import { AdminTemplateId } from "@/lib/admin-templates";

async function checkAuth() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId };
}

async function getOrgId(userId: string) {
    const { data } = await supabase
        .from("organizations")
        .select("id")
        .eq("clerk_org_id", userId)
        .single();
    return data?.id;
}

export async function uploadImage(formData: FormData): Promise<string> {
    const { userId } = await checkAuth();
    const file = formData.get("file") as File;

    if (!file) throw new Error("No file provided");

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "webp";
    const filename = `${userId}/${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from("menu-images")
        .upload(filename, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        console.error("Upload error:", error);
        throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from("menu-images")
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

export async function updateOrganizationTheme(theme: TemplateId) {
    const { userId } = await checkAuth();
    const orgId = await getOrgId(userId);

    if (!orgId) throw new Error("Organization not found");

    // Get slug for revalidation
    const { data: org } = await supabase
        .from("organizations")
        .select("slug")
        .eq("id", orgId)
        .single();

    const { error } = await supabase
        .from("organizations")
        .update({ theme_preset: theme })
        .eq("id", orgId);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/settings");
    revalidatePath("/admin/preview");
    if (org?.slug) {
        revalidatePath(`/menu/${org.slug}`);
    }
}

export async function updateAdminTheme(theme: AdminTemplateId) {
    const { userId } = await checkAuth();
    const orgId = await getOrgId(userId);

    if (!orgId) throw new Error("Organization not found");

    const { error } = await supabase
        .from("organizations")
        .update({ admin_theme: theme })
        .eq("id", orgId);

    if (error) throw new Error(error.message);

    revalidatePath("/admin", "layout");
}

export async function updateOrganizationInfo(data: {
    name?: string;
    logo_url?: string | null;
    favicon_url?: string | null;
}) {
    const { userId } = await checkAuth();
    const orgId = await getOrgId(userId);

    if (!orgId) throw new Error("Organization not found");

    // Get slug for revalidation
    const { data: org } = await supabase
        .from("organizations")
        .select("slug")
        .eq("id", orgId)
        .single();

    const { error } = await supabase
        .from("organizations")
        .update(data)
        .eq("id", orgId);

    if (error) throw new Error(error.message);

    revalidatePath("/admin", "layout");
    if (org?.slug) {
        revalidatePath(`/menu/${org.slug}`);
    }
}

export async function getOrganizationSettings() {
    const { userId } = await checkAuth();

    const { data } = await supabase
        .from("organizations")
        .select("id, name, slug, theme_preset, admin_theme, logo_url, favicon_url")
        .eq("clerk_org_id", userId)
        .single();

    return data;
}

export async function createDefaultOrganization() {
    const { userId } = await checkAuth();

    // Check if exists again to be safe
    const existing = await getOrganizationSettings();
    if (existing) return existing;

    const timestamp = Date.now();
    const name = "Meu Restaurante";
    const slug = `restaurante-${timestamp}`; // Simple unique slug

    const { data, error } = await supabase
        .from("organizations")
        .insert({
            clerk_org_id: userId,
            name,
            slug,
            theme_preset: "neo-brutal",
            admin_theme: "sunset"
        })
        .select()
        .single();

    if (error) {
        console.error("Failed to create default organization:", error);
        throw new Error(error.message);
    }

    return data;
}
