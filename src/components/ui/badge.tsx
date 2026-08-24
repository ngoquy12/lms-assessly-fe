import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { COMPONENT_SIZING, COMPONENT_VARIANTS } from "@/constants/ui-style.constants";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2", {
    variants: {
        variant: {
            default: COMPONENT_VARIANTS.badge.default,
            primary: COMPONENT_VARIANTS.badge.primary,
            secondary: COMPONENT_VARIANTS.badge.secondary,
            outline: COMPONENT_VARIANTS.badge.outline,
            success: COMPONENT_VARIANTS.badge.success,
            warning: COMPONENT_VARIANTS.badge.warning,
            destructive: COMPONENT_VARIANTS.badge.destructive,
        },
        size: {
            sm: COMPONENT_SIZING.badge.sm,
            md: COMPONENT_SIZING.badge.md, // Default
            lg: COMPONENT_SIZING.badge.lg,
        },
    },
    defaultVariants: {
        variant: "default",
        size: "md",
    },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
