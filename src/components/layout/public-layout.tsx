import * as React from "react";
import { LoginModal } from "@/components/auth/login-modal";
import { MainFooter } from "./main-footer";
import { MainHeader } from "./main-header";

export function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-gray-900">
            <MainHeader />
            <main className="w-full flex-1">{children}</main>
            <MainFooter />
            <React.Suspense fallback={null}>
                <LoginModal />
            </React.Suspense>
        </div>
    );
}
