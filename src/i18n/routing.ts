export const LOCALES = ["vi", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "vi";
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export const LOCALE_LABELS: Record<Locale, { label: string; flag: string }> = {
    vi: {
        label: "Tiếng Việt",
        flag: "🇻🇳",
    },
    en: {
        label: "English",
        flag: "🇬🇧",
    },
};
