"use client";

import { ArrowRight, Award, Brain, Calendar, CheckCircle2, FileText, Loader2, MapPin, TrendingUp, UserCheck, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { HeaderNav } from "@/components/layout/header-nav";
import { HeaderUserActions } from "@/components/layout/header-user-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompetencyResult } from "@/hooks/queries/use-competency";

const AssessmentRadarChart = dynamic(() => import("@/components/charts/assessment-radar-chart").then((m) => m.AssessmentRadarChart), {
    ssr: false,
    loading: () => (
        <div className="flex h-full min-h-[320px] w-full items-center justify-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-[#ab1f24]" />
        </div>
    ),
});

export function CompetencyResultView({ testId: _testId }: { testId: string }) {
    const { data: resultData } = useCompetencyResult();
    const radarData = resultData?.radar ?? { labels: [], scores: [] };
    const overallScore = resultData?.overallScore ?? 0;
    const maxScore = 100;

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
            <main className="mx-auto max-w-[1440px] space-y-6 px-6 py-8 sm:px-10">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                    <Link href="/competency-assessment" className="transition-colors hover:text-[#ab1f24]">
                        Khởi nguyên
                    </Link>
                    <span>/</span>
                    <span className="font-bold text-slate-900">Báo cáo kết quả đánh giá</span>
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
                                    Đạt chuẩn năng lực (Passed)
                                </Badge>
                                <Badge className="border border-slate-200 bg-slate-100 text-xs font-medium text-slate-700 shadow-none">
                                    Xếp loại: Xuất sắc (Advanced Candidate)
                                </Badge>
                                <span className="flex items-center gap-1 text-xs font-normal text-slate-500">
                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                    <span>24/08/2026 16:45:00</span>
                                </span>
                            </div>

                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                    [Khởi nguyên] Đánh giá Chỉ số Trí tuệ Cảm xúc (EQ) &amp; Tư duy Logic (IQ)
                                </h1>
                                <p className="mt-1 text-sm font-normal text-slate-600">
                                    Báo cáo phân tích đa chiều về 6 trục năng lực cốt lõi theo mô hình đánh giá kỹ sư tiêu chuẩn quốc tế.
                                </p>
                            </div>
                        </div>

                        {/* Right: Big Score Box */}
                        <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-red-100 bg-linear-to-br from-red-50/70 via-white to-red-50/30 p-4 shadow-2xs sm:p-5">
                            <div className="text-center sm:text-right">
                                <p className="text-xs font-medium text-slate-500">Điểm tổng hợp năng lực</p>
                                <div className="mt-0.5 flex items-baseline justify-center gap-1 sm:justify-end">
                                    <span className="text-3xl font-bold tracking-tight text-[#ab1f24] sm:text-4xl">{overallScore}</span>
                                    <span className="text-base font-semibold text-slate-400">/{maxScore}</span>
                                </div>
                                <p className="mt-0.5 text-xs font-semibold text-emerald-700">Tỷ lệ đạt chuẩn: {overallScore}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Core 4-Metric Summary Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* 1. Logic & Algorithm */}
                    <Card className="space-y-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-4 shadow-2xs sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-600">Tư duy Logic &amp; Thuật toán</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-2xs">
                                <Brain className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <p className="font-mono text-xl font-bold text-emerald-800 sm:text-2xl">
                                88 <span className="text-xs font-normal text-slate-500 sm:text-sm">/ 100 pts</span>
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-emerald-700">Nắm bắt quy luật rất tốt</p>
                        </div>
                    </Card>

                    {/* 2. Emotional Intelligence */}
                    <Card className="space-y-2.5 rounded-2xl border border-indigo-200/80 bg-indigo-50/30 p-4 shadow-2xs sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-600">Trí tuệ Cảm xúc (EQ)</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 shadow-2xs">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <p className="font-mono text-xl font-bold text-indigo-800 sm:text-2xl">
                                85 <span className="text-xs font-normal text-slate-500 sm:text-sm">/ 100 pts</span>
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-indigo-700">Ứng xử công sở linh hoạt</p>
                        </div>
                    </Card>

                    {/* 3. Problem Solving */}
                    <Card className="space-y-2.5 rounded-2xl border border-amber-200/80 bg-amber-50/30 p-4 shadow-2xs sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-600">Giải quyết Vấn đề</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shadow-2xs">
                                <Award className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <p className="font-mono text-xl font-bold text-amber-800 sm:text-2xl">
                                92 <span className="text-xs font-normal text-slate-500 sm:text-sm">/ 100 pts</span>
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-amber-700">Phân tích tình huống tối ưu</p>
                        </div>
                    </Card>

                    {/* 4. Self-learning */}
                    <Card className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-600">Khả năng Tự học &amp; Nghiên cứu</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-2xs">
                                <Zap className="h-4 w-4 text-[#ab1f24]" />
                            </div>
                        </div>
                        <div>
                            <p className="font-mono text-xl font-bold text-slate-900 sm:text-2xl">
                                90 <span className="text-xs font-normal text-slate-500 sm:text-sm">/ 100 pts</span>
                            </p>
                            <p className="mt-0.5 text-xs font-normal text-slate-500">Nhanh nhạy với công nghệ</p>
                        </div>
                    </Card>
                </div>

                {/* 3. Radar Chart Card & Strengths */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left: Radar Chart */}
                    <Card className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs lg:col-span-7">
                        <CardHeader className="border-b border-slate-100 p-0 pb-3 text-center sm:text-left">
                            <CardTitle className="text-base font-bold text-slate-900">Đa giác năng lực toàn diện (Radar Chart)</CardTitle>
                            <CardDescription className="text-xs text-slate-500">
                                Đồ thị trực quan hóa mức độ đáp ứng năng lực trên 6 khía cạnh chuyên môn
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center p-0 pt-2">
                            <div className="w-full max-w-md">
                                <AssessmentRadarChart data={radarData} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right: Strengths & Recommendations */}
                    <div className="space-y-5 lg:col-span-5">
                        {/* Strengths Card */}
                        <Card className="space-y-3 rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-2xs">
                            <CardHeader className="border-b border-slate-100 p-0 pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold text-emerald-800 sm:text-base">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span>Điểm mạnh nổi bật</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2.5 p-0 pt-1 text-xs text-slate-700 sm:text-sm">
                                <div className="flex items-start gap-2">
                                    <span className="mt-0.5 font-bold text-emerald-600">•</span>
                                    <span>
                                        <strong>Giải quyết vấn đề (92/100):</strong> Phân tích lỗi và đưa ra giải pháp bottleneck hệ thống rất chính xác.
                                    </span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="mt-0.5 font-bold text-emerald-600">•</span>
                                    <span>
                                        <strong>Khả năng tự học (90/100):</strong> Quy trình nghiên cứu tài liệu và xây dựng PoC bài bản.
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommendations Card */}
                        <Card className="space-y-3 rounded-2xl border border-amber-200/80 bg-white p-5 shadow-2xs">
                            <CardHeader className="border-b border-slate-100 p-0 pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold text-amber-800 sm:text-base">
                                    <TrendingUp className="h-4 w-4 text-amber-600" />
                                    <span>Khuyến nghị phát triển</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2.5 p-0 pt-1 text-xs text-slate-700 sm:text-sm">
                                <div className="flex items-start gap-2">
                                    <span className="mt-0.5 font-bold text-amber-600">•</span>
                                    <span>
                                        <strong>Làm việc nhóm &amp; Giao tiếp (84/100):</strong> Có thể rèn luyện thêm kỹ năng thuyết trình ý tưởng kiến trúc
                                        trước tập thể.
                                    </span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="mt-0.5 font-bold text-amber-600">•</span>
                                    <span>
                                        <strong>Trí tuệ cảm xúc (85/100):</strong> Tiếp tục phát huy cách tiếp cận tích cực khi giải quyết xung đột kỹ thuật.
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 4. Candidate & Exam Session Details Box (Standardized) */}
                <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
                    <CardHeader className="border-b border-slate-100 p-0 pb-3.5">
                        <CardTitle className="text-sm font-bold text-slate-900 sm:text-base">Thông tin thí sinh & ca đánh giá</CardTitle>
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

                            {/* 4. Position / Test Name */}
                            <div className="space-y-1">
                                <span className="text-xs font-normal text-slate-500">Bài đánh giá / Chuyên đề:</span>
                                <p className="font-semibold text-slate-900">[Khởi nguyên] Đánh giá Chỉ số EQ &amp; Tư duy Logic (IQ)</p>
                            </div>

                            {/* 5. Room Name */}
                            <div className="space-y-1">
                                <span className="text-xs font-normal text-slate-500">Tên phòng / Kênh khảo sát:</span>
                                <p className="flex items-center gap-1.5 font-semibold text-slate-900">
                                    <MapPin className="h-3.5 w-3.5 text-[#ab1f24]" />
                                    <span>Phòng Khảo sát Năng lực Lab 101</span>
                                </p>
                            </div>

                            {/* 6. Session Code */}
                            <div className="space-y-1">
                                <span className="text-xs font-normal text-slate-500">Mã phiên đánh giá:</span>
                                <p className="font-mono font-bold text-slate-900">KN-2026-EQ-01</p>
                            </div>

                            {/* 7. Evaluators */}
                            <div className="space-y-1 sm:col-span-2">
                                <span className="text-xs font-normal text-slate-500">Hội đồng / Ban Đánh giá Năng lực:</span>
                                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                    {["Ban Khảo thí & Đánh giá Năng lực Rikkei Edu", "ThS. Hoàng Đình Huy (Chủ nhiệm)"].map((evaluator, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                                        >
                                            <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                                            <span>{evaluator}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 8. Session Time Range */}
                            <div className="space-y-1">
                                <span className="text-xs font-normal text-slate-500">Khung giờ ca đánh giá:</span>
                                <p className="text-xs font-semibold text-slate-900 sm:text-sm">14:00:00 - 17:00:00 (20/08/2026)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 5. Navigation Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                    <Link href="/competency-assessment">
                        <Button
                            variant="outline"
                            className="h-10 gap-2 rounded-xl border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
                        >
                            <FileText className="h-4 w-4" />
                            <span>Quay lại danh mục bài đánh giá</span>
                        </Button>
                    </Link>

                    <Link href="/">
                        <Button className="h-10 gap-2 rounded-xl bg-[#ab1f24] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[#8b1a1f] sm:text-sm">
                            <span>Về trang chủ</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
