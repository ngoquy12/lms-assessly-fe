import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { COMPONENT_SIZING, COMPONENT_VARIANTS, FOCUS_RING } from "@/constants/ui-style.constants";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    cn(
        "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
        FOCUS_RING.default,
    ),
    {
        variants: {
            variant: {
                default: COMPONENT_VARIANTS.button.default,
                secondary: COMPONENT_VARIANTS.button.secondary,
                outline: COMPONENT_VARIANTS.button.outline,
                ghost: COMPONENT_VARIANTS.button.ghost,
                destructive: COMPONENT_VARIANTS.button.destructive,
                success: COMPONENT_VARIANTS.button.success,
                warning: COMPONENT_VARIANTS.button.warning,
                link: COMPONENT_VARIANTS.button.link,
            },
            size: {
                xs: COMPONENT_SIZING.button.xs,
                sm: COMPONENT_SIZING.button.sm,
                md: COMPONENT_SIZING.button.md, // Default
                lg: COMPONENT_SIZING.button.lg,
                xl: COMPONENT_SIZING.button.xl,
                "icon-sm": COMPONENT_SIZING.button.icon.sm,
                "icon-md": COMPONENT_SIZING.button.icon.md,
                "icon-lg": COMPONENT_SIZING.button.icon.lg,
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
