import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { COMPONENT_SIZING, FOCUS_RING } from "@/constants/ui-style.constants";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
    size?: "sm" | "md" | "lg";
}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(({ className, size = "md", ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn("inline-flex items-center justify-center bg-gray-100 text-gray-500", COMPONENT_SIZING.tabs[size], className)}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(
                "inline-flex cursor-pointer items-center justify-center rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-brand-700 data-[state=active]:shadow-xs",
                FOCUS_RING.default,
                className,
            )}
            {...props}
        />
    ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
    ({ className, ...props }, ref) => <TabsPrimitive.Content ref={ref} className={cn("mt-2", FOCUS_RING.default, className)} {...props} />,
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
