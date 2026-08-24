"use client";

import { useState } from "react";
import { ArrowRight, Award, BarChart3, Brain, Clock, Search, ShieldAlert, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export interface CompetencySessionItem {
    id: string;
    name: string;
    category: string;
    openSessionDate: string;
    closeSessionDate: string;
    isSubmitted: boolean;
    isExpired: boolean;
    durationMinutes: number;
    totalQuestions: number;
    score?: number;
    maxScore?: number;
}

const MOCK_COMPETENCY_SESSIONS: CompetencySessionItem[] = [
    {
        id: "comp-test-01",
        name: "[Khởi nguyên] Đánh giá Chỉ số Trí tuệ Cảm xúc (EQ) & Ứng xử Công sở",
        category: "Trí tuệ cảm xúc (EQ)",
        openSessionDate: "14:00 20/08/2026",
        closeSessionDate: "17:00 20/08/2026",
        isSubmitted: true,
        isExpired: true,
        durationMinutes: 25,
        totalQuestions: 30,
        score: 88,
        maxScore: 100,
    },
    {
        id: "comp-test-02",
        name: "[Khởi nguyên] Đánh giá Tư duy Logic & Phân tích Dữ liệu Nâng cao (IQ)",
        category: "Tư duy logic (IQ)",
        openSessionDate: "08:00 24/08/2026",
        closeSessionDate: "23:59 28/08/2026",
        isSubmitted: false,
        isExpired: false,
        durationMinutes: 30,
        totalQuestions: 25,
    },
    {
        id: "comp-test-03",
        name: "[Khởi nguyên] Phản xạ Xử lý Tình huống Thực tế (Situational Judgment)",
        category: "Kỹ năng mềm",
        openSessionDate: "00:00 22/08/2026",
        closeSessionDate: "23:59 31/08/2026",
        isSubmitted: false,
        isExpired: false,
        durationMinutes: 20,
        totalQuestions: 20,
    },
];

export function CompetencyListView() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [selectedSessionForConsent, setSelectedSessionForConsent] = useState<CompetencySessionItem | null>(null);

    const filteredSessions = MOCK_COMPETENCY_SESSIONS.filter(
        (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleConfirmEnter = () => {
        if (selectedSessionForConsent) {
            const sid = selectedSessionForConsent.id;
            setSelectedSessionForConsent(null);
            router.push(`/competency-assessment/${sid}`);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] px-4 py-10 font-sans text-slate-900 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1440px] space-y-8">
                {/* 1. Page Title & Subtitle */}
                <div className="space-y-2.5 text-center">
                    <h1 className="text-[32px] font-extrabold tracking-tight text-[#ab1f24] sm:text-[38px]">Đánh Giá Năng Lực Khởi Nguyên</h1>
                    <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-[16px]">
                        Các hoạt động khảo sát, đo lường năng lực tư duy logic, trí tuệ cảm xúc (EQ-IQ) và phản xạ nghề nghiệp.
                    </p>
                </div>

                {/* 2. Search & Statistics Action Bar */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    {/* Search Input */}
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm bài đánh giá Khởi nguyên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 rounded-xl border-slate-300 bg-white pr-4 pl-10 text-sm shadow-2xs focus:border-[#ab1f24] focus:ring-1 focus:ring-[#ab1f24]"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm("")}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Statistics Button */}
                    <Button
                        type="button"
                        onClick={() => setIsStatsOpen(true)}
                        className="h-11 w-full cursor-pointer gap-2 rounded-xl bg-[#ab1f24] px-6 text-sm font-bold text-white shadow-xs hover:bg-[#90171b] active:scale-98 sm:w-auto"
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span>Thống kê</span>
                    </Button>
                </div>

                {/* 3. Data Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            {/* Table Header */}
                            <thead>
                                <tr className="border-b border-red-100 bg-[#fff6f7] text-[#ab1f24]">
                                    <th className="px-6 py-4 text-sm font-bold tracking-tight">Bài đánh giá</th>
                                    <th className="px-6 py-4 text-sm font-bold tracking-tight">Giờ bắt đầu</th>
                                    <th className="px-6 py-4 text-sm font-bold tracking-tight">Giờ kết thúc</th>
                                    <th className="px-6 py-4 text-right text-sm font-bold tracking-tight">Hành động</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-slate-100">
                                {filteredSessions.length > 0 ? (
                                    filteredSessions.map((session) => (
                                        <tr key={session.id} className="transition-colors hover:bg-slate-50/70">
                                            {/* Column 1: Test Name & Category */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <span className="text-[15px] font-semibold text-slate-900">{session.name}</span>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Badge variant="outline" className="bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                                                            {session.category}
                                                        </Badge>
                                                        <span>• {session.durationMinutes} phút</span>
                                                        <span>• {session.totalQuestions} câu</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 2: Start Date */}
                                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{session.openSessionDate}</td>

                                            {/* Column 3: End Date */}
                                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{session.closeSessionDate}</td>

                                            {/* Column 4: Action Button */}
                                            <td className="px-6 py-4 text-right">
                                                {session.isSubmitted ? (
                                                    <Link href={`/competency-assessment/${session.id}/result`}>
                                                        <button
                                                            type="button"
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#fbe8ea] px-5 py-2.5 text-sm font-bold text-[#ab1f24] shadow-2xs transition-all hover:bg-[#f6d2d5] active:scale-98"
                                                        >
                                                            <span>Xem kết quả</span>
                                                            <ArrowRight className="h-4 w-4" />
                                                        </button>
                                                    </Link>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedSessionForConsent(session)}
                                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#ab1f24] px-6 py-2.5 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#90171b] active:scale-98"
                                                    >
                                                        <span>Vào thi</span>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-slate-500">
                                            <p className="text-sm">Không tìm thấy bài đánh giá nào phù hợp từ khóa.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. Guidelines Box */}
                <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                    <div className="flex items-center gap-2 text-base font-bold text-[#ab1f24]">
                        <ShieldAlert className="h-5 w-5" />
                        <span>Quy chế đánh giá năng lực Khởi nguyên</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-xs text-slate-600 md:grid-cols-3">
                        <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <strong className="flex items-center gap-1.5 font-semibold text-slate-900">
                                <Clock className="h-3.5 w-3.5 text-[#ab1f24]" />
                                <span>Thời gian làm bài</span>
                            </strong>
                            <p>Đồng hồ đếm ngược theo thời lượng của từng phần. Tự động lưu đáp án khi gửi bài.</p>
                        </div>
                        <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <strong className="flex items-center gap-1.5 font-semibold text-slate-900">
                                <Brain className="h-3.5 w-3.5 text-indigo-600" />
                                <span>Độ chuẩn xác kết quả</span>
                            </strong>
                            <p>Hãy lựa chọn phương án phản ánh chân thật nhất suy nghĩ và phản xạ của bạn.</p>
                        </div>
                        <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <strong className="flex items-center gap-1.5 font-semibold text-slate-900">
                                <Award className="h-3.5 w-3.5 text-amber-600" />
                                <span>Báo cáo năng lực</span>
                            </strong>
                            <p>Báo cáo radar phân tích đa chiều chỉ số IQ, EQ và kỹ năng ứng xử công sở.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Consent Dialog */}
            <Dialog open={Boolean(selectedSessionForConsent)} onOpenChange={() => setSelectedSessionForConsent(null)}>
                <DialogContent className="max-w-[540px] rounded-3xl border-0 bg-white p-8 shadow-2xl">
                    <DialogHeader className="space-y-3 text-center sm:text-center">
                        <DialogTitle className="text-[26px] font-bold tracking-tight text-[#2d2c2c]">Xác nhận vào bài đánh giá</DialogTitle>
                        <DialogDescription className="text-sm text-slate-600">
                            Bạn chuẩn bị vào: <strong className="text-[#ab1f24]">{selectedSessionForConsent?.name}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 rounded-xl border border-slate-200/70 bg-slate-50 p-4 py-2 text-xs text-slate-600">
                        <p className="flex items-start gap-2">
                            <span className="font-bold text-[#ab1f24]">1.</span>
                            <span>Thời gian làm bài sẽ bắt đầu tính ngay khi bấm nút &quot;Bắt đầu&quot;.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="font-bold text-[#ab1f24]">2.</span>
                            <span>Không chuyển tab hoặc thoát khỏi màn hình kiểm tra.</span>
                        </p>
                    </div>

                    <DialogFooter className="flex gap-3 pt-4 sm:justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSelectedSessionForConsent(null)}
                            className="h-11 w-full rounded-xl sm:w-[180px]"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmEnter}
                            className="h-11 w-full rounded-xl bg-[#ab1f24] font-bold text-white hover:bg-[#90171b] sm:w-[180px]"
                        >
                            Bắt đầu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Statistics Dialog */}
            <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
                <DialogContent className="max-w-[600px] space-y-6 rounded-3xl border-0 bg-white p-8 shadow-2xl">
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                            <BarChart3 className="h-6 w-6 text-[#ab1f24]" />
                            <span>Thống kê Khởi nguyên & EQ/IQ</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Hồ sơ năng lực tư duy logic và trí tuệ cảm xúc tích lũy</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-red-200/60 bg-[#fff6f7] p-4 text-center">
                            <p className="text-xs font-semibold text-slate-500">Điểm cao nhất</p>
                            <p className="mt-1 text-2xl font-extrabold text-[#ab1f24]">88</p>
                            <p className="text-[11px] text-slate-500">Thang 100</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                            <p className="text-xs font-semibold text-slate-500">Đã thực hiện</p>
                            <p className="mt-1 text-2xl font-extrabold text-slate-900">1</p>
                            <p className="text-[11px] text-slate-500">Bài khảo sát</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                            <p className="text-xs font-semibold text-slate-500">Xếp loại</p>
                            <p className="mt-1 text-2xl font-extrabold text-slate-900">Xuất sắc</p>
                            <p className="text-[11px] text-slate-500">Tier A+</p>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            onClick={() => setIsStatsOpen(false)}
                            className="h-11 w-full rounded-xl bg-slate-900 font-bold text-white hover:bg-slate-800"
                        >
                            Đóng cửa sổ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
