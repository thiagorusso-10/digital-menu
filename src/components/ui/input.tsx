import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-base text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className
            )}
            {...props}
        />
    )
}

export { Input }
