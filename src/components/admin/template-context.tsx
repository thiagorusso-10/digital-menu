"use client";

import { createContext, useContext } from "react";
import { AdminTemplate, getAdminTemplate } from "@/lib/admin-templates";

const AdminTemplateContext = createContext<AdminTemplate>(getAdminTemplate("sunset"));

export function AdminTemplateProvider({
    children,
    template
}: {
    children: React.ReactNode;
    template: AdminTemplate;
}) {
    return (
        <AdminTemplateContext.Provider value={template}>
            {children}
        </AdminTemplateContext.Provider>
    );
}

export function useAdminTemplate() {
    return useContext(AdminTemplateContext);
}
