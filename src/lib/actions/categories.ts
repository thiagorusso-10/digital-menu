"use server";

import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Helper to ensure user is authorized
// MVP: Using userId as the tenant identifier (simpler than orgId)
async function checkAuth() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }
    return { userId };
}

export async function getCategories() {
    const { userId } = await checkAuth();

    // Find or create organization for this user
    const { data: org } = await supabase
        .from("organizations")
        .select("id")
        .eq("clerk_org_id", userId)
        .single();

    if (!org) return [];

    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("organization_id", org.id)
        .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

export async function createCategory(formData: FormData) {
    const { userId } = await checkAuth();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    // Find existing org for this user
    let { data: org } = await supabase
        .from("organizations")
        .select("id")
        .eq("clerk_org_id", userId)
        .single();

    // Auto-create org for MVP if missing
    if (!org) {
        const slug = `menu-${Date.now()}-${userId.slice(-6).toLowerCase()}`;
        const newOrg = await supabase.from("organizations").insert({
            clerk_org_id: userId,
            name: "Meu Restaurante",
            slug: slug,
            theme_preset: "neo-brutal",
            admin_theme: "sunset",
        }).select("id").single();

        if (newOrg.data) org = newOrg.data;
    }

    if (!org) throw new Error("Could not create organization");

    const { error } = await supabase.from("categories").insert({
        organization_id: org.id,
        name,
        description,
        is_active: true
    });

    if (error) console.error(error);
    revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
    await checkAuth();
    await supabase.from("categories").delete().eq("id", id);
    revalidatePath("/admin/categories");
}
