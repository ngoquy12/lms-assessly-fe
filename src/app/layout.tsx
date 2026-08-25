import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { ICON_COLORS } from "@/constants/app.constants";
import { UI_TEXT } from "@/constants/ui-text.constants";
import "@/styles/globals.css";
import { cx } from "@/utils/cx";
import { primaryFont } from "./fonts";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: {
        template: "%s | RikkeiEdu",
        default: "RikkeiEdu - Hệ thống Khảo thí & Đánh giá Năng lực",
    },
    description: UI_TEXT.metadata.layout.description,
    icons: {
        icon: [
            { url: "/favicon.png", type: "image/png" },
            { url: "/favicon.ico", sizes: "any" },
        ],
        shortcut: "/favicon.png",
        apple: "/favicon.png",
    },
};

export const viewport: Viewport = {
    themeColor: ICON_COLORS.BRAND_500,
    colorScheme: "light",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let locale = "vi";
    let messages: Record<string, unknown> = {};
    try {
        locale = await getLocale();
        messages = await getMessages();
    } catch {
        try {
            messages = (await import("@/messages/vi.json")).default;
        } catch {
            messages = {};
        }
    }

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={cx(primaryFont.variable, primaryFont.className, "min-h-screen bg-cream font-sans font-normal antialiased")}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Providers>{children}</Providers>
                </NextIntlClientProvider>
                <Toaster />
            </body>
        </html>
    );
}
