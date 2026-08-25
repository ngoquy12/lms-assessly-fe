"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl font-sans text-sm",
                    description: "group-[.toast]:text-slate-500 text-xs",
                    actionButton: "group-[.toast]:bg-[#ab1f24] group-[.toast]:text-white font-bold rounded-lg text-xs",
                    cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 rounded-lg text-xs",
                    closeButton:
                        "group-[.toast]:!left-auto group-[.toast]:!right-2 group-[.toast]:!top-2 group-[.toast]:!transform-none group-[.toast]:bg-white group-[.toast]:text-slate-400 group-[.toast]:hover:text-slate-700 group-[.toast]:border-slate-200 group-[.toast]:hover:bg-slate-100 group-[.toast]:rounded-lg group-[.toast]:h-6 group-[.toast]:w-6 group-[.toast]:shadow-2xs",
                },
            }}
            richColors
            closeButton
            position="top-right"
            {...props}
        />
    );
};

export { Toaster };
