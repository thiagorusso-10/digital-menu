import { getCategories } from "@/lib/actions/categories";
import { CategoriesClient } from "./categories-client";

export default async function CategoriesPage() {
    let categories: { id: string; name: string; description?: string | null }[] = [];

    try {
        categories = await getCategories() || [];
    } catch {
        // User may not have org yet or not be logged in
    }

    return <CategoriesClient categories={categories} />;
}
