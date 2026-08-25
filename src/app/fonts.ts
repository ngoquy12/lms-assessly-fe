import { Be_Vietnam_Pro } from "next/font/google";

/** Google Font Be Vietnam Pro (400 regular, 500 medium, 600 semi-bold, 700 bold) with Vietnamese subset */
export const primaryFont = Be_Vietnam_Pro({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin", "vietnamese"],
    variable: "--font-sans-primary",
    display: "swap",
});
