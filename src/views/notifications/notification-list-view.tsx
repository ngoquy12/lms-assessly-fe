"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BellOff, Brain, CheckCheck, ChevronLeft, ChevronRight, Clock, FileCheck2, Info, Radio, Search, Sparkles, Trash2, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MOCK_NOTIFICATIONS_LIST, type NotificationType, type SystemNotificationItem } from "@/mocks/notification.mock";

const ITEMS_PER_PAGE = 8;

export function NotificationListView() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<SystemNotificationItem[]>(MOCK_NOTIFICATIONS_LIST);
    const [activeTab, setActiveTab] = useState<NotificationType>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Counts
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const examCount = notifications.filter((n) => n.category === "exam").length;
    const interviewCount = notifications.filter((n) => n.category === "interview").length;
    const compCount = notifications.filter((n) => n.category === "competency").length;
    const toeicCount = notifications.filter((n) => n.category === "toeic").length;
    const systemCount = notifications.filter((n) => n.category === "system").length;

    // Filter logic
    const filteredNotifications = useMemo(() => {
        return notifications.filter((n) => {
            // Tab filter
            if (activeTab === "unread" && n.isRead) return false;
            if (activeTab !== "all" && activeTab !== "unread" && n.category !== activeTab) return false;

            // Search query filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchTitle = n.title.toLowerCase().includes(q);
                const matchDesc = n.description.toLowerCase().includes(q);
                const matchCategory = n.categoryLabel.toLowerCase().includes(q);
                if (!matchTitle && !matchDesc && !matchCategory) return false;
            }

            return true;
        });
    }, [notifications, activeTab, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE));
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredNotifications.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredNotifications, currentPage]);

    // Handlers
    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
    };

    const handleDeleteAllRead = () => {
        const readItems = notifications.filter((n) => n.isRead);
        if (readItems.length === 0) {
            toast.info("Không có thông báo đã đọc để xóa");
            return;
        }
        setNotifications((prev) => prev.filter((n) => !n.isRead));
        toast.success(`Đã xóa ${readItems.length} thông báo đã đọc`);
    };

    const handleToggleRead = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications((prev) =>
            prev.map((n) => {
                if (n.id === id) {
                    const nextState = !n.isRead;
                    toast.info(nextState ? "Đã đánh dấu là đã đọc" : "Đã đánh dấu là chưa đọc");
                    return { ...n, isRead: nextState };
                }
                return n;
            }),
        );
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        toast.success("Đã xóa thông báo");
    };

    const handleItemClick = (item: SystemNotificationItem) => {
        if (!item.isRead) {
            setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)));
        }
        if (item.href && item.href !== "#") {
            router.push(item.href as unknown as Route);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-6 pb-16 text-slate-900">
            <div className="mx-auto max-w-[1200px] space-y-5 px-4 sm:px-6 lg:px-8">
                {/* 1. Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Link href={"/" as unknown as Route} className="transition-colors hover:text-brand-600">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span className="font-bold text-slate-900">Thông báo</span>
                </div>

                {/* 2. Professional Header Toolbar */}
                <div className="flex flex-col justify-between gap-4 pb-1 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Trung tâm thông báo</h1>
                        <p className="text-xs text-slate-500">Quản lý lịch thi, kết quả đánh giá, nhắc nhở và thông tin cập nhật từ hệ thống.</p>
                    </div>

                    {/* Bulk Action Buttons */}
                    <div className="flex shrink-0 items-center gap-2">
                        {unreadCount > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleMarkAllAsRead}
                                className="h-9 cursor-pointer gap-1.5 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:border-brand-500 hover:bg-brand-50/40 hover:text-brand-700"
                            >
                                <CheckCheck className="h-3.5 w-3.5 text-brand-600" />
                                <span>Đã đọc tất cả</span>
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteAllRead}
                            className="h-9 cursor-pointer gap-1.5 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-2xs hover:border-red-200 hover:bg-red-50/40 hover:text-red-600"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Xóa đã đọc</span>
                        </Button>
                    </div>
                </div>

                {/* 3. Filter Tabs & Search Controls */}
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs sm:p-3 lg:flex-row lg:items-center lg:justify-between">
                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1 overflow-x-auto">
                        {[
                            { id: "all", label: "Tất cả", count: notifications.length },
                            { id: "unread", label: "Chưa đọc", count: unreadCount },
                            { id: "exam", label: "Khảo thí", count: examCount },
                            { id: "interview", label: "Phỏng vấn", count: interviewCount },
                            { id: "competency", label: "Khởi nguyên", count: compCount },
                            { id: "toeic", label: "TOEIC", count: toeicCount },
                            { id: "system", label: "Hệ thống", count: systemCount },
                        ].map((tab) => {
                            const isSelected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => {
                                        setActiveTab(tab.id as NotificationType);
                                        setCurrentPage(1);
                                    }}
                                    className={cn(
                                        "flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all select-none",
                                        isSelected ? "bg-brand-600 font-bold text-white shadow-2xs" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                                    )}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={cn(
                                            "py-0.2 rounded-md px-1.5 text-[10px] font-bold",
                                            isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600",
                                        )}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Compact Search Input */}
                    <div className="relative w-full lg:w-[260px]">
                        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm thông báo..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-8.5 rounded-lg border-slate-200 bg-slate-50/50 pr-7 pl-8 text-xs font-normal transition-all placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery("");
                                    setCurrentPage(1);
                                }}
                                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* 4. Unified Professional Notification List */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
                    {paginatedItems.length === 0 ? (
                        <div className="px-4 py-16 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                <BellOff className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">Không có thông báo nào</h3>
                            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                                {searchQuery ? "Không tìm thấy thông báo phù hợp với từ khóa tìm kiếm." : "Hộp thư thông báo của bạn hiện đang trống!"}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {paginatedItems.map((item) => {
                                const isUnread = !item.isRead;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleItemClick(item)}
                                        className={cn(
                                            "group relative flex cursor-pointer items-start gap-3.5 px-4 py-3 transition-colors sm:px-5 sm:py-3.5",
                                            isUnread ? "bg-brand-50/30 hover:bg-brand-50/50" : "bg-white hover:bg-slate-50/70",
                                        )}
                                    >
                                        {/* Unread Left Border Accent */}
                                        {isUnread && <span className="absolute top-0 bottom-0 left-0 w-1 bg-brand-600" />}

                                        {/* Icon */}
                                        <div
                                            className={cn(
                                                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                                                item.category === "exam"
                                                    ? "bg-brand-100 text-brand-700"
                                                    : item.category === "interview"
                                                      ? "bg-emerald-100 text-emerald-700"
                                                      : item.category === "competency"
                                                        ? "bg-indigo-100 text-indigo-700"
                                                        : item.category === "toeic"
                                                          ? "bg-amber-100 text-amber-700"
                                                          : "bg-slate-100 text-slate-700",
                                            )}
                                        >
                                            {item.category === "exam" && <Radio className="h-4 w-4" />}
                                            {item.category === "interview" && <Sparkles className="h-4 w-4" />}
                                            {item.category === "competency" && <Brain className="h-4 w-4" />}
                                            {item.category === "toeic" && <FileCheck2 className="h-4 w-4" />}
                                            {item.category === "system" && <Info className="h-4 w-4" />}
                                        </div>

                                        {/* Main Content */}
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10.5px] font-bold",
                                                        item.category === "exam"
                                                            ? "border border-brand-200/60 bg-brand-50 text-brand-700"
                                                            : item.category === "interview"
                                                              ? "border border-emerald-200/60 bg-emerald-50 text-emerald-700"
                                                              : item.category === "competency"
                                                                ? "border border-indigo-200/60 bg-indigo-50 text-indigo-700"
                                                                : item.category === "toeic"
                                                                  ? "border border-amber-200/60 bg-amber-50 text-amber-700"
                                                                  : "border border-slate-200 bg-slate-100 text-slate-700",
                                                    )}
                                                >
                                                    {item.categoryLabel}
                                                </span>

                                                <h3
                                                    className={cn(
                                                        "text-xs leading-snug font-bold sm:text-[13.5px]",
                                                        isUnread ? "text-slate-900" : "text-slate-700",
                                                    )}
                                                >
                                                    {item.title}
                                                </h3>

                                                {isUnread && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600" />}
                                            </div>

                                            <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{item.description}</p>

                                            <div className="flex items-center gap-2 pt-0.5 text-[11px] font-medium text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{item.createdAt}</span>
                                                </span>
                                                <span>•</span>
                                                <span>{item.timestamp}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex shrink-0 items-center gap-1.5 self-center">
                                            {item.actionLabel && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => handleItemClick(item)}
                                                    className="h-8 cursor-pointer gap-1 rounded-lg bg-brand-600 px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-brand-700"
                                                >
                                                    <span>{item.actionLabel}</span>
                                                    <ArrowRight className="h-3 w-3" />
                                                </Button>
                                            )}
                                            <button
                                                type="button"
                                                title={isUnread ? "Đánh dấu là đã đọc" : "Đánh dấu là chưa đọc"}
                                                onClick={(e) => handleToggleRead(item.id, e)}
                                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                                            >
                                                <CheckCheck className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Xóa thông báo"
                                                onClick={(e) => handleDelete(item.id, e)}
                                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50/40 hover:text-red-600"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Bottom Pagination Inside Card */}
                    {filteredNotifications.length > 0 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/40 px-4 py-3 text-xs text-slate-500 sm:flex-row">
                            <div>
                                Hiển thị <strong className="font-semibold text-slate-800">{paginatedItems.length}</strong> trong tổng số{" "}
                                <strong className="font-semibold text-slate-800">{filteredNotifications.length}</strong> thông báo
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        className="flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            type="button"
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={cn(
                                                "flex h-7.5 min-w-7.5 cursor-pointer items-center justify-center rounded-md px-2 text-xs font-semibold transition-all",
                                                currentPage === pageNum
                                                    ? "bg-brand-600 text-white shadow-2xs"
                                                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                                            )}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        className="flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
