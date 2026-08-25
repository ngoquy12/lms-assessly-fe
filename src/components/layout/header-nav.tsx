"use client";

import { useEffect, useRef, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavLinkItem {
    href: Route;
    label: string;
    tag?: string;
}

export const MAIN_NAVIGATION_ITEMS: NavLinkItem[] = [
    { href: "/page-exam", label: "Khảo thí" },
    { href: "/toeic", label: "TOEIC" },
    { href: "/competency-assessment", label: "Khởi nguyên" },
    { href: "/exam-result", label: "Hoạt động" },
    { href: "/interview", label: "Phỏng vấn" },
];

interface HeaderNavProps {
    activeHref?: string;
    className?: string;
}

export function HeaderNav({ activeHref, className }: HeaderNavProps) {
    const pathname = usePathname();
    const currentPath = activeHref || pathname;
    const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState<{
        left: number;
        width: number;
        opacity: number;
    }>({ left: 0, width: 0, opacity: 0 });

    const updateIndicator = () => {
        const activeIndex = MAIN_NAVIGATION_ITEMS.findIndex((item) => currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href)));

        if (activeIndex !== -1 && tabRefs.current[activeIndex]) {
            const el = tabRefs.current[activeIndex];
            if (el) {
                setIndicatorStyle({
                    left: el.offsetLeft,
                    width: el.offsetWidth,
                    opacity: 1,
                });
            }
        } else {
            setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
        }
    };

    useEffect(() => {
        updateIndicator();
        // Give a slight tick for font rendering or DOM ref calculations
        const timer = setTimeout(updateIndicator, 50);
        window.addEventListener("resize", updateIndicator);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", updateIndicator);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath]);

    return (
        <nav className={cn("absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex", className)}>
            {MAIN_NAVIGATION_ITEMS.map((item, index) => {
                const isActive = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href));

                return (
                    <Link
                        key={index}
                        ref={(el) => {
                            tabRefs.current[index] = el;
                        }}
                        href={item.href}
                        className={cn(
                            "relative flex h-full cursor-pointer items-center text-[16px] transition-colors hover:text-[#ab1f24]",
                            isActive ? "font-bold text-[#ab1f24]" : "font-medium text-[#1e2328]",
                        )}
                    >
                        <span>{item.label}</span>
                        {item.tag && (
                            <span className="absolute top-5 -right-5.5 rounded bg-[#ab1f24] px-1 py-0.5 text-[8px] leading-none font-semibold text-white">
                                {item.tag}
                            </span>
                        )}
                    </Link>
                );
            })}

            {/* Sliding Bottom Active Indicator (Hơi dày h-[3.5px], dính sát đáy border dưới của header, chuyển động mượt mà) */}
            <span
                className="pointer-events-none absolute bottom-0 h-[3.5px] rounded-t-full bg-[#ab1f24] transition-all duration-300 ease-out"
                style={{
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`,
                    opacity: indicatorStyle.opacity,
                }}
            />
        </nav>
    );
}
