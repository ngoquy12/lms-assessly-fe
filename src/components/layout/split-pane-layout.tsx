import * as React from "react";
import { cn } from "@/lib/utils";

export interface SplitPaneLayoutProps {
    leftContent: React.ReactNode;
    rightContent: React.ReactNode;
    className?: string;
}

export function SplitPaneLayout({ leftContent, rightContent, className }: SplitPaneLayoutProps) {
    return (
        <div className={cn("grid grid-cols-1 gap-6 lg:grid-cols-12", className)}>
            {/* Left Pane: Reading Passage / Audio Player */}
            <div className="shadow-card-sm max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-6">
                {leftContent}
            </div>

            {/* Right Pane: Question Sheet & Answers */}
            <div className="shadow-card-sm max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-6">
                {rightContent}
            </div>
        </div>
    );
}
