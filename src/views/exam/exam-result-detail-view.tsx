"use client";

import { ArrowRight, Calendar, CheckCircle2, Clock, FileText, MapPin, UserCheck, XCircle, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeaderNav } from "@/components/layout/header-nav";
import { HeaderUserActions } from "@/components/layout/header-user-actions";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { useExamResult } from "@/hooks/queries/use-exam";
import { cn } from "@/lib/utils";

export function ExamResultDetailView({ examId: _examId }: { examId: string }) {
    const { data: result, isLoading, isError, refetch } = useExamResult();

    // eslint-disable-next-line unused-imports/no-unused-vars
    const getCandidateInitials = (name?: string) => {
        if (!name) return "SV";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[parts.length - 2][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-slate-900">
            {/* 1. Fixed Sticky Header (Brand Logo + 5 Navigation Tabs + Candidate Avatar) */}
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
                <QueryStateBoundary isLoading={isLoading} isError={isError} onRetry={refetch}>
                    {result ? (
                        <ExamResultDetailContent result={result} />
                    ) : (
                        <div className="flex items-center justify-center py-16 text-slate-500">{UI_TEXT.common.noData}</div>
                    )}
                </QueryStateBoundary>
            </main>
        </div>
    );
}

function ExamResultDetailContent({ result }: { result: NonNullable<ReturnType<typeof useExamResult>["data"]> }) {
    const percentage = result.percentage || Math.round((result.score / result.maxScore) * 100);
    const totalQuestions = result.totalCorrect + result.totalWrong + result.totalSkipped;
    const isPassed = result.status === "PASSED" || result.score >= 50;
    const avgMinutesPerQuestion = totalQuestions > 0 ? (result.durationSpentSeconds / totalQuestions / 60).toFixed(1) : "0";

    return (
        <div className="space-y-6">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                <Link href="/page-exam" className="transition-colors hover:text-[#ab1f24]">
                    Khảo thí
                </Link>
                <span>/</span>
                <span className="font-bold text-slate-900">Báo cáo kết quả bài thi</span>
            </div>

            {/* 1. Hero Score Banner Card (Score, Status, Exam Title) */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
                <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                    {/* Left: Title & Status */}
                    <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "rounded-lg px-2.5 py-0.5 text-xs font-semibold",
                                    isPassed ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-rose-300 bg-rose-50 text-rose-700",
                                )}
                            >
                                {isPassed ? "Đạt tiêu chuẩn (Passed)" : "Chưa đạt (Failed)"}
                            </Badge>
                            <Badge className="border border-slate-200 bg-slate-100 text-xs font-medium text-slate-700 shadow-none">
                                Xếp loại: {percentage >= 85 ? "Xuất sắc" : percentage >= 70 ? "Giỏi" : percentage >= 50 ? "Khá" : "Trung bình"}
                            </Badge>
                            <span className="flex items-center gap-1 text-xs font-normal text-slate-500">
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                <span>{result.submittedAt ? "24/08/2026 16:40:00" : "Hôm nay"}</span>
                            </span>
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{result.examTitle}</h1>
                            <p className="mt-1 text-sm font-normal text-slate-600">Báo cáo phân tích chi tiết kết quả bài thi khảo sát năng lực sinh viên.</p>
                        </div>
                    </div>

                    {/* Right: Big Score Box */}
                    <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-red-100 bg-linear-to-br from-red-50/70 via-white to-red-50/30 p-4 shadow-2xs sm:p-5">
                        <div className="text-center sm:text-right">
                            <p className="text-xs font-medium text-slate-500">Tổng điểm đạt được</p>
                            <div className="mt-0.5 flex items-baseline justify-center gap-1 sm:justify-end">
                                <span className="text-3xl font-bold tracking-tight text-[#ab1f24] sm:text-4xl">{result.score}</span>
                                <span className="text-base font-semibold text-slate-400">/{result.maxScore}</span>
                            </div>
                            <p className="mt-0.5 text-xs font-semibold text-emerald-700">Tỷ lệ hoàn thành: {percentage}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Core 4-Metric Summary Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Correct Answers */}
                <Card className="space-y-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-4 shadow-2xs sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600">Câu trả lời đúng</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-2xs">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-emerald-800 sm:text-2xl">
                            {result.totalCorrect} <span className="text-xs font-normal text-slate-500 sm:text-sm">/ {totalQuestions} câu</span>
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-emerald-700">Đạt {percentage}% tổng số câu</p>
                    </div>
                </Card>

                {/* 2. Incorrect / Skipped Answers */}
                <Card className="space-y-2.5 rounded-2xl border border-rose-200/80 bg-rose-50/30 p-4 shadow-2xs sm:p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600">Câu chưa đúng</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-700 shadow-2xs">
                            <XCircle className="h-4 w-4" />
                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-rose-800 sm:text-2xl">
                            {result.totalWrong + result.totalSkipped}{" "}
                            <span className="text-xs font-normal text-slate-500 sm:text-sm">/ {totalQuestions} câu</span>
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-rose-600">Chiếm {100 - percentage}% cần ôn tập</p>
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
                            {Math.floor(result.durationSpentSeconds / 60)}p {result.durationSpentSeconds % 60}s
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-amber-700">Thời lượng tối đa: 50 phút</p>
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
                            ~{avgMinutesPerQuestion} <span className="text-xs font-normal text-slate-500 sm:text-sm">phút/câu</span>
                        </p>
                        <p className="mt-0.5 text-xs font-normal text-slate-500">Nhịp độ làm bài ổn định</p>
                    </div>
                </Card>
            </div>

            {/* 3. Candidate & Exam Session Details Box */}
            <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
                <CardHeader className="border-b border-slate-100 p-0 pb-3.5">
                    <CardTitle className="text-sm font-bold text-slate-900 sm:text-base">Thông tin thí sinh & ca thi</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2 md:grid-cols-3">
                        {/* 1. Candidate Name */}
                        <div className="space-y-1">
                            <span className="text-xs font-normal text-slate-500">Họ và tên thí sinh:</span>
                            <p className="font-bold text-slate-900">{result.candidateName}</p>
                        </div>

                        {/* 2. Candidate Code & SBD */}
                        <div className="space-y-1">
                            <span className="text-xs font-normal text-slate-500">Mã sinh viên / Số báo danh:</span>
                            <p className="font-mono font-bold text-slate-900">
                                {result.candidateCode}{" "}
                                {result.identificationNumber && <span className="font-sans font-medium text-slate-600">({result.identificationNumber})</span>}
                            </p>
                        </div>

                        {/* 3. Candidate Class */}
                        <div className="space-y-1">
                            <span className="text-xs font-normal text-slate-500">Lớp học / Khóa đào tạo:</span>
                            <p className="font-semibold text-slate-900">{result.candidateClass || "Lớp K23-WebDev (Khóa K23)"}</p>
                        </div>

                        {/* 4. Subject */}
                        <div className="space-y-1">
                            <span className="text-xs font-normal text-slate-500">Môn thi / Chuyên đề:</span>
                            <p className="font-semibold text-slate-900">{result.subject || "Kỹ thuật Phát triển Ứng dụng Web & Backend"}</p>
                        </div>

                        {/* 5. Room Name */}
                        <div className="space-y-1">
                            <span className="text-xs font-normal text-slate-500">Tên phòng thi / Địa điểm:</span>
                            <p className="flex items-center gap-1.5 font-semibold text-slate-900">
                                <MapPin className="h-3.5 w-3.5 text-[#ab1f24]" />
                                <span>{result.roomName || "Phòng Khảo thí Lab 402"}</span>
                            </p>
                        </div>

                        {/* 6. Exam Code */}
                        <div className="space-y-1">
                            <span className="text-xs font-normal text-slate-500">Mã ca thi:</span>
                            <p className="font-mono font-bold text-slate-900">{result.examCode || "EX-2026-FE-01"}</p>
                        </div>

                        {/* 7. Proctors (Giám thị) */}
                        <div className="space-y-1 sm:col-span-2">
                            <span className="text-xs font-normal text-slate-500">Danh sách giám thị (Cán bộ coi thi):</span>
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                {(result.proctors || ["ThS. Nguyễn Văn Anh (CBCT 1)", "ThS. Lê Thị Bích (CBCT 2)"]).map((proctor, idx) => (
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
                            <p className="text-xs font-semibold text-slate-900 sm:text-sm">{result.examTimeRange || "16:00:00 - 16:50:00 (24/08/2026)"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 4. Navigation Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                <Link href="/page-exam">
                    <Button
                        variant="outline"
                        className="h-10 gap-2 rounded-xl border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
                    >
                        <FileText className="h-4 w-4" />
                        <span>Quay lại danh sách ca thi</span>
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
    );
}
