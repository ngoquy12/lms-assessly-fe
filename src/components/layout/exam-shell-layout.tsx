"use client";

import * as React from "react";
import { AlertTriangle, Clock, ShieldCheck, Wifi } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/constants/ui-text.constants";

export interface ExamShellLayoutProps {
    children: React.ReactNode;
    examTitle: string;
    candidateName: string;
    candidateCode: string;
    remainingTimeText?: string;
    isProctored?: boolean;
    onSubmitClick?: () => void;
}

export function ExamShellLayout({
    children,
    examTitle,
    candidateName,
    candidateCode,
    remainingTimeText = "45:00",
    isProctored = true,
    onSubmitClick,
}: ExamShellLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 select-none">
            {/* Top Distraction-Free Exam Bar */}
            <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-xs sm:px-6">
                {/* Left: Brand & Exam Name */}
                <div className="flex items-center gap-4">
                    <Link href="/page-exam" className="flex items-center gap-2">
                        <Image
                            src="/images/header/logo-rikkei2 1.png"
                            alt={UI_TEXT.common.appName}
                            width={110}
                            height={32}
                            className="h-8 w-auto object-contain"
                            priority
                        />
                    </Link>

                    <div className="h-5 w-px bg-gray-300" />

                    <div>
                        <h1 className="line-clamp-1 max-w-md text-sm font-bold text-gray-900">{examTitle}</h1>
                        <p className="text-xs text-gray-500">
                            Thí sinh: {candidateName} ({candidateCode})
                        </p>
                    </div>
                </div>

                {/* Center: Realtime Countdown Timer */}
                <div className="flex items-center gap-2 rounded-xl border border-brand-200/60 bg-brand-50 px-4 py-1.5 shadow-xs">
                    <Clock className="h-4 w-4 animate-pulse text-brand-600" />
                    <span className="font-mono text-base font-bold text-brand-700">{remainingTimeText}</span>
                </div>

                {/* Right: Security & Actions */}
                <div className="flex items-center gap-3">
                    {isProctored && (
                        <div className="hidden items-center gap-1.5 text-xs text-emerald-600 sm:flex">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="font-medium">Giám thị đang kết nối</span>
                        </div>
                    )}

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Wifi className="h-4 w-4 text-emerald-500" />
                    </div>

                    <Button size="sm" variant="destructive" onClick={onSubmitClick} className="gap-1.5">
                        Nộp bài thi
                    </Button>
                </div>
            </header>

            {/* Anti-cheat banner warning */}
            <div className="flex items-center justify-center gap-2 border-b border-amber-200/60 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>Chế độ giám sát thi trực tuyến: Nghiêm cấm rời khỏi màn hình hoặc mở tab khác. Mọi hành vi sẽ được ghi nhận.</span>
            </div>

            {/* Main Exam Area */}
            <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">{children}</main>
        </div>
    );
}
