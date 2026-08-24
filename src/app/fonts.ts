import { Roboto } from "next/font/google";

/** Google Font Roboto (300, 400, 500, 700, 900) with Vietnamese subset for entire project */
export const primaryFont = Roboto({
    weight: ["300", "400", "500", "700", "900"],
    subsets: ["latin", "vietnamese"],
    variable: "--font-sans-primary",
    display: "swap",
});
