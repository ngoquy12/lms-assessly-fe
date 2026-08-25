"use client";

import { useState } from "react";
import { ArrowRight, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Clock, KeyRound, LayoutGrid, List, Radio, Search, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToeicList } from "@/hooks/queries/use-toeic";
import type { ToeicSessionItem, ToeicStatus } from "@/types/toeic.types";

const ITEMS_PER_PAGE = 20;

export function ToeicListView() {
    const router = useRouter();
    const { data } = useToeicList();
    const sessions = data ?? [];
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | ToeicStatus>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");

    // Modal state for entering exam passcode
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [selectedExamForModal, setSelectedExamForModal] = useState<ToeicSessionItem | null>(null);
    const [roomCodeInput, setRoomCodeInput] = useState("");
    const [roomCodeError, setRoomCodeError] = useState("");

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (status: "ALL" | ToeicStatus) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const handleOpenRoomModal = (exam?: ToeicSessionItem) => {
        setSelectedExamForModal(exam || null);
        setRoomCodeInput("");
        setRoomCodeError("");
        setIsRoomModalOpen(true);
    };

    const handleVerifyAndEnterRoom = (e: React.FormEvent) => {
        e.preventDefault();
        const code = roomCodeInput.trim().toUpperCase();

        if (!code) {
            setRoomCodeError("Vui lòng nhập mã phòng thi.");
            return;
        }

        const activeItem =
            selectedExamForModal || sessions.find((item) => item.code.toUpperCase() === code) || sessions.find((item) => item.status === "ACTIVE");

        if (code === "TOEIC123" || code === "12345678" || (activeItem && code === activeItem.code.toUpperCase())) {
            const targetExamId = activeItem?.id || "toeic-test-01";
            setIsRoomModalOpen(false);
            router.push(`/toeic/${targetExamId}`);
        } else {
            setRoomCodeError("Mã phòng thi không đúng hoặc ca thi chưa được giám thị kích hoạt.");
        }
    };

    const filteredSessions = sessions.filter((exam) => {
        const matchesSearch =
            exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || exam.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const activeExam = sessions.find((e) => e.status === "ACTIVE");
    const activeCount = sessions.filter((e) => e.status === "ACTIVE").length;
    const upcomingCount = sessions.filter((e) => e.status === "UPCOMING").length;
    const completedCount = sessions.filter((e) => e.status === "COMPLETED").length;

    const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
    const paginatedExams = filteredSessions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-slate-900">
            <div className="mx-auto max-w-[1440px] space-y-8 px-6 py-8 sm:px-10">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                    <Link href="/" className="transition-colors hover:text-[#ab1f24]">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span className="font-bold text-slate-900">Luyện thi TOEIC</span>
                </div>

                {/* Header Title Section */}
                <div className="space-y-3 py-2 text-center">
                    <h1 className="text-3xl leading-tight font-bold tracking-tight text-[#ab1f24] sm:text-4xl lg:text-[40px]">
                        Luyện thi TOEIC cùng Rikkei Edu
                    </h1>
                    <p className="mx-auto max-w-3xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
                        Hệ thống luyện thi TOEIC chuẩn format ETS với ngân hàng đề phong phú, âm thanh Listening chất lượng cao và báo cáo phân tích chi tiết.
                    </p>
                </div>

                {/* 3. Featured Live Active Exam Banner */}
                {activeExam && (
                    <div className="relative overflow-hidden rounded-3xl border-2 border-[#ab1f24]/30 bg-linear-to-r from-red-50 via-white to-red-50/40 p-5 shadow-md sm:p-6 md:p-8">
                        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#ab1f24] px-3 py-1 text-xs font-bold whitespace-nowrap text-white shadow-xs">
                                        <Radio className="h-3.5 w-3.5 animate-pulse" />
                                        <span>Ca thi đang mở — Vào làm bài ngay</span>
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="shrink-0 border-slate-300 bg-white font-mono text-xs font-bold whitespace-nowrap text-slate-700"
                                    >
                                        Mã: {activeExam.code}
                                    </Badge>
                                    <span className="text-xs font-semibold whitespace-nowrap text-slate-500">{activeExam.subject}</span>
                                </div>

                                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">{activeExam.title}</h2>

                                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 sm:gap-4 md:text-sm">
                                    <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 whitespace-nowrap shadow-2xs">
                                        <Clock className="h-4 w-4 text-[#ab1f24]" />
                                        <span>
                                            Thời lượng: <strong className="font-bold text-slate-900">{activeExam.durationMinutes} phút</strong> (
                                            {activeExam.totalQuestions} câu)
                                        </span>
                                    </span>
                                    <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 whitespace-nowrap shadow-2xs">
                                        <Calendar className="h-4 w-4 text-[#ab1f24]" />
                                        <span>
                                            Khung giờ:{" "}
                                            <strong className="text-slate-900">
                                                {activeExam.startTime} → {activeExam.endTime}
                                            </strong>
                                        </span>
                                    </span>
                                    {activeExam.isProctored && (
                                        <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 font-bold whitespace-nowrap text-emerald-700">
                                            <ShieldCheck className="h-4 w-4" />
                                            <span>Giám sát AI & Chống gian lận</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Primary Action Button -> Open Room Passcode Modal */}
                            <div className="flex shrink-0 items-center">
                                <Button
                                    size="lg"
                                    onClick={() => handleOpenRoomModal(activeExam)}
                                    className="h-12 w-full cursor-pointer rounded-xl bg-[#ab1f24] px-6 text-base font-bold whitespace-nowrap text-white shadow-md transition-all hover:bg-[#8b1a1f] hover:shadow-lg active:scale-98 sm:w-auto sm:px-8"
                                >
                                    <KeyRound className="mr-2 h-5 w-5 shrink-0" />
                                    <span>Vào phòng thi</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Controls Bar: Filter Tabs, Search, Quick Room Join & View Mode Switcher */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:p-5 xl:flex-row xl:items-center">
                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0">
                        <button
                            type="button"
                            onClick={() => handleStatusFilterChange("ALL")}
                            className={`shrink-0 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                                statusFilter === "ALL" ? "bg-[#ab1f24] text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            Tất cả ({sessions.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusFilterChange("ACTIVE")}
                            className={`shrink-0 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                                statusFilter === "ACTIVE" ? "bg-[#ab1f24] text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            Đang mở thi ({activeCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusFilterChange("UPCOMING")}
                            className={`shrink-0 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                                statusFilter === "UPCOMING" ? "bg-[#ab1f24] text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            Sắp diễn ra ({upcomingCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusFilterChange("COMPLETED")}
                            className={`shrink-0 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                                statusFilter === "COMPLETED" ? "bg-[#ab1f24] text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            Đã hoàn thành ({completedCount})
                        </button>
                    </div>

                    {/* Search Input, Quick Room Code Button & View Toggle */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={() => handleOpenRoomModal()}
                            className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold whitespace-nowrap text-[#ab1f24] shadow-2xs transition-all hover:bg-red-100 active:scale-98"
                        >
                            <KeyRound className="h-4 w-4 shrink-0" />
                            <span>Nhập mã phòng thi</span>
                        </button>

                        <div className="relative w-full sm:w-64 md:w-72">
                            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Tìm theo môn thi hoặc mã ca..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="h-10 rounded-xl border-slate-200 pr-9 pl-9 text-sm focus:border-[#ab1f24] focus:ring-1 focus:ring-[#ab1f24]"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => handleSearchChange("")}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* View Switcher */}
                        <div className="flex shrink-0 items-center justify-end rounded-xl border border-slate-200 bg-slate-100 p-1">
                            <button
                                type="button"
                                onClick={() => setViewMode("table")}
                                className={`shrink-0 cursor-pointer rounded-lg p-2 transition-all ${
                                    viewMode === "table" ? "bg-white text-[#ab1f24] shadow-xs" : "text-slate-500 hover:text-slate-900"
                                }`}
                                title="Xem dạng bảng"
                            >
                                <List className="h-4 w-4 shrink-0" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`shrink-0 cursor-pointer rounded-lg p-2 transition-all ${
                                    viewMode === "grid" ? "bg-white text-[#ab1f24] shadow-xs" : "text-slate-500 hover:text-slate-900"
                                }`}
                                title="Xem dạng thẻ"
                            >
                                <LayoutGrid className="h-4 w-4 shrink-0" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 5. Main Content: Table View vs Grid View */}
                {viewMode === "table" ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-red-100 bg-[#fff8f8]">
                                        <th className="w-16 px-4 py-4 text-center text-sm font-bold whitespace-nowrap text-[#ab1f24]">
                                            <TooltipProvider delayDuration={200}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="cursor-help underline decoration-dotted underline-offset-4">STT</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        <p>Số thứ tự</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </th>
                                        <th className="px-6 py-4 text-sm font-bold whitespace-nowrap text-[#ab1f24]">Bài thi & Ca thi</th>
                                        <th className="px-6 py-4 text-sm font-bold whitespace-nowrap text-[#ab1f24]">Thời gian & Phòng</th>
                                        <th className="px-6 py-4 text-sm font-bold whitespace-nowrap text-[#ab1f24]">Trạng thái</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold whitespace-nowrap text-[#ab1f24]">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedExams.map((exam, index) => (
                                        <tr key={exam.id} className="transition-colors hover:bg-slate-50/80">
                                            {/* STT */}
                                            <td className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap text-slate-500">
                                                {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                            </td>

                                            {/* Exam Title & Subject */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base font-bold text-slate-900">{exam.title}</span>
                                                        {exam.isProctored && (
                                                            <span title="Có giám sát AI" className="shrink-0 text-emerald-600">
                                                                <ShieldCheck className="inline h-4 w-4" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                                                        <span className="whitespace-nowrap">
                                                            Mã: <strong className="font-mono text-slate-700">{exam.code}</strong>
                                                        </span>
                                                        <span>•</span>
                                                        <span className="whitespace-nowrap">{exam.subject}</span>
                                                        <span>•</span>
                                                        <span className="whitespace-nowrap">
                                                            {exam.durationMinutes} phút ({exam.totalQuestions} câu)
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Time & Room */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-0.5 text-xs text-slate-600">
                                                    <p className="font-semibold whitespace-nowrap text-slate-800">{exam.startTime}</p>
                                                    <p className="whitespace-nowrap text-slate-500">{exam.room}</p>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {exam.status === "ACTIVE" && (
                                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold whitespace-nowrap text-[#ab1f24]">
                                                        <span className="h-2 w-2 animate-ping rounded-full bg-red-600" />
                                                        <span>Đang mở thi</span>
                                                    </span>
                                                )}
                                                {exam.status === "UPCOMING" && (
                                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold whitespace-nowrap text-amber-800">
                                                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                                                        <span>Sắp diễn ra</span>
                                                    </span>
                                                )}
                                                {exam.status === "COMPLETED" && (
                                                    <div className="space-y-0.5 whitespace-nowrap">
                                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold whitespace-nowrap text-emerald-700">
                                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                                            <span>Đã hoàn thành</span>
                                                        </span>
                                                        {exam.score !== undefined && (
                                                            <p className="pl-1 text-xs font-bold whitespace-nowrap text-emerald-700">
                                                                Điểm: {exam.score}/{exam.maxScore}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                {exam.status === "ACTIVE" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleOpenRoomModal(exam)}
                                                        className="shrink-0 rounded-xl bg-[#ab1f24] px-4 py-2 font-bold whitespace-nowrap text-white shadow-xs hover:bg-[#8b1a1f]"
                                                    >
                                                        <KeyRound className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                                                        <span>Vào phòng thi</span>
                                                    </Button>
                                                )}
                                                {exam.status === "UPCOMING" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled
                                                        className="shrink-0 cursor-not-allowed rounded-xl border-slate-200 font-medium whitespace-nowrap text-slate-400 opacity-60"
                                                    >
                                                        <span>Chưa mở phòng</span>
                                                    </Button>
                                                )}
                                                {exam.status === "COMPLETED" && (
                                                    <Link href={`/toeic/${exam.resultId || "toeic-test-02"}/result`}>
                                                        <Button
                                                            size="sm"
                                                            className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 font-bold whitespace-nowrap text-emerald-700 shadow-2xs hover:bg-emerald-100"
                                                        >
                                                            <span>Xem kết quả</span>
                                                        </Button>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {paginatedExams.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-sm font-medium whitespace-nowrap text-slate-500">
                                                Không tìm thấy ca thi nào phù hợp với bộ lọc hiện tại.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Grid Cards View */
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {paginatedExams.map((exam) => (
                            <div
                                key={exam.id}
                                className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:-translate-y-1 hover:shadow-md sm:p-6"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant="outline"
                                            className={
                                                exam.status === "ACTIVE"
                                                    ? "shrink-0 border-red-300 bg-red-50 font-bold whitespace-nowrap text-[#ab1f24]"
                                                    : exam.status === "UPCOMING"
                                                      ? "shrink-0 border-amber-300 bg-amber-50 font-bold whitespace-nowrap text-amber-800"
                                                      : "shrink-0 border-emerald-300 bg-emerald-50 font-bold whitespace-nowrap text-emerald-700"
                                            }
                                        >
                                            {exam.status === "ACTIVE" ? "Đang mở phòng" : exam.status === "UPCOMING" ? "Sắp diễn ra" : "Đã hoàn thành"}
                                        </Badge>
                                        <span className="font-mono text-xs font-bold whitespace-nowrap text-slate-400">{exam.code}</span>
                                    </div>

                                    <h3 className="line-clamp-2 text-lg leading-snug font-bold text-slate-900">{exam.title}</h3>
                                    <p className="text-xs font-semibold whitespace-nowrap text-slate-500">{exam.subject}</p>

                                    <div className="space-y-2 border-t border-slate-100 pt-3 text-xs font-medium text-slate-600">
                                        <div className="flex items-center justify-between">
                                            <span className="whitespace-nowrap">Thời lượng:</span>
                                            <strong className="font-bold whitespace-nowrap text-slate-900">
                                                {exam.durationMinutes} phút ({exam.totalQuestions} câu)
                                            </strong>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="whitespace-nowrap">Bắt đầu:</span>
                                            <span className="whitespace-nowrap">{exam.startTime}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="whitespace-nowrap">Phòng thi:</span>
                                            <span className="font-medium whitespace-nowrap text-slate-700">{exam.room}</span>
                                        </div>
                                        {exam.score !== undefined && (
                                            <div className="flex items-center justify-between border-t border-slate-100 pt-2 font-bold">
                                                <span className="whitespace-nowrap text-slate-700">Điểm đạt được:</span>
                                                <span className="text-base font-bold whitespace-nowrap text-emerald-700">
                                                    {exam.score}/{exam.maxScore}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    {exam.status === "ACTIVE" && (
                                        <Button
                                            onClick={() => handleOpenRoomModal(exam)}
                                            className="w-full shrink-0 rounded-xl bg-[#ab1f24] py-3 font-bold whitespace-nowrap text-white shadow-xs hover:bg-[#8b1a1f]"
                                        >
                                            <KeyRound className="mr-2 h-4 w-4 shrink-0" />
                                            <span>Vào phòng thi</span>
                                        </Button>
                                    )}
                                    {exam.status === "UPCOMING" && (
                                        <Button
                                            variant="outline"
                                            disabled
                                            className="w-full shrink-0 cursor-not-allowed rounded-xl border-slate-200 font-medium whitespace-nowrap text-slate-400 opacity-60"
                                        >
                                            <span>Chưa mở phòng thi</span>
                                        </Button>
                                    )}
                                    {exam.status === "COMPLETED" && (
                                        <Link href={`/toeic/${exam.resultId || "toeic-test-02"}/result`} className="block w-full">
                                            <Button className="w-full shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 font-bold whitespace-nowrap text-emerald-700 shadow-2xs hover:bg-emerald-100">
                                                <span>Xem kết quả bài làm</span>
                                                <ArrowRight className="ml-1 h-4 w-4 shrink-0" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 6. Centered Pagination Bar */}
                {filteredSessions.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-center gap-1.5 pt-4 sm:gap-2">
                        {/* Prev Button */}
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Trang trước"
                        >
                            <ChevronLeft className="h-4 w-4 shrink-0" />
                        </button>

                        {/* Page Number Buttons */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                type="button"
                                onClick={() => setCurrentPage(pageNum)}
                                className={`flex h-10 min-w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl px-3.5 text-sm font-bold whitespace-nowrap transition-all ${
                                    currentPage === pageNum
                                        ? "border border-[#ab1f24] bg-[#ab1f24] text-white shadow-xs"
                                        : "border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50"
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Trang tiếp"
                        >
                            <ChevronRight className="h-4 w-4 shrink-0" />
                        </button>
                    </div>
                )}

                {/* 7. Dialog Nhập Mã Phòng Thi TOEIC (Đồng bộ chuẩn Image 1) */}
                <Dialog open={isRoomModalOpen} onOpenChange={setIsRoomModalOpen}>
                    <DialogContent size="md" className="max-w-[420px] gap-5 rounded-2xl border-0 bg-white px-6 py-6 shadow-2xl">
                        <DialogHeader className="space-y-2 pb-0 text-center sm:text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#ab1f24]">
                                <KeyRound className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-slate-900">Nhập mã phòng thi</DialogTitle>
                                <DialogDescription className="mt-1 line-clamp-1 text-xs text-slate-500">
                                    {selectedExamForModal ? selectedExamForModal.title : "Khảo thí tiếng Anh TOEIC chuẩn quốc tế"}
                                </DialogDescription>
                            </div>
                        </DialogHeader>

                        <form onSubmit={handleVerifyAndEnterRoom} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Nhập mã do giám thị cấp..."
                                        value={roomCodeInput}
                                        onChange={(e) => {
                                            setRoomCodeInput(e.target.value);
                                            if (roomCodeError) setRoomCodeError("");
                                        }}
                                        autoFocus
                                        className="h-13 rounded-xl border-slate-200 bg-slate-50/70 text-center font-mono text-lg font-bold tracking-widest text-slate-900 uppercase transition-all placeholder:font-sans placeholder:text-xs placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#ab1f24] focus:bg-white focus:ring-1 focus:ring-[#ab1f24]"
                                    />
                                </div>
                                {roomCodeError && <p className="text-center text-xs font-semibold text-red-600">{roomCodeError}</p>}
                            </div>

                            <DialogFooter className="flex-row items-center justify-center gap-2 pt-2 sm:justify-center">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsRoomModalOpen(false)}
                                    className="h-11 flex-1 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    className="h-11 flex-1 rounded-xl bg-[#ab1f24] text-xs font-bold text-white shadow-xs hover:bg-[#8b1a1f] sm:text-sm"
                                >
                                    <span>Vào thi</span>
                                    <ArrowRight className="ml-1.5 h-4 w-4" />
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
