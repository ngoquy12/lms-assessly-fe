"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { HeaderNav, MAIN_NAVIGATION_ITEMS } from "@/components/layout/header-nav";
import { HeaderUserActions } from "@/components/layout/header-user-actions";
import { LogoutConfirmDialog } from "@/components/modals/logout-confirm-dialog";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { useCurrentUser, useLogout } from "@/hooks/queries/use-auth";
import { cn } from "@/lib/utils";
import { useAuthModal } from "@/store/use-auth-modal";

export function MainHeader() {
    const tAuth = useTranslations("auth");
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const { openModal } = useAuthModal();
    const { data: currentUser } = useCurrentUser();
    const { mutate: logoutMutate } = useLogout();
    const isAuthenticated = Boolean(currentUser);

    // Close mobile drawer on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent background scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    // eslint-disable-next-line unused-imports/no-unused-vars
    const handleLogout = () => {
        logoutMutate(undefined, {
            onSuccess: () => {
                toast.success(tAuth("logoutSuccess"));
                router.push("/");
            },
        });
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <div className="relative mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 sm:px-10">
                {/* Left: Brand Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/images/header/logo-rikkei2 1.png"
                            alt={UI_TEXT.common.appName}
                            width={114}
                            height={40}
                            className="h-10 w-auto cursor-pointer object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Center: Desktop Navigation with sliding bottom active indicator */}
                <HeaderNav />

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <HeaderUserActions />
                    ) : (
                        <button
                            type="button"
                            onClick={openModal}
                            className="hidden cursor-pointer items-center justify-center rounded-xl bg-brand-600 px-5 py-2 text-sm font-bold text-white shadow-xs transition-colors hover:bg-brand-700 sm:inline-flex"
                        >
                            {tAuth("title")}
                        </button>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        className="cursor-pointer p-2 text-slate-800 transition-colors hover:text-brand-600 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-slate-800" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Overlay (Floats and overlays directly ON TOP of the UI below without pushing it down) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-x-0 top-[72px] bottom-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div
                        className="w-full rounded-b-2xl border-t border-slate-100 bg-white px-6 py-5 shadow-2xl duration-200 animate-in slide-in-from-top-3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <nav className="space-y-1">
                            {MAIN_NAVIGATION_ITEMS.map((item, index) => {
                                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center justify-between rounded-xl px-3.5 py-3 text-[15px] font-semibold transition-all",
                                            isActive ? "bg-brand-50 font-bold text-brand-600" : "text-slate-800 hover:bg-slate-50 hover:text-brand-600",
                                        )}
                                    >
                                        <span>{item.label}</span>
                                        {item.tag && <span className="rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{item.tag}</span>}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-3 border-t border-slate-100 pt-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    if (isAuthenticated) {
                                        setIsLogoutConfirmOpen(true);
                                    } else {
                                        openModal();
                                    }
                                }}
                                className="w-full cursor-pointer rounded-xl bg-brand-600 py-3 text-center text-[15px] font-bold text-white shadow-xs transition-colors hover:bg-brand-700"
                            >
                                {isAuthenticated ? tAuth("logout") : tAuth("title")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Logout Confirm Dialog */}
            <LogoutConfirmDialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen} />
        </header>
    );
}
