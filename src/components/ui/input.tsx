import * as React from "react";
import { COMPONENT_SIZING, FOCUS_RING } from "@/constants/ui-style.constants";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
    size?: "sm" | "md" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, size = "md", ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex w-full border border-gray-300 bg-white text-gray-900 shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400",
                COMPONENT_SIZING.input[size],
                FOCUS_RING.subtle,
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
