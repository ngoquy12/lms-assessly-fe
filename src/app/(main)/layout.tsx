import * as React from "react";
import { PublicLayout } from "@/components/layout/public-layout";

export default function MainRouteLayout({ children }: { children: React.ReactNode }) {
    return <PublicLayout>{children}</PublicLayout>;
}
