"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthModal } from "@/store/use-auth-modal";

interface NavLinkItem {
    href: Route;
    label: string;
    tag?: string;
}

const NAVIGATION_ITEMS: NavLinkItem[] = [
    { href: "/page-exam", label: "Khảo thí" },
    { href: "/toeic", label: "TOEIC" },
    { href: "/competency-assessment", label: "Khởi nguyên", tag: "new" },
    { href: "/exam-result", label: "Hoạt động" },
    { href: "/interview", label: "Interview" },
];

export function MainHeader() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { openModal } = useAuthModal();

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <div className="relative mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 sm:px-10">
                {/* Left: Brand Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/images/header/logo-rikkei2 1.png"
                            alt="RikkeiEdu"
                            width={114}
                            height={40}
                            className="h-10 w-auto cursor-pointer object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Center: Desktop Navigation (Absolute Centered, 16px font-medium, 32px gap) */}
                <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex">
                    {NAVIGATION_ITEMS.map((item, index) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "relative flex cursor-pointer items-center text-[16px] font-medium transition-colors hover:text-[#ab1f24]",
                                    isActive ? "font-semibold text-[#ab1f24]" : "text-[#1e2328]",
                                )}
                            >
                                <span>{item.label}</span>
                                {item.tag && (
                                    <span className="absolute -top-2 left-full ml-0.5 rounded bg-[#ab1f24] px-1 py-0.5 text-[8px] leading-none font-semibold text-white">
                                        {item.tag}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={openModal}
                        className="hidden cursor-pointer items-center justify-center rounded-lg bg-[#ab1f24] px-6 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-[#8b1a1f] sm:inline-flex"
                    >
                        Đăng nhập
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        className="cursor-pointer p-2 text-[#1e2328] transition-colors hover:text-[#ab1f24] lg:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="space-y-3 border-t border-gray-100 bg-white px-6 py-4 shadow-md lg:hidden">
                    {NAVIGATION_ITEMS.map((item, index) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center justify-between border-b border-gray-50 py-2 text-[16px] font-medium transition-colors",
                                    isActive ? "font-bold text-[#ab1f24]" : "text-[#1e2328] hover:text-[#ab1f24]",
                                )}
                            >
                                <span>{item.label}</span>
                                {item.tag && <span className="rounded bg-[#ab1f24] px-1.5 py-0.5 text-[9px] font-semibold text-white">{item.tag}</span>}
                            </Link>
                        );
                    })}

                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                openModal();
                            }}
                            className="w-full cursor-pointer rounded-lg bg-[#ab1f24] py-3 text-center text-[16px] font-medium text-white hover:bg-[#8b1a1f]"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
