"use client";

import { useEffect } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { useAuthModal } from "@/store/use-auth-modal";
import { HomeView } from "@/views/home/home-view";

export function LoginView() {
    const { openModal } = useAuthModal();

    useEffect(() => {
        openModal();
    }, [openModal]);

    return (
        <PublicLayout>
            <HomeView />
        </PublicLayout>
    );
}
