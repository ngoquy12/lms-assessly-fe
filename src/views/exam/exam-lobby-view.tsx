"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    KeyRound,
    LayoutGrid,
    List,
    Loader2,
    Radio,
    Search,
    ShieldCheck,
    Users,
    X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WAITING_ROOM } from "@/constants/app.constants";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { useExamList } from "@/hooks/queries/use-exam";
import type { ExamSessionItem } from "@/types/exam.types";

const ITEMS_PER_PAGE = 20;

export function ExamLobbyView() {
    const router = useRouter();

    const { data: examListData } = useExamList();
    const examList = useMemo(() => examListData ?? [], [examListData]);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "UPCOMING" | "COMPLETED">("ALL");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state for room code entry
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [selectedExamForEntry, setSelectedExamForEntry] = useState<ExamSessionItem | null>(null);
    const [roomCodeInput, setRoomCodeInput] = useState("");
    const [roomCodeError, setRoomCodeError] = useState("");

    // Phòng chờ realtime (giả lập): đếm ngược + số thí sinh sẵn sàng tăng dần rồi tự vào phòng thi.
    const [isWaiting, setIsWaiting] = useState(false);
    const [waitSeconds, setWaitSeconds] = useState<number>(WAITING_ROOM.TOTAL_SECONDS);
    const [readyCount, setReadyCount] = useState<number>(WAITING_ROOM.INITIAL_READY);

    useEffect(() => {
        if (!isWaiting) return;
        const timer = setInterval(() => {
            setReadyCount((prev) => Math.min(prev + 1, WAITING_ROOM.TOTAL_PARTICIPANTS));
            setWaitSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    const targetExamId = selectedExamForEntry ? selectedExamForEntry.examId : (examList[0]?.examId ?? "");
                    router.push(`/exam/${targetExamId}`);
                    return 0;
                }
                return prev - 1;
            });
        }, WAITING_ROOM.TICK_MS);
        return () => clearInterval(timer);
    }, [isWaiting, router, selectedExamForEntry, examList]);

    const closeRoomModal = () => {
        setIsRoomModalOpen(false);
        setIsWaiting(false);
        setWaitSeconds(WAITING_ROOM.TOTAL_SECONDS);
        setReadyCount(WAITING_ROOM.INITIAL_READY);
    };

    const waitMinutes = String(Math.floor(waitSeconds / WAITING_ROOM.SECONDS_PER_MINUTE)).padStart(WAITING_ROOM.PAD_LENGTH, "0");
    const waitSecs = String(waitSeconds % WAITING_ROOM.SECONDS_PER_MINUTE).padStart(WAITING_ROOM.PAD_LENGTH, "0");

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (status: "ALL" | "ACTIVE" | "UPCOMING" | "COMPLETED") => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const handleOpenRoomModal = (exam?: ExamSessionItem) => {
        setSelectedExamForEntry(exam || activeExam || examList[0]);
        setRoomCodeInput("");
        setRoomCodeError("");
        setIsWaiting(false);
        setWaitSeconds(WAITING_ROOM.TOTAL_SECONDS);
        setReadyCount(WAITING_ROOM.INITIAL_READY);
        setIsRoomModalOpen(true);
    };

    const handleVerifyAndEnterRoom = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = roomCodeInput.trim();
        if (!trimmed) {
            setRoomCodeError("Vui lòng nhập mã phòng thi do giám thị cung cấp.");
            return;
        }
        // Mã hợp lệ → chuyển sang phòng chờ, giả lập chờ giám thị mở ca thi rồi tự vào phòng.
        setWaitSeconds(WAITING_ROOM.TOTAL_SECONDS);
        setReadyCount(WAITING_ROOM.INITIAL_READY);
        setIsWaiting(true);
    };

    const filteredExams = examList.filter((exam) => {
        const matchesSearch =
            exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || exam.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const activeExam = examList.find((e) => e.status === "ACTIVE");
    const activeCount = examList.filter((e) => e.status === "ACTIVE").length;
    const upcomingCount = examList.filter((e) => e.status === "UPCOMING").length;
    const completedCount = examList.filter((e) => e.status === "COMPLETED").length;

    const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);
    const paginatedExams = filteredExams.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
            <div className="mx-auto max-w-[1440px] space-y-8 px-6 py-8 sm:px-10">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                    <Link href="/" className="transition-colors hover:text-brand-600">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span className="font-bold text-slate-900">Khảo thí</span>
                </div>

                {/* Header Title Section */}
                <div className="space-y-3 py-2 text-center">
                    <h1 className="text-3xl leading-tight font-bold tracking-tight text-brand-700 sm:text-4xl lg:text-[40px]">Luyện thi cùng Rikkei Edu</h1>
                    <p className="mx-auto max-w-3xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
                        Hệ thống luyện thi thông minh với thời gian, điểm số và phân tích chi tiết giúp bạn biết chính xác năng lực của mình
                    </p>
                </div>

                {/* 3. Featured Live Active Exam Banner */}
                {activeExam && (
                    <div className="relative overflow-hidden rounded-3xl border-2 border-brand-500/30 bg-linear-to-r from-brand-50 via-white to-brand-50/40 p-5 shadow-md sm:p-6 md:p-8">
                        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold whitespace-nowrap text-white shadow-xs">
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
                                        <Clock className="h-4 w-4 text-brand-600" />
                                        <span>
                                            Thời lượng: <strong className="font-bold text-slate-900">{activeExam.durationMinutes} phút</strong> (
                                            {activeExam.totalQuestions} câu)
                                        </span>
                                    </span>
                                    <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 whitespace-nowrap shadow-2xs">
                                        <Calendar className="h-4 w-4 text-brand-600" />
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
                                    className="h-12 w-full cursor-pointer rounded-xl bg-brand-600 px-6 text-base font-bold whitespace-nowrap text-white shadow-md transition-all hover:bg-brand-700 hover:shadow-lg active:scale-98 sm:w-auto sm:px-8"
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
                                statusFilter === "ALL" ? "bg-brand-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            Tất cả ({examList.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusFilterChange("ACTIVE")}
                            className={`shrink-0 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                                statusFilter === "ACTIVE" ? "bg-brand-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            Đang mở thi ({activeCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusFilterChange("UPCOMING")}
                            className={`shrink-0 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                                statusFilter === "UPCOMING" ? "bg-brand-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            Sắp diễn ra ({upcomingCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusFilterChange("COMPLETED")}
                            className={`shrink-0 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                                statusFilter === "COMPLETED" ? "bg-brand-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
                            className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-bold whitespace-nowrap text-brand-700 shadow-2xs transition-all hover:bg-brand-100 active:scale-98"
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
                                className="h-10 rounded-xl border-slate-200 pr-9 pl-9 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
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
                                    viewMode === "table" ? "bg-white text-brand-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                                }`}
                                title="Xem dạng bảng"
                            >
                                <List className="h-4 w-4 shrink-0" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`shrink-0 cursor-pointer rounded-lg p-2 transition-all ${
                                    viewMode === "grid" ? "bg-white text-brand-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
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
                                    <tr className="border-b border-brand-100 bg-brand-50/60">
                                        <th className="w-16 px-4 py-4 text-center text-sm font-bold whitespace-nowrap text-brand-700">
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
                                        <th className="px-6 py-4 text-sm font-bold whitespace-nowrap text-brand-700">Bài thi & Ca thi</th>
                                        <th className="px-6 py-4 text-sm font-bold whitespace-nowrap text-brand-700">Thời gian & Phòng</th>
                                        <th className="px-6 py-4 text-sm font-bold whitespace-nowrap text-brand-700">Trạng thái</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold whitespace-nowrap text-brand-700">Hành động</th>
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
                                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold whitespace-nowrap text-brand-700">
                                                        <span className="h-2 w-2 animate-ping rounded-full bg-brand-600" />
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
                                                        className="shrink-0 rounded-xl bg-brand-600 px-4 py-2 font-bold whitespace-nowrap text-white shadow-xs hover:bg-brand-700"
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
                                                    <Link href={`/exam/${exam.resultId || "1"}/result`}>
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
                                                    ? "shrink-0 border-brand-300 bg-brand-50 font-bold whitespace-nowrap text-brand-700"
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
                                            className="w-full shrink-0 rounded-xl bg-brand-600 py-3 font-bold whitespace-nowrap text-white shadow-xs hover:bg-brand-700"
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
                                        <Link href={`/exam/${exam.resultId || "1"}/result`} className="block w-full">
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

                {/* 6. Centered Pagination Bar (Displayed when items > 20) */}
                {filteredExams.length > ITEMS_PER_PAGE && (
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
                                        ? "border border-brand-600 bg-brand-600 text-white shadow-xs"
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

                {/* 7. Dialog Nhập Mã Phòng Thi → Phòng chờ realtime (đếm ngược + tự vào phòng) */}
                <Dialog open={isRoomModalOpen} onOpenChange={(open) => (open ? setIsRoomModalOpen(true) : closeRoomModal())}>
                    <DialogContent size="md" className="max-w-[420px] gap-5 rounded-2xl border-0 bg-white px-6 py-6 shadow-2xl">
                        {isWaiting ? (
                            <>
                                <DialogHeader className="space-y-2 pb-0 text-center sm:text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                                        <Radio className="h-6 w-6 animate-pulse" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl font-bold text-slate-900">{UI_TEXT.waitingRoom.title}</DialogTitle>
                                        <DialogDescription className="mt-1 text-xs text-slate-500">{UI_TEXT.waitingRoom.subtitle}</DialogDescription>
                                    </div>
                                </DialogHeader>

                                <div className="space-y-4">
                                    {/* Đồng hồ đếm ngược */}
                                    <div className="rounded-2xl border border-brand-100 bg-brand-50/50 py-5 text-center">
                                        <p className="text-[11px] font-semibold tracking-wide text-brand-700/80 uppercase">
                                            {UI_TEXT.waitingRoom.countdownLabel}
                                        </p>
                                        <p className="mt-1 font-mono text-4xl font-bold text-brand-600 tabular-nums">
                                            {waitMinutes}:{waitSecs}
                                        </p>
                                    </div>

                                    {/* Số thí sinh đã sẵn sàng */}
                                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
                                        <Users className="h-4 w-4 text-slate-500" />
                                        <span>
                                            {readyCount}/{WAITING_ROOM.TOTAL_PARTICIPANTS} {UI_TEXT.waitingRoom.readySuffix}
                                        </span>
                                    </div>

                                    {/* Trạng thái */}
                                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        <span>{waitSeconds <= 1 ? UI_TEXT.waitingRoom.entering : UI_TEXT.waitingRoom.waitingProctor}</span>
                                    </div>

                                    <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-emerald-600">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>{UI_TEXT.waitingRoom.connected}</span>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeRoomModal}
                                        className="h-11 w-full rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
                                    >
                                        {UI_TEXT.waitingRoom.cancel}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <DialogHeader className="space-y-2 pb-0 text-center sm:text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                                        <KeyRound className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl font-bold text-slate-900">Nhập mã phòng thi</DialogTitle>
                                        <DialogDescription className="mt-1 line-clamp-1 text-xs text-slate-500">
                                            {selectedExamForEntry ? selectedExamForEntry.title : "Khảo thí trực tuyến RikkeiEdu"}
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
                                                className="h-13 rounded-xl border-slate-200 bg-slate-50/70 text-center font-mono text-lg font-bold tracking-widest text-slate-900 uppercase transition-all placeholder:font-sans placeholder:text-xs placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
                                            />
                                        </div>
                                        {roomCodeError && <p className="text-center text-xs font-semibold text-red-600">{roomCodeError}</p>}
                                    </div>

                                    <DialogFooter className="flex-row items-center justify-center gap-2 pt-2 sm:justify-center">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={closeRoomModal}
                                            className="h-11 flex-1 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="h-11 flex-1 rounded-xl bg-brand-600 text-xs font-bold text-white shadow-xs hover:bg-brand-700 sm:text-sm"
                                        >
                                            <span>Vào thi</span>
                                            <ArrowRight className="ml-1.5 h-4 w-4" />
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
