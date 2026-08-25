"use client";

import { ArrowRight, Award, Calendar, CheckCircle2, FileText, MapPin, MessageSquare, Mic, Sparkles, UserCheck, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInterviewResult } from "@/hooks/queries/use-interview";

export function InterviewResultView({ sessionId: _sessionId }: { sessionId: string }) {
    const { data: result } = useInterviewResult();

    const maxScore = 100;
    const overallScore = result.overallScore;
    const fluencyScore = result.fluencyScore;
    const grammarScore = result.grammarScore;
    const vocabularyScore = result.vocabularyScore;
    const responseLogicScore = result.responseLogicScore;
    const strengths = result.strengths;
    const aiSuggestions = result.aiSuggestions;
    const transcript = result.transcript;

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-slate-900">
            {/* Main Result Content */}
            <main className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10">
                <div className="space-y-6">
                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                        <Link href="/interview" className="transition-colors hover:text-[#ab1f24]">
                            Phỏng vấn AI
                        </Link>
                        <span>/</span>
                        <span className="font-bold text-slate-900">Báo cáo kết quả phỏng vấn AI</span>
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
                                        Xếp loại: Xuất sắc (Senior Level)
                                    </Badge>
                                    <span className="flex items-center gap-1 text-xs font-normal text-slate-500">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        <span>24/08/2026 15:30:00</span>
                                    </span>
                                </div>

                                <div>
                                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                        Frontend React & Next.js Senior Developer — Phỏng vấn AI Kỹ thuật
                                    </h1>
                                    <p className="mt-1 text-sm font-normal text-slate-600">
                                        Báo cáo phân tích chuyên sâu về năng lực kỹ thuật, phản xạ thoại và kỹ năng trình bày từ AI Interviewer.
                                    </p>
                                </div>
                            </div>

                            {/* Right: Big Score Box */}
                            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-red-100 bg-linear-to-br from-red-50/70 via-white to-red-50/30 p-4 shadow-2xs sm:p-5">
                                <div className="text-center sm:text-right">
                                    <p className="text-xs font-medium text-slate-500">Điểm đánh giá tổng quan</p>
                                    <div className="mt-0.5 flex items-baseline justify-center gap-1 sm:justify-end">
                                        <span className="text-3xl font-bold tracking-tight text-[#ab1f24] sm:text-4xl">{overallScore}</span>
                                        <span className="text-base font-semibold text-slate-400">/{maxScore}</span>
                                    </div>
                                    <p className="mt-0.5 text-xs font-semibold text-emerald-700">Tỷ lệ hoàn thành: {overallScore}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Core 4-Metric Summary Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Fluency */}
                        <Card className="space-y-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-4 shadow-2xs sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">Độ trôi chảy (Fluency)</span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-2xs">
                                    <Mic className="h-4 w-4" />
                                </div>
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-emerald-800 sm:text-2xl">
                                    {fluencyScore} <span className="text-xs font-normal text-slate-500 sm:text-sm">/ 100 pts</span>
                                </p>
                                <p className="mt-0.5 text-xs font-medium text-emerald-700">Trình bày mạch lạc, tự tin</p>
                            </div>
                        </Card>

                        {/* 2. Grammar */}
                        <Card className="space-y-2.5 rounded-2xl border border-indigo-200/80 bg-indigo-50/30 p-4 shadow-2xs sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">Độ chuẩn ngữ pháp</span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 shadow-2xs">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-indigo-800 sm:text-2xl">
                                    {grammarScore} <span className="text-xs font-normal text-slate-500 sm:text-sm">/ 100 pts</span>
                                </p>
                                <p className="mt-0.5 text-xs font-medium text-indigo-700">Cấu trúc câu hoàn chỉnh</p>
                            </div>
                        </Card>

                        {/* 3. Vocabulary */}
                        <Card className="space-y-2.5 rounded-2xl border border-amber-200/80 bg-amber-50/30 p-4 shadow-2xs sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">Từ vựng chuyên môn</span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shadow-2xs">
                                    <Award className="h-4 w-4" />
                                </div>
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-amber-800 sm:text-2xl">
                                    {vocabularyScore} <span className="text-xs font-normal text-slate-500 sm:text-sm">/ 100 pts</span>
                                </p>
                                <p className="mt-0.5 text-xs font-medium text-amber-700">Thuật ngữ kỹ thuật chuẩn xác</p>
                            </div>
                        </Card>

                        {/* 4. Response Logic */}
                        <Card className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">Logic & Phản xạ thoại</span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-2xs">
                                    <Zap className="h-4 w-4 text-[#ab1f24]" />
                                </div>
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-slate-900 sm:text-2xl">
                                    {responseLogicScore} <span className="text-xs font-normal text-slate-500 sm:text-sm">/ 100 pts</span>
                                </p>
                                <p className="mt-0.5 text-xs font-normal text-slate-500">Phản hồi đúng trọng tâm câu hỏi</p>
                            </div>
                        </Card>
                    </div>

                    {/* 3. Strengths & AI Suggestions */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Strengths Card */}
                        <Card className="space-y-3 rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-2xs">
                            <CardHeader className="border-b border-slate-100 p-0 pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold text-emerald-800 sm:text-base">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span>Điểm mạnh trong câu trả lời</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2.5 p-0 pt-1 text-xs text-slate-700 sm:text-sm">
                                {strengths.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <span className="mt-0.5 font-bold text-emerald-600">•</span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Suggestions Card */}
                        <Card className="space-y-3 rounded-2xl border border-red-200/80 bg-white p-5 shadow-2xs">
                            <CardHeader className="border-b border-slate-100 p-0 pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#ab1f24] sm:text-base">
                                    <Sparkles className="h-4 w-4 text-[#ab1f24]" />
                                    <span>Gợi ý cải thiện từ AI Interviewer</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2.5 p-0 pt-1 text-xs text-slate-700 sm:text-sm">
                                {aiSuggestions.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <span className="mt-0.5 font-bold text-[#ab1f24]">•</span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* 4. Conversation Transcript */}
                    <Card className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
                        <CardHeader className="border-b border-slate-100 p-0 pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-900 sm:text-base">
                                <MessageSquare className="h-4 w-4 text-[#ab1f24]" />
                                <span>Biên bản hội thoại & Đánh giá từng lượt nói</span>
                            </CardTitle>
                            <CardDescription className="text-2xs text-slate-500">Bản ghi âm và nhận diện giọng nói tự động (Speech-to-Text)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 p-0 pt-1">
                            {transcript.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-3 rounded-xl border p-4 text-xs leading-relaxed sm:text-sm ${
                                        item.speaker === "AI" ? "border-slate-200 bg-slate-50/80 text-slate-900" : "border-red-200 bg-red-50/40 text-slate-900"
                                    }`}
                                >
                                    <div className="shrink-0 font-bold">
                                        {item.speaker === "AI" ? (
                                            <span className="text-slate-700">🤖 AI Interviewer:</span>
                                        ) : (
                                            <span className="text-[#ab1f24]">👤 Thí sinh:</span>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p>{item.message}</p>
                                        <span className="text-2xs font-mono text-slate-400">{item.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* 5. Candidate & Exam Session Details Box (Standardized) */}
                    <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
                        <CardHeader className="border-b border-slate-100 p-0 pb-3.5">
                            <CardTitle className="text-sm font-bold text-slate-900 sm:text-base">Thông tin thí sinh & ca phỏng vấn</CardTitle>
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

                                {/* 4. Position */}
                                <div className="space-y-1">
                                    <span className="text-xs font-normal text-slate-500">Vị trí / Chuyên đề phỏng vấn:</span>
                                    <p className="font-semibold text-slate-900">Frontend React & Next.js Senior Developer</p>
                                </div>

                                {/* 5. Room Name */}
                                <div className="space-y-1">
                                    <span className="text-xs font-normal text-slate-500">Tên phòng / Kênh phỏng vấn:</span>
                                    <p className="flex items-center gap-1.5 font-semibold text-slate-900">
                                        <MapPin className="h-3.5 w-3.5 text-[#ab1f24]" />
                                        <span>Phòng Phỏng vấn AI Voice Lab 01</span>
                                    </p>
                                </div>

                                {/* 6. Session Code */}
                                <div className="space-y-1">
                                    <span className="text-xs font-normal text-slate-500">Mã phiên phỏng vấn:</span>
                                    <p className="font-mono font-bold text-slate-900">INT-2026-FE-01</p>
                                </div>

                                {/* 7. Evaluators */}
                                <div className="space-y-1 sm:col-span-2">
                                    <span className="text-xs font-normal text-slate-500">Hội đồng đánh giá (AI Evaluator):</span>
                                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                        {["AI Senior Evaluator v4.2 (Chấm điểm)", "ThS. Nguyễn Văn Anh (Giám sát)"].map((evaluator, idx) => (
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
                                    <span className="text-xs font-normal text-slate-500">Khung giờ ca phỏng vấn:</span>
                                    <p className="text-xs font-semibold text-slate-900 sm:text-sm">15:00:00 - 15:30:00 (24/08/2026)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 6. Navigation Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                        <Link href="/interview">
                            <Button
                                variant="outline"
                                className="h-10 gap-2 rounded-xl border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
                            >
                                <FileText className="h-4 w-4" />
                                <span>Quay lại danh sách ca phỏng vấn</span>
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
