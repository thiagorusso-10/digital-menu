"use server";

import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

export async function getMenuItems() {
    const { userId } = await checkAuth();
    const internalOrgId = await getOrgId(userId);
    if (!internalOrgId) return [];

    const { data, error } = await supabase
        .from("menu_items")
        .select("*, categories(name)")
        .eq("organization_id", internalOrgId)
        .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

export async function createMenuItem(formData: FormData) {
    const { userId } = await checkAuth();
    const internalOrgId = await getOrgId(userId);
    if (!internalOrgId) throw new Error("Org not found. Create a category first.");

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const imagePath = formData.get("imagePath") as string;

    await supabase.from("menu_items").insert({
        organization_id: internalOrgId,
        category_id: categoryId || null,
        name,
        description,
        price,
        image_path: imagePath || null,
        is_active: true
    });

    revalidatePath("/admin/items");
}

export async function deleteMenuItem(id: string) {
    await checkAuth();
    await supabase.from("menu_items").delete().eq("id", id);
    revalidatePath("/admin/items");
}

export async function updateMenuItem(formData: FormData) {
    await checkAuth();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const imagePath = formData.get("imagePath") as string;
    const categoryId = formData.get("categoryId") as string;

    await supabase.from("menu_items").update({
        name,
        price,
        image_path: imagePath || null,
        category_id: categoryId || null,
    }).eq("id", id);

    revalidatePath("/admin/items");
}
