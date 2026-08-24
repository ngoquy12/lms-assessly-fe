import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { COMPONENT_SIZING } from "@/constants/ui-style.constants";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
    size?: "sm" | "md" | "lg";
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(({ className, value, size = "md", ...props }, ref) => (
    <ProgressPrimitive.Root ref={ref} className={cn("relative w-full overflow-hidden bg-gray-100", COMPONENT_SIZING.progress[size], className)} {...props}>
        <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-brand-600 transition-all duration-300 ease-in-out"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
