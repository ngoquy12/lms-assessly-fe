"use client";

import { ArrowRight, Award, Calendar, Clock, FileText, Headphones, MapPin, UserCheck, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeaderNav } from "@/components/layout/header-nav";
import { HeaderUserActions } from "@/components/layout/header-user-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToeicResult } from "@/hooks/queries/use-toeic";
import type { ToeicResult } from "@/types/toeic.types";

export function ToeicResultView({ examId: _examId }: { examId: string }) {
    const { data } = useToeicResult();
    const result: ToeicResult = data ?? {
        totalScore: 0,
        maxScore: 0,
        listeningScore: 0,
        readingScore: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        totalWrong: 0,
        percentage: 0,
        durationSpentSeconds: 0,
        avgSecondsPerQuestion: "0",
    };
    const { totalScore, maxScore, listeningScore, readingScore, percentage, durationSpentSeconds, avgSecondsPerQuestion } = result;

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-slate-900">
            {/* 1. Header (Brand Logo + 5 Navigation Tabs + Candidate Avatar) */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white shadow-2xs">
                <div className="relative mx-auto flex h-18 max-w-[1440px] items-center justify-between px-6 sm:px-10">
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

                    {/* Center: Navigation Links */}
                    <HeaderNav />

                    {/* Right: Actions with Bell & Avatar Dropdowns */}
                    <HeaderUserActions />
                </div>
            </header>

            {/* 2. Main Result Content */}
            <main className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10">
                <div className="space-y-6">
                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                        <Link href="/toeic" className="transition-colors hover:text-[#ab1f24]">
                            TOEIC
                        </Link>
                        <span>/</span>
                        <span className="font-bold text-slate-900">Báo cáo kết quả bài thi TOEIC</span>
                    </div>

                    {/* 1. Hero Score Banner Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
                        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                            {/* Left: Title & Status */}
                            <div className="space-y-2.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="rounded-lg border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
                                    >
                                        Đạt tiêu chuẩn (Passed)
                                    </Badge>
                                    <Badge className="border border-slate-200 bg-slate-100 text-xs font-medium text-slate-700 shadow-none">
                                        Xếp loại: Xuất sắc (B2 - C1)
                                    </Badge>
                                    <span className="flex items-center gap-1 text-xs font-normal text-slate-500">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        <span>24/08/2026 16:40:00</span>
                                    </span>
                                </div>

                                <div>
                                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                        TOEIC Full Test 2026 — Đề Chuẩn ETS Format (Listening & Reading)
                                    </h1>
                                    <p className="mt-1 text-sm font-normal text-slate-600">
                                        Báo cáo phân tích chi tiết kết quả bài thi khảo sát năng lực ngoại ngữ TOEIC sinh viên.
                                    </p>
                                </div>
                            </div>

                            {/* Right: Big Score Box */}
                            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-red-100 bg-linear-to-br from-red-50/70 via-white to-red-50/30 p-4 shadow-2xs sm:p-5">
                                <div className="text-center sm:text-right">
                                    <p className="text-xs font-medium text-slate-500">Tổng điểm TOEIC đạt được</p>
                                    <div className="mt-0.5 flex items-baseline justify-center gap-1 sm:justify-end">
                                        <span className="text-3xl font-bold tracking-tight text-[#ab1f24] sm:text-4xl">{totalScore}</span>
                                        <span className="text-base font-semibold text-slate-400">/{maxScore}</span>
                                    </div>
                                    <p className="mt-0.5 text-xs font-semibold text-emerald-700">Tỷ lệ hoàn thành: {percentage}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Core 4-Metric Summary Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Listening Score */}
                        <Card className="space-y-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-4 shadow-2xs sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">Điểm Nghe (Listening)</span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-2xs">
                                    <Headphones className="h-4 w-4" />
                                </div>
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-emerald-800 sm:text-2xl">
                                    {listeningScore} <span className="text-xs font-normal text-slate-500 sm:text-sm">/ 495 pts</span>
                                </p>
                                <p className="mt-0.5 text-xs font-medium text-emerald-700">Đúng 89/100 câu (90%)</p>
                            </div>
                        </Card>

                        {/* 2. Reading Score */}
                        <Card className="space-y-2.5 rounded-2xl border border-indigo-200/80 bg-indigo-50/30 p-4 shadow-2xs sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">Điểm Đọc (Reading)</span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 shadow-2xs">
                                    <Award className="h-4 w-4" />
                                </div>
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-indigo-800 sm:text-2xl">
                                    {readingScore} <span className="text-xs font-normal text-slate-500 sm:text-sm">/ 495 pts</span>
                                </p>
                                <p className="mt-0.5 text-xs font-medium text-indigo-700">Đúng 83/100 câu (82%)</p>
                            </div>
                        </Card>

                        {/* 3. Duration Spent */}
                        <Card className="space-y-2.5 rounded-2xl border border-amber-200/80 bg-amber-50/30 p-4 shadow-2xs sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">Thời gian làm bài</span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shadow-2xs">
                                    <Clock className="h-4 w-4" />
                                </div>
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-amber-800 sm:text-2xl">
                                    {Math.floor(durationSpentSeconds / 60)}p {durationSpentSeconds % 60}s
                                </p>
                                <p className="mt-0.5 text-xs font-medium text-amber-700">Thời lượng tối đa: 120 phút</p>
                            </div>
                        </Card>

                        {/* 4. Average Pace */}
                        <Card className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">Tốc độ trung bình</span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-2xs">
                                    <Zap className="h-4 w-4 text-[#ab1f24]" />
                                </div>
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-slate-900 sm:text-2xl">
                                    ~{avgSecondsPerQuestion} <span className="text-xs font-normal text-slate-500 sm:text-sm">giây/câu</span>
                                </p>
                                <p className="mt-0.5 text-xs font-normal text-slate-500">Nhịp độ làm bài rất tốt</p>
                            </div>
                        </Card>
                    </div>

                    {/* 3. Skill Breakdown: Listening vs Reading */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Listening Breakdown */}
                        <Card className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 p-0 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="rounded-xl bg-red-50 p-2 text-[#ab1f24]">
                                        <Headphones className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-bold text-slate-900 sm:text-base">Kỹ năng Nghe hiểu (Listening)</CardTitle>
                                        <CardDescription className="text-2xs text-slate-500">Part 1, 2, 3, 4 (100 câu)</CardDescription>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-mono text-lg font-bold text-[#ab1f24]">{listeningScore}</span>
                                    <span className="text-xs text-slate-400">/495</span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3 p-0">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium text-slate-700">
                                        <span>Part 1 & 2: Mô tả tranh & Hỏi đáp nhanh</span>
                                        <span className="font-semibold text-[#ab1f24]">28/31 câu (90%)</span>
                                    </div>
                                    <Progress value={90} className="h-2" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium text-slate-700">
                                        <span>Part 3 & 4: Đoạn hội thoại & Bài nói ngắn</span>
                                        <span className="font-semibold text-[#ab1f24]">61/69 câu (88%)</span>
                                    </div>
                                    <Progress value={88} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reading Breakdown */}
                        <Card className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 p-0 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                                        <Award className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-bold text-slate-900 sm:text-base">Kỹ năng Đọc hiểu (Reading)</CardTitle>
                                        <CardDescription className="text-2xs text-slate-500">Part 5, 6, 7 (100 câu)</CardDescription>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-mono text-lg font-bold text-indigo-600">{readingScore}</span>
                                    <span className="text-xs text-slate-400">/495</span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3 p-0">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium text-slate-700">
                                        <span>Part 5 & 6: Ngữ pháp & Điền đoạn văn</span>
                                        <span className="font-semibold text-indigo-600">42/46 câu (91%)</span>
                                    </div>
                                    <Progress value={91} className="h-2" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium text-slate-700">
                                        <span>Part 7: Đọc hiểu văn bản đơn & đa đoạn</span>
                                        <span className="font-semibold text-indigo-600">41/54 câu (76%)</span>
                                    </div>
                                    <Progress value={76} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 4. Candidate & Exam Session Details Box (Standardized) */}
                    <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
                        <CardHeader className="border-b border-slate-100 p-0 pb-3.5">
                            <CardTitle className="text-sm font-bold text-slate-900 sm:text-base">Thông tin thí sinh & ca thi</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 pt-4">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2 md:grid-cols-3">
                                {/* 1. Candidate Name */}
                                <div className="space-y-1">
                                    <span className="text-xs font-normal text-slate-500">Họ và tên thí sinh:</span>
                                    <p className="font-bold text-slate-900">Bảo Hoàng 01</p>
                                </div>

                                {/* 2. Candidate Code & SBD */}
                                <div className="space-y-1">
                                    <span className="text-xs font-normal text-slate-500">Mã sinh viên / Số báo danh:</span>
                                    <p className="font-mono font-bold text-slate-900">
                                        BH-2026-0889 <span className="font-sans font-medium text-slate-600">(SBD-042)</span>
                                    </p>
                                </div>

                                {/* 3. Candidate Class */}
                                <div className="space-y-1">
                                    <span className="text-xs font-normal text-slate-500">Lớp học / Khóa đào tạo:</span>
                                    <p className="font-semibold text-slate-900">Lớp K23-WebDev (Khóa K23)</p>
                                </div>

                                {/* 4. Subject */}
                                <div className="space-y-1">
                                    <span className="text-xs font-normal text-slate-500">Môn thi / Chuyên đề:</span>
                                    <p className="font-semibold text-slate-900">TOEIC Listening & Reading (ETS Format)</p>
                                </div>

                                {/* 5. Room Name */}
                                <div className="space-y-1">
                                    <span className="text-xs font-normal text-slate-500">Tên phòng thi / Địa điểm:</span>
                                    <p className="flex items-center gap-1.5 font-semibold text-slate-900">
                                        <MapPin className="h-3.5 w-3.5 text-[#ab1f24]" />
                                        <span>Phòng Khảo thí TOEIC 01</span>
                                    </p>
                                </div>

                                {/* 6. Exam Code */}
                                <div className="space-y-1">
                                    <span className="text-xs font-normal text-slate-500">Mã ca thi:</span>
                                    <p className="font-mono font-bold text-slate-900">TOEIC-2026-01</p>
                                </div>

                                {/* 7. Proctors (Giám thị) */}
                                <div className="space-y-1 sm:col-span-2">
                                    <span className="text-xs font-normal text-slate-500">Danh sách giám thị (Cán bộ coi thi):</span>
                                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                        {["ThS. Nguyễn Văn Anh (CBCT 1)", "ThS. Lê Thị Bích (CBCT 2)"].map((proctor, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                                            >
                                                <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                                                <span>{proctor}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 8. Exam Time Range */}
                                <div className="space-y-1">
                                    <span className="text-xs font-normal text-slate-500">Khung giờ ca thi:</span>
                                    <p className="text-xs font-semibold text-slate-900 sm:text-sm">08:00:00 - 10:00:00 (24/08/2026)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 5. Navigation Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                        <Link href="/toeic">
                            <Button
                                variant="outline"
                                className="h-10 gap-2 rounded-xl border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
                            >
                                <FileText className="h-4 w-4" />
                                <span>Quay lại danh sách ca thi TOEIC</span>
                            </Button>
                        </Link>

                        <Link href="/">
                            <Button className="h-10 gap-2 rounded-xl bg-[#ab1f24] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[#8b1a1f] sm:text-sm">
                                <span>Về trang chủ</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
