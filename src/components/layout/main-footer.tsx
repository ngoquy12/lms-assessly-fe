"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { FOOTER_EXTRA_GROUPS, FOOTER_OFFICES, FOOTER_PRODUCT_GROUPS } from "@/mocks/user.mock";

export function MainFooter() {
    return (
        <footer className="w-full border-t border-gray-200/80 bg-slate-50 font-sans text-gray-800">
            <div className="mx-auto max-w-[1440px] px-6 pt-12 pb-6 sm:px-10 lg:pt-14 lg:pb-7">
                {/* 1. Header Row: Logo & Brand Statement + Socials */}
                <div className="mb-12 flex flex-col items-start justify-between gap-8 border-b border-gray-200/80 pb-10 lg:flex-row lg:items-center">
                    <div className="flex max-w-2xl flex-col gap-4">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/images/footer/image.png"
                                alt={UI_TEXT.common.appName}
                                width={180}
                                height={52}
                                className="h-11 w-auto object-contain"
                                priority
                            />
                        </Link>
                        <h2 className="text-2xl leading-snug font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-[28px]">{UI_TEXT.footer.headline}</h2>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex items-center gap-3.5">
                        {/* Facebook */}
                        <a
                            href="https://www.facebook.com/rikkeiacademy"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-white shadow-sm transition-all hover:scale-105 hover:bg-brand-800 hover:shadow-md"
                        >
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/company/rikkeisoft"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-white shadow-sm transition-all hover:scale-105 hover:bg-brand-800 hover:shadow-md"
                        >
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>

                        {/* TikTok */}
                        <a
                            href="https://www.tiktok.com/@rikkeiacademy"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-white shadow-sm transition-all hover:scale-105 hover:bg-brand-800 hover:shadow-md"
                        >
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.02 3.32-1.51 3.35-3.33.05-3.83.02-7.66.03-11.49 0-.25-.01-.5-.03-.75z" />
                            </svg>
                        </a>

                        {/* YouTube */}
                        <a
                            href="https://www.youtube.com/@RikkeiAcademy"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-white shadow-sm transition-all hover:scale-105 hover:bg-brand-800 hover:shadow-md"
                        >
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* 2. Main Grid */}
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {/* Column 1: THÔNG TIN LIÊN HỆ */}
                    <section className="space-y-6">
                        <h3 className="text-base font-bold text-gray-500">{UI_TEXT.footer.contactInfo}</h3>

                        <ul className="space-y-5">
                            {FOOTER_OFFICES.map((office) => (
                                <li key={office.id} className="flex items-start gap-3">
                                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base leading-snug font-bold text-gray-900">{office.label}</p>
                                        <p className="text-sm leading-relaxed font-normal text-gray-600 sm:text-base">{office.address}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Hotline & Email Row */}
                        <div className="mt-8 grid grid-cols-1 gap-6 border-t border-gray-200/80 pt-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-gray-500">{UI_TEXT.footer.phoneLabel}</p>
                                <a
                                    href="tel:0862069233"
                                    className="group flex items-center gap-2.5 text-base text-gray-900 transition-colors hover:text-brand-600"
                                >
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                                        <Phone className="h-3.5 w-3.5" />
                                    </div>
                                    <span>0862 069 233</span>
                                </a>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-gray-500">{UI_TEXT.footer.emailLabel}</p>
                                <a
                                    href="mailto:academy@rikkeisoft.com"
                                    className="group flex items-center gap-2.5 text-base text-gray-900 transition-colors hover:text-brand-600"
                                >
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                                        <Mail className="h-3.5 w-3.5" />
                                    </div>
                                    <span>academy@rikkeisoft.com</span>
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Column 2: SẢN PHẨM & DỊCH VỤ */}
                    <section className="space-y-8">
                        <h3 className="text-base font-bold text-gray-500">{UI_TEXT.footer.productsServices}</h3>

                        {FOOTER_PRODUCT_GROUPS.map((group, index) => (
                            <div key={index} className="space-y-3">
                                <h4 className="text-base font-bold text-gray-900 sm:text-lg">{group.title}</h4>
                                <ul className="space-y-2.5">
                                    {group.items.map((item, itemIdx) => (
                                        <li
                                            key={itemIdx}
                                            className="cursor-default text-sm leading-relaxed font-normal text-gray-600 transition-colors hover:text-brand-600 sm:text-base"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    {/* Column 3: HỆ SINH THÁI */}
                    <section className="space-y-8">
                        {FOOTER_EXTRA_GROUPS.map((group, index) => (
                            <div key={index} className="space-y-3">
                                <h3 className="text-base font-bold text-gray-900 sm:text-lg">{group.title}</h3>
                                <ul className="space-y-2.5">
                                    {group.items.map((item, itemIdx) => (
                                        <li
                                            key={itemIdx}
                                            className="cursor-default text-sm leading-relaxed font-normal text-gray-600 transition-colors hover:text-brand-600 sm:text-base"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                </div>

                {/* 3. Bottom Copyright Bar */}
                <div className="mt-10 border-t border-gray-200/80 pt-6 text-center text-sm font-medium text-gray-500">
                    <p>{UI_TEXT.footer.copyright}</p>
                </div>
            </div>
        </footer>
    );
}
