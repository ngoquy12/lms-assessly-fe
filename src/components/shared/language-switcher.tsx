"use client";

import { useTransition } from "react";
import Cookies from "js-cookie";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, LOCALE_LABELS, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface LanguageSwitcherProps {
    className?: string;
    variant?: "default" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

export function LanguageSwitcher({ className, variant = "outline", size = "sm" }: LanguageSwitcherProps) {
    const currentLocale = (useLocale() as Locale) || DEFAULT_LOCALE;
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleToggleLocale = () => {
        const nextLocale: Locale = currentLocale === "vi" ? "en" : "vi";
        Cookies.set(LOCALE_COOKIE_NAME, nextLocale, { expires: 365, path: "/" });
        startTransition(() => {
            router.refresh();
        });
    };

    const targetLocale: Locale = currentLocale === "vi" ? "en" : "vi";

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            onClick={handleToggleLocale}
            disabled={isPending}
            className={cn("gap-2 font-medium transition-all", className)}
            title={`Chuyển sang ${LOCALE_LABELS[targetLocale].label}`}
        >
            <Globe className="h-4 w-4 text-brand-600" />
            <span>{LOCALE_LABELS[currentLocale].flag}</span>
            <span className="text-xs font-semibold">{LOCALE_LABELS[currentLocale].label}</span>
        </Button>
    );
}
