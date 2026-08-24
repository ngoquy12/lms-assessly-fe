"use client";

import { useState } from "react";
import { ArrowRight, Award, BarChart3, CheckCircle2, Clock, Search, ShieldAlert, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export interface ToeicSessionItem {
    id: string;
    name: string;
    openSessionDate: string;
    closeSessionDate: string;
    isSubmitted: boolean;
    isExpired: boolean;
    durationMinutes: number;
    totalQuestions: number;
    skill: string;
    score?: number;
    maxScore?: number;
}

const MOCK_TOEIC_SESSIONS: ToeicSessionItem[] = [
    {
        id: "toeic-test-01",
        name: "[TEST] TOEIC (21/08)",
        openSessionDate: "14:00 21/08/2026",
        closeSessionDate: "16:59 21/08/2026",
        isSubmitted: true,
        isExpired: true,
        durationMinutes: 120,
        totalQuestions: 200,
        skill: "Listening & Reading",
        score: 850,
        maxScore: 990,
    },
    {
        id: "toeic-test-02",
        name: "TOEIC Full Test 2026 — Đề Chuẩn ETS Format",
        openSessionDate: "08:00 24/08/2026",
        closeSessionDate: "23:59 28/08/2026",
        isSubmitted: false,
        isExpired: false,
        durationMinutes: 120,
        totalQuestions: 200,
        skill: "Listening & Reading",
    },
    {
        id: "toeic-test-03",
        name: "TOEIC Part 5 & 6 — Ngữ Pháp & Điền Đoạn Văn Nhanh",
        openSessionDate: "00:00 20/08/2026",
        closeSessionDate: "23:59 30/08/2026",
        isSubmitted: false,
        isExpired: false,
        durationMinutes: 45,
        totalQuestions: 52,
        skill: "Reading Practice",
    },
    {
        id: "toeic-test-04",
        name: "IELTS Academic Reading Mini-Test (Passage 1 & 2)",
        openSessionDate: "09:00 15/08/2026",
        closeSessionDate: "18:00 15/08/2026",
        isSubmitted: true,
        isExpired: true,
        durationMinutes: 40,
        totalQuestions: 26,
        skill: "Academic Reading",
        score: 7.5,
        maxScore: 9.0,
    },
];

export function ToeicListView() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [selectedSessionForConsent, setSelectedSessionForConsent] = useState<ToeicSessionItem | null>(null);

    const filteredSessions = MOCK_TOEIC_SESSIONS.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleEnterExam = (session: ToeicSessionItem) => {
        setSelectedSessionForConsent(session);
    };

    const handleConfirmEnter = () => {
        if (selectedSessionForConsent) {
            const sid = selectedSessionForConsent.id;
            setSelectedSessionForConsent(null);
            router.push(`/toeic/${sid}`);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] px-4 py-10 font-sans text-slate-900 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1280px] space-y-8">
                {/* 1. Page Title & Subtitle */}
                <div className="space-y-2.5 text-center">
                    <h1 className="text-[32px] font-extrabold tracking-tight text-[#ab1f24] sm:text-[38px]">Luyện TOEIC cùng Rikkei Edu</h1>
                    <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-[16px]">
                        Trải nghiệm thi thử TOEIC với đề mô phỏng sát thực tế và báo cáo chi tiết năng lực theo từng kỹ năng.
                    </p>
                </div>

                {/* 2. Search & Statistics Action Bar */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    {/* Search Input */}
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm bài thi TOEIC..."
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
                        className="h-11 w-full cursor-pointer gap-2 rounded-xl bg-[#ab1f24] px-6 text-sm font-bold text-white shadow-xs hover:bg-[#9c1b20] active:scale-98 sm:w-auto"
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span>Thống kê</span>
                    </Button>
                </div>

                {/* 3. TOEIC Sessions Data Table (Exact Layout Matching Reference Image) */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            {/* Table Header */}
                            <thead>
                                <tr className="border-b border-red-100 bg-[#fff6f7] text-[#ab1f24]">
                                    <th className="px-6 py-4 text-sm font-bold tracking-tight">Bài thi</th>
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
                                            {/* Column 1: Test Name & Skill Badge */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <span className="text-[15px] font-semibold text-slate-900">{session.name}</span>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Badge variant="outline" className="bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                                                            {session.skill}
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
                                                    <Link href={`/toeic/${session.id}/result`}>
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
                                                        onClick={() => handleEnterExam(session)}
                                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#ab1f24] px-6 py-2.5 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#9c1b20] active:scale-98"
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
                                            <p className="text-sm">Không tìm thấy bài thi TOEIC nào phù hợp từ khóa.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. TOEIC Rules & Guidelines Banner */}
                <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                    <div className="flex items-center gap-2 text-base font-bold text-[#ab1f24]">
                        <ShieldAlert className="h-5 w-5" />
                        <span>Quy chế phòng thi thử TOEIC & IELTS trực tuyến</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-xs text-slate-600 md:grid-cols-3">
                        <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <strong className="flex items-center gap-1.5 font-semibold text-slate-900">
                                <Clock className="h-3.5 w-3.5 text-[#ab1f24]" />
                                <span>Thời gian làm bài</span>
                            </strong>
                            <p>Đồng hồ tính giờ tự động đếm ngược. Hệ thống sẽ tự động nộp bài khi hết giờ.</p>
                        </div>
                        <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <strong className="flex items-center gap-1.5 font-semibold text-slate-900">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Âm thanh Listening</span>
                            </strong>
                            <p>Hãy kiểm tra tai nghe kỹ càng trước khi bắt đầu bài thi để có chất lượng tốt nhất.</p>
                        </div>
                        <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <strong className="flex items-center gap-1.5 font-semibold text-slate-900">
                                <Award className="h-3.5 w-3.5 text-amber-600" />
                                <span>Quy đổi điểm TOEIC 990</span>
                            </strong>
                            <p>Kết quả thi sẽ tự động được chấm và quy đổi theo biểu bảng điểm chuẩn quốc tế ETS.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Consent Dialog Before Entering Exam */}
            <Dialog open={Boolean(selectedSessionForConsent)} onOpenChange={() => setSelectedSessionForConsent(null)}>
                <DialogContent className="max-w-[540px] rounded-3xl border-0 bg-white p-8 shadow-2xl">
                    <DialogHeader className="space-y-3 text-center sm:text-center">
                        <DialogTitle className="text-[26px] font-bold tracking-tight text-[#2d2c2c]">Cam kết quy chế phòng thi</DialogTitle>
                        <DialogDescription className="text-sm text-slate-600">
                            Bạn chuẩn bị vào phòng thi: <strong className="text-[#ab1f24]">{selectedSessionForConsent?.name}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 rounded-xl border border-slate-200/70 bg-slate-50 p-4 py-2 text-xs text-slate-600">
                        <p className="flex items-start gap-2">
                            <span className="font-bold text-[#ab1f24]">1.</span>
                            <span>Thời gian làm bài thi sẽ bắt đầu đếm ngược ngay khi bạn bấm nút &quot;Bắt đầu làm bài&quot;.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="font-bold text-[#ab1f24]">2.</span>
                            <span>Không chuyển tab hoặc mở ứng dụng khác quá số lần quy định.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="font-bold text-[#ab1f24]">3.</span>
                            <span>Hệ thống tự động lưu đáp án và nộp bài khi hết giờ làm bài.</span>
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
                            className="h-11 w-full rounded-xl bg-[#ab1f24] font-bold text-white hover:bg-[#9c1b20] sm:w-[180px]"
                        >
                            Bắt đầu làm bài
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 6. Statistics Dialog */}
            <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
                <DialogContent className="max-w-[620px] space-y-6 rounded-3xl border-0 bg-white p-8 shadow-2xl">
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                            <BarChart3 className="h-6 w-6 text-[#ab1f24]" />
                            <span>Thống kê kết quả thi TOEIC của bạn</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Tổng hợp lịch sử luyện thi và tiến trình cải thiện điểm số</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-red-200/60 bg-[#fff6f7] p-4 text-center">
                            <p className="text-xs font-semibold text-slate-500">Điểm cao nhất</p>
                            <p className="mt-1 text-2xl font-extrabold text-[#ab1f24]">850</p>
                            <p className="text-[11px] text-slate-500">Thang 990</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                            <p className="text-xs font-semibold text-slate-500">Đã hoàn thành</p>
                            <p className="mt-1 text-2xl font-extrabold text-slate-900">2</p>
                            <p className="text-[11px] text-slate-500">Bài thi</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                            <p className="text-xs font-semibold text-slate-500">Điểm trung bình</p>
                            <p className="mt-1 text-2xl font-extrabold text-slate-900">820</p>
                            <p className="text-[11px] text-slate-500">TOEIC ETS</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-slate-900">Chi tiết phân bổ kỹ năng</h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between font-medium">
                                <span>Listening (Nghe hiểu)</span>
                                <span className="font-bold text-[#ab1f24]">450 / 495 điểm (91%)</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full w-[91%] bg-[#ab1f24]" />
                            </div>

                            <div className="flex justify-between pt-2 font-medium">
                                <span>Reading (Đọc hiểu)</span>
                                <span className="font-bold text-indigo-600">400 / 495 điểm (81%)</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full w-[81%] bg-indigo-600" />
                            </div>
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
