"use client";

import { useState } from "react";
import {
    AlertCircle,
    ArrowRight,
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    HelpCircle,
    KeyRound,
    LayoutGrid,
    List,
    Radio,
    Search,
    ShieldCheck,
    Sparkles,
    Video,
    X,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ExamItem {
    id: string;
    code: string;
    title: string;
    category: string;
    startTime: string;
    endTime: string;
    duration: string;
    totalQuestions: number;
    status: "ACTIVE" | "COMPLETED";
    hasInterview?: boolean;
    score?: number;
    totalScore?: number;
    examId?: string;
    interviewId?: string;
    resultId?: string;
}

const MOCK_EXAM_SESSIONS: ExamItem[] = [
    {
        id: "exam-01",
        code: "PV-0906-AI",
        title: "test phỏng vấn 9/6",
        category: "Kỹ năng Phỏng vấn & Lập trình",
        startTime: "16:40 - 09/06/2026",
        endTime: "00:00 - 11/06/2026",
        duration: "45 phút",
        totalQuestions: 30,
        status: "ACTIVE",
        hasInterview: true,
        examId: "exam-01",
        interviewId: "session-01",
    },
    {
        id: "exam-02",
        code: "QTKD-RE-01",
        title: "[RE_GV/TG]Đánh giá năng lực-QTKD-Test",
        category: "Quản trị Kinh doanh",
        startTime: "07:32 - 06/06/2026",
        endTime: "07:45 - 06/06/2026",
        duration: "60 phút",
        totalQuestions: 40,
        status: "COMPLETED",
        score: 9.2,
        totalScore: 10,
        resultId: "exam-02",
    },
    {
        id: "exam-03",
        code: "CNTT-RE-02",
        title: "[RE_GV/TG]Đánh giá năng lực CNTT- Test 2",
        category: "Công nghệ Thông tin",
        startTime: "07:15 - 05/06/2026",
        endTime: "16:00 - 05/06/2026",
        duration: "90 phút",
        totalQuestions: 50,
        status: "COMPLETED",
        score: 8.5,
        totalScore: 10,
        resultId: "exam-03",
    },
    {
        id: "exam-04",
        code: "DS-V2-ADV",
        title: "[DEEKSEEK] - V2",
        category: "Data Science & AI",
        startTime: "09:35 - 04/06/2026",
        endTime: "00:00 - 05/06/2026",
        duration: "60 phút",
        totalQuestions: 35,
        status: "COMPLETED",
        score: 9.8,
        totalScore: 10,
        resultId: "exam-04",
    },
    {
        id: "exam-05",
        code: "RE-DGNL-GEN",
        title: "[RE_GV/TG]Đánh giá năng lực",
        category: "Tổng quan Năng lực",
        startTime: "08:00 - 04/06/2026",
        endTime: "21:00 - 04/06/2026",
        duration: "60 phút",
        totalQuestions: 40,
        status: "COMPLETED",
        score: 8.8,
        totalScore: 10,
        resultId: "exam-05",
    },
];

export function ExamLobbyView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [accessCode, setAccessCode] = useState("");
    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

    const filteredExams = MOCK_EXAM_SESSIONS.filter((exam) => {
        const matchesSearch =
            exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || exam.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const activeExam = MOCK_EXAM_SESSIONS.find((e) => e.status === "ACTIVE");

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] px-4 py-10 font-sans text-slate-900 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1440px] space-y-8">
                {/* 1. Header & Metric Summary Bar */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-linear-to-br from-white via-slate-50/60 to-white p-7 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] sm:p-9">
                    <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-red-500/5 blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 shadow-2xs">
                                <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-emerald-700">Cổng Khảo Thí Trực Tuyến</span>
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                Luyện thi cùng <span className="text-[#ab1f24] drop-shadow-xs">Rikkei Edu</span>
                            </h1>
                            <p className="max-w-2xl text-sm leading-relaxed font-medium text-slate-600 sm:text-base">
                                Hệ thống luyện thi thông minh tích hợp giám sát AI, chấm điểm tự động và phân tích ma trận năng lực chi tiết giúp bạn bứt phá
                                trình độ.
                            </p>
                        </div>

                        {/* Quick Access Code CTA */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Dialog open={isAccessModalOpen} onOpenChange={setIsAccessModalOpen}>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-[#ab1f24] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(188,34,40,0.25)] transition-all hover:bg-[#9c1b20] hover:shadow-[0_6px_20px_rgba(188,34,40,0.35)] active:scale-98"
                                    >
                                        <KeyRound className="h-4 w-4" />
                                        <span>Nhập mã ca thi khẩn cấp</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold text-slate-900">Nhập mã vé / Access Code</DialogTitle>
                                        <DialogDescription className="text-sm text-slate-500">
                                            Nhập mã ca thi do ban khảo thí hoặc giám thị cung cấp để mở quyền thi trực tiếp.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <Input
                                            placeholder="Ví dụ: RIKKEI-EXAM-2026"
                                            value={accessCode}
                                            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                            className="h-12 border-slate-300 text-center font-mono text-lg font-bold focus:border-[#ab1f24]"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsAccessModalOpen(false)}>
                                            Hủy
                                        </Button>
                                        <Button
                                            type="button"
                                            className="bg-[#ab1f24] text-white hover:bg-[#9c1b20]"
                                            disabled={!accessCode.trim()}
                                            onClick={() => setIsAccessModalOpen(false)}
                                        >
                                            Xác thực & Vào thi
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Link href="/ai-interview/check-device/test-01">
                                <button
                                    type="button"
                                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:shadow-xs active:scale-98"
                                >
                                    <Video className="h-4 w-4 text-[#ab1f24]" />
                                    <span>Test thiết bị (Cam/Mic)</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 2. Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
                    <div className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#ab1f24] transition-transform group-hover:scale-105">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">5</div>
                            <div className="text-xs font-semibold text-slate-500">Tổng ca thi</div>
                        </div>
                    </div>

                    <div className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-105">
                            <Radio className="h-6 w-6 animate-pulse" />
                        </div>
                        <div>
                            <div className="text-2xl font-extrabold tracking-tight text-emerald-600 sm:text-3xl">1</div>
                            <div className="text-xs font-semibold text-slate-500">Đang mở phòng</div>
                        </div>
                    </div>

                    <div className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-105">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">4</div>
                            <div className="text-xs font-semibold text-slate-500">Đã hoàn thành</div>
                        </div>
                    </div>

                    <div className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-105">
                            <Award className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                9.0 <span className="text-xs font-semibold text-slate-400">/10</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-500">Điểm trung bình</div>
                        </div>
                    </div>
                </div>

                {/* 3. Featured Live Active Exam Card (High Depth & CTA Glow) */}
                {activeExam && (
                    <div className="relative overflow-hidden rounded-3xl border-2 border-red-500/30 bg-linear-to-r from-red-600/10 via-white to-red-600/5 p-6 shadow-[0_12px_36px_-10px_rgba(188,34,40,0.18)] sm:p-8">
                        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                            <div className="space-y-3.5">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ab1f24] px-3 py-1.5 text-xs font-bold text-white shadow-xs">
                                        <Radio className="h-3 w-3 animate-pulse" />
                                        <span>Ca thi đang diễn ra</span>
                                    </span>
                                    <Badge variant="outline" className="border-slate-300 bg-white font-mono text-xs font-bold text-slate-700">
                                        Mã: {activeExam.code}
                                    </Badge>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                        <Sparkles className="h-3 w-3 text-amber-500" />
                                        <span>Ưu tiên làm bài</span>
                                    </span>
                                </div>

                                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{activeExam.title}</h2>

                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 sm:gap-6 sm:text-sm">
                                    <span className="flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-white/80 px-3 py-1 shadow-2xs">
                                        <Clock className="h-4 w-4 text-[#ab1f24]" />
                                        <span>
                                            Bắt đầu: <strong className="text-slate-900">{activeExam.startTime}</strong>
                                        </span>
                                    </span>
                                    <span className="flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-white/80 px-3 py-1 shadow-2xs">
                                        <Calendar className="h-4 w-4 text-[#ab1f24]" />
                                        <span>
                                            Kết thúc: <strong className="text-slate-900">{activeExam.endTime}</strong>
                                        </span>
                                    </span>
                                    <span className="flex items-center gap-1.5 rounded-lg border border-emerald-200/60 bg-emerald-50 px-3 py-1 font-bold text-emerald-700">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>Có giám sát AI & Ghi hình</span>
                                    </span>
                                </div>
                            </div>

                            {/* Action CTAs */}
                            <div className="flex flex-wrap items-center gap-3">
                                <Link href={`/exam/${activeExam.examId}`}>
                                    <button
                                        type="button"
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#ab1f24] px-6 py-4 text-sm font-bold text-white shadow-[0_6px_20px_rgba(188,34,40,0.3)] transition-all hover:bg-[#9c1b20] hover:shadow-[0_8px_25px_rgba(188,34,40,0.45)] active:scale-98"
                                    >
                                        <span>Vào làm bài thi ngay</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </Link>

                                {activeExam.hasInterview && (
                                    <Link href={`/ai-interview/session/${activeExam.interviewId}`}>
                                        <button
                                            type="button"
                                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#1b2f4b] px-6 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-[#122033] active:scale-98"
                                        >
                                            <Video className="h-4 w-4" />
                                            <span>Phỏng vấn AI</span>
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Controls Bar: Filter Tabs, Search & View Switcher */}
                <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] sm:p-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        {/* Status Filter Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            <button
                                type="button"
                                onClick={() => setStatusFilter("ALL")}
                                className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                                    statusFilter === "ALL"
                                        ? "bg-[#ab1f24] text-white shadow-[0_4px_12px_rgba(188,34,40,0.25)]"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                Tất cả ca thi ({MOCK_EXAM_SESSIONS.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter("ACTIVE")}
                                className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                                    statusFilter === "ACTIVE"
                                        ? "bg-[#ab1f24] text-white shadow-[0_4px_12px_rgba(188,34,40,0.25)]"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                Đang diễn ra (1)
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter("COMPLETED")}
                                className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                                    statusFilter === "COMPLETED"
                                        ? "bg-[#ab1f24] text-white shadow-[0_4px_12px_rgba(188,34,40,0.25)]"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                Đã hoàn thành (4)
                            </button>
                        </div>

                        {/* Search & View Toggle */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Tìm theo tên hoặc mã ca thi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-11 rounded-xl border-slate-200 pr-9 pl-9 text-sm focus:border-[#ab1f24] focus:ring-1 focus:ring-[#ab1f24]"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* View Switcher */}
                            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
                                <button
                                    type="button"
                                    onClick={() => setViewMode("table")}
                                    className={`cursor-pointer rounded-lg p-2 transition-all ${
                                        viewMode === "table" ? "bg-white text-[#ab1f24] shadow-xs" : "text-slate-500 hover:text-slate-900"
                                    }`}
                                    aria-label="Xem dạng bảng"
                                >
                                    <List className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode("grid")}
                                    className={`cursor-pointer rounded-lg p-2 transition-all ${
                                        viewMode === "grid" ? "bg-white text-[#ab1f24] shadow-xs" : "text-slate-500 hover:text-slate-900"
                                    }`}
                                    aria-label="Xem dạng thẻ"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Main Content: Table View or Grid View */}
                {viewMode === "table" ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-[#eababc]/50 bg-[#fff6f7]">
                                        <th className="w-2/5 px-6 py-4 text-[15px] font-bold text-[#ab1f24]">Bài thi</th>
                                        <th className="w-1/5 px-6 py-4 text-[15px] font-bold text-[#ab1f24]">Giờ bắt đầu</th>
                                        <th className="w-1/5 px-6 py-4 text-[15px] font-bold text-[#ab1f24]">Giờ kết thúc</th>
                                        <th className="w-1/5 px-6 py-4 text-right text-[15px] font-bold text-[#ab1f24]">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredExams.map((exam) => (
                                        <tr key={exam.id} className="transition-colors hover:bg-red-50/20">
                                            {/* Bài thi title & Badge */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[17px] font-semibold text-slate-900">{exam.title}</span>
                                                        {exam.status === "ACTIVE" && (
                                                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 shadow-2xs">
                                                                Đang mở
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                        <span>
                                                            Mã: <strong className="font-mono text-slate-700">{exam.code}</strong>
                                                        </span>
                                                        <span>•</span>
                                                        <span>{exam.category}</span>
                                                        {exam.score !== undefined && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="font-bold text-[#ab1f24]">
                                                                    Điểm: {exam.score}/{exam.totalScore}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Giờ bắt đầu */}
                                            <td className="px-6 py-4 text-[15px] font-medium text-slate-700">{exam.startTime}</td>

                                            {/* Giờ kết thúc */}
                                            <td className="px-6 py-4 text-[15px] font-medium text-slate-700">{exam.endTime}</td>

                                            {/* Action Buttons */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2.5">
                                                    {exam.status === "ACTIVE" && (
                                                        <>
                                                            <Link href={`/exam/${exam.examId}`}>
                                                                <button
                                                                    type="button"
                                                                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-400 px-4 py-2.5 text-[14px] font-bold text-white shadow-xs transition-all hover:bg-slate-500 active:scale-98"
                                                                >
                                                                    <span>Vào thi</span>
                                                                    <ArrowRight className="h-4 w-4" />
                                                                </button>
                                                            </Link>

                                                            {exam.hasInterview && (
                                                                <Link href={`/ai-interview/session/${exam.interviewId}`}>
                                                                    <button
                                                                        type="button"
                                                                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-400 px-4 py-2.5 text-[14px] font-bold text-white shadow-xs transition-all hover:bg-slate-500 active:scale-98"
                                                                    >
                                                                        <span>Phỏng vấn</span>
                                                                        <ArrowRight className="h-4 w-4" />
                                                                    </button>
                                                                </Link>
                                                            )}
                                                        </>
                                                    )}

                                                    {exam.status === "COMPLETED" && (
                                                        <Link href={`/exam/${exam.resultId}/result`}>
                                                            <button
                                                                type="button"
                                                                className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#f8e9ea] px-4 py-2.5 text-[14px] font-bold text-[#ab1f24] shadow-2xs transition-all hover:bg-[#f3d4d6] active:scale-98"
                                                            >
                                                                <span>Xem kết quả</span>
                                                                <ArrowRight className="h-4 w-4" />
                                                            </button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredExams.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-14 text-center text-sm text-slate-500">
                                                Không có bài thi nào phù hợp với bộ lọc hiện tại.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Grid Cards View */
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredExams.map((exam) => (
                            <div
                                key={exam.id}
                                className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant="outline"
                                            className={
                                                exam.status === "ACTIVE"
                                                    ? "border-emerald-300 bg-emerald-50 font-bold text-emerald-700"
                                                    : "border-slate-200 bg-slate-50 font-bold text-slate-600"
                                            }
                                        >
                                            {exam.status === "ACTIVE" ? "Đang mở thi" : "Đã hoàn thành"}
                                        </Badge>
                                        <span className="font-mono text-xs font-bold text-slate-400">{exam.code}</span>
                                    </div>

                                    <h3 className="line-clamp-2 text-lg font-bold text-slate-900">{exam.title}</h3>
                                    <p className="text-xs font-medium text-slate-500">{exam.category}</p>

                                    <div className="space-y-2 border-t border-slate-100 pt-3 text-xs font-medium text-slate-600">
                                        <div className="flex items-center justify-between">
                                            <span>Thời lượng:</span>
                                            <strong className="font-bold text-slate-900">
                                                {exam.duration} ({exam.totalQuestions} câu)
                                            </strong>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Bắt đầu:</span>
                                            <span>{exam.startTime}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Kết thúc:</span>
                                            <span>{exam.endTime}</span>
                                        </div>
                                        {exam.score !== undefined && (
                                            <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                                                <span className="font-bold text-emerald-700">Kết quả đạt được:</span>
                                                <strong className="text-base font-extrabold text-[#ab1f24]">
                                                    {exam.score}/{exam.totalScore} điểm
                                                </strong>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    {exam.status === "ACTIVE" ? (
                                        <div className="flex gap-2">
                                            <Link href={`/exam/${exam.examId}`} className="flex-1">
                                                <button
                                                    type="button"
                                                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#ab1f24] py-3 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#9c1b20]"
                                                >
                                                    <span>Vào thi</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </button>
                                            </Link>
                                            {exam.hasInterview && (
                                                <Link href={`/ai-interview/session/${exam.interviewId}`}>
                                                    <button
                                                        type="button"
                                                        className="flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-[#1b2f4b] px-3.5 py-3 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#122033]"
                                                        title="Phỏng vấn AI"
                                                    >
                                                        <Video className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <Link href={`/exam/${exam.resultId}/result`} className="block w-full">
                                            <button
                                                type="button"
                                                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#f8e9ea] py-3 text-sm font-bold text-[#ab1f24] shadow-2xs transition-all hover:bg-[#f3d4d6]"
                                            >
                                                <span>Xem kết quả & Báo cáo</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 6. Important Exam Regulations & Support Notice (Bottom eLearning UX) */}
                <div className="grid grid-cols-1 gap-6 pt-4 lg:grid-cols-3">
                    <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-7 shadow-[0_4px_16px_rgba(0,0,0,0.03)] lg:col-span-2">
                        <div className="flex items-center gap-2 text-[#ab1f24]">
                            <AlertCircle className="h-5 w-5" />
                            <h3 className="text-base font-bold text-slate-900">Quy chế & Lưu ý quan trọng khi tham gia khảo thí</h3>
                        </div>
                        <ul className="space-y-3 text-sm leading-relaxed font-medium text-slate-600">
                            <li className="flex items-start gap-2.5">
                                <span className="mt-0.5 text-base leading-none font-extrabold text-[#ab1f24]">•</span>
                                <span>Thí sinh cần kiểm tra Camera và Micro trước khi bắt đầu bài thi để đảm bảo tính hợp lệ và ghi hình giám sát.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="mt-0.5 text-base leading-none font-extrabold text-[#ab1f24]">•</span>
                                <span>
                                    Hệ thống tự động ghi nhận và đánh dấu vi phạm nếu phát hiện hành vi rời khỏi màn hình thi hoặc chuyển tab sang ứng dụng
                                    khác.
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="mt-0.5 text-base leading-none font-extrabold text-[#ab1f24]">•</span>
                                <span>Kết quả thi và phân tích ma trận năng lực sẽ được cập nhật tự động ngay sau khi hoàn tất nộp bài.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col justify-between space-y-5 rounded-2xl bg-linear-to-br from-[#1b2f4b] to-[#0f172a] p-7 text-white shadow-[0_10px_25px_-5px_rgba(27,47,75,0.3)]">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-amber-400">
                                <HelpCircle className="h-5 w-5" />
                                <h3 className="text-base font-bold text-white">Hỗ trợ thí sinh trực ca</h3>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                                Gặp sự cố kết nối, mất điện hoặc lỗi kỹ thuật trong quá trình làm bài? Hãy liên hệ ngay với hội đồng giám thị để được hỗ trợ tức
                                thì.
                            </p>
                        </div>

                        <div className="space-y-2 border-t border-white/10 pt-4 text-xs sm:text-sm">
                            <div>
                                Hotline hỗ trợ: <strong className="font-bold tracking-wide text-white">0862 069 233</strong>
                            </div>
                            <div>
                                Email: <strong className="font-bold text-white">academy@rikkeisoft.com</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
