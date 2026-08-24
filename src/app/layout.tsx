import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ICON_COLORS } from "@/constants/app.constants";
import { UI_TEXT } from "@/constants/ui-text.constants";
import "@/styles/globals.css";
import { cx } from "@/utils/cx";
import { primaryFont } from "./fonts";

export const metadata: Metadata = {
    title: {
        template: "%s | LMS Assessly",
        default: UI_TEXT.metadata.layout.titleDefault,
    },
    description: UI_TEXT.metadata.layout.description,
};

export const viewport: Viewport = {
    themeColor: ICON_COLORS.BRAND_500,
    colorScheme: "light",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body className={cx(primaryFont.variable, primaryFont.className, "min-h-screen bg-cream antialiased")}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
