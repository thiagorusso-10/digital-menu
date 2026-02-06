"use server";

import { supabase } from "@/lib/supabase";

// Public actions - no auth required

export async function getPublicMenu(slug: string) {
    // Find organization by slug
    const { data: org } = await supabase
        .from("organizations")
        .select("id, name, theme_preset, logo_url")
        .eq("slug", slug)
        .single();

    if (!org) return null;

    // Get categories with items
    const { data: categories } = await supabase
        .from("categories")
        .select("id, name, description, order_index")
        .eq("organization_id", org.id)
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    // Get menu items
    const { data: items } = await supabase
        .from("menu_items")
        .select("id, name, description, price, image_path, category_id, order_index")
        .eq("organization_id", org.id)
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    return {
        organization: org,
        categories: categories || [],
        items: items || [],
    };
}

export async function getOrganizationByUserId(userId: string) {
    const { data } = await supabase
        .from("organizations")
        .select("slug")
        .eq("clerk_org_id", userId)
        .single();

    return data?.slug;
}
