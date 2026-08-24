"use client";

import { ArrowLeft, Calendar, CheckCircle2, Clock, FileText, RotateCcw, Sparkles, Target, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CRITERIA_DATA = [
    {
        name: "Kiến thức Cốt lõi Python & JavaScript",
        score: "2/2 câu (100%)",
        percentage: 100,
    },
    {
        name: "Kiến trúc Next.js 16 & React 19",
        score: "2/2 câu (100%)",
        percentage: 100,
    },
    {
        name: "CSS & Styling Tailwind V4",
        score: "1/1 câu (100%)",
        percentage: 100,
    },
    {
        name: "Kỹ năng Lập trình & Tự luận",
        score: "2/3 câu (67%)",
        percentage: 67,
    },
];

export function PracticeResultPublicView({ practiceId }: { practiceId: string }) {
    return (
        <div className="min-h-screen w-full bg-[#f8fafc] px-4 py-10 font-sans text-slate-900 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1200px] space-y-8">
                {/* 1. Header */}
                <div className="space-y-1 text-center">
                    <h1 className="text-[28px] font-bold tracking-tight text-slate-900 sm:text-[32px]">Tóm tắt kết quả</h1>
                    <p className="text-[14px] text-slate-500 sm:text-[15px]">Thông tin chi tiết về phiên thi và các chỉ số đạt được</p>
                </div>

                {/* 2. 6 Summary Cards (2 Rows x 3 Columns) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1: Tên bài thi */}
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-100 bg-[#fff6f7] text-[#ab1f24]">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-xs font-semibold text-slate-500">Tên bài thi</span>
                            <span className="mt-0.5 block truncate text-[15px] font-bold text-slate-900">Khảo sát Năng lực Lập trình & Kỹ...</span>
                        </div>
                    </div>

                    {/* Card 2: Tên thí sinh */}
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-100 bg-[#fff6f7] text-[#ab1f24]">
                            <User className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-xs font-semibold text-slate-500">Tên thí sinh</span>
                            <span className="mt-0.5 block truncate text-[15px] font-bold text-slate-900">Bảo Hoàng 01 (BH-2026-0889)</span>
                        </div>
                    </div>

                    {/* Card 3: Giờ - Ngày thi */}
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-100 bg-[#fff6f7] text-[#ab1f24]">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-xs font-semibold text-slate-500">Giờ - Ngày thi</span>
                            <span className="mt-0.5 block text-[15px] font-bold text-slate-900">16:40 - 24/08/2026</span>
                        </div>
                    </div>

                    {/* Card 4: Thời gian làm bài */}
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-100 bg-[#fff6f7] text-[#ab1f24]">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-xs font-semibold text-slate-500">Thời gian làm bài</span>
                            <span className="mt-0.5 block text-[15px] font-bold text-slate-900">30 phút 45 giây</span>
                        </div>
                    </div>

                    {/* Card 5: Số câu trả lời đúng */}
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-100 bg-[#fff6f7] text-[#ab1f24]">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-xs font-semibold text-slate-500">Số câu trả lời đúng</span>
                            <span className="mt-0.5 block text-[15px] font-bold text-slate-900">7 / 8 câu (85%)</span>
                        </div>
                    </div>

                    {/* Card 6: Xếp loại năng lực */}
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-100 bg-[#fff6f7] text-[#ab1f24]">
                            <Target className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-xs font-semibold text-slate-500">Xếp loại năng lực</span>
                            <span className="mt-0.5 block text-[15px] font-bold text-slate-900">Xuất sắc (Đạt)</span>
                        </div>
                    </div>
                </div>

                {/* 3. Phân tích ma trận năng lực theo tiêu chí */}
                <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
                    {/* Header */}
                    <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-[17px] font-bold text-slate-900">Phân tích ma trận năng lực theo tiêu chí</h2>
                            <p className="mt-0.5 text-xs text-slate-500">Mức độ thành thạo và tỷ lệ trả lời chính xác ở từng phần kiến thức</p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Tỷ lệ đạt: 85%</span>
                        </div>
                    </div>

                    {/* Criteria Bars List */}
                    <div className="space-y-6">
                        {CRITERIA_DATA.map((crit, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="font-semibold text-slate-900">{crit.name}</span>
                                    <span className="font-bold text-slate-700">{crit.score}</span>
                                </div>
                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full bg-[#8c171b] transition-all duration-700" style={{ width: `${crit.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                    <Link href="/practice">
                        <Button variant="outline" className="h-11 gap-2 rounded-xl px-6 font-semibold">
                            <ArrowLeft className="h-4 w-4" />
                            <span>Trở lại thư viện luyện tập</span>
                        </Button>
                    </Link>
                    <Link href={`/practice-public/${practiceId}`}>
                        <Button className="h-11 gap-2 rounded-xl bg-[#ab1f24] px-6 font-bold text-white shadow-xs hover:bg-[#90171b]">
                            <RotateCcw className="h-4 w-4" />
                            <span>Luyện lại bài này</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
