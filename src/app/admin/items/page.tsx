import { getMenuItems, createMenuItem, deleteMenuItem, updateMenuItem } from "@/lib/actions/items";
import { getCategories } from "@/lib/actions/categories";
import { uploadImage } from "@/lib/actions/settings";
import { ItemsClient } from "./items-client";

export default async function ItemsPage() {
    let items: { id: string; name: string; description?: string | null; price: string; image_path?: string | null; category_id?: string | null; categories?: { name: string } | null }[] = [];
    let categories: { id: string; name: string }[] = [];

    try {
        items = await getMenuItems() || [];
        categories = await getCategories() || [];
    } catch {
        // Not logged in or no org
    }

    return (
        <ItemsClient
            initialItems={items}
            initialCategories={categories}
            createItem={createMenuItem}
            deleteItem={deleteMenuItem}
            updateItem={updateMenuItem}
            uploadImage={uploadImage}
        />
    );
}
