"use client";

import { useState } from "react";
import { ArrowRight, BarChart3, CheckCircle2, ChevronDown, ChevronUp, FileText, Flame, LayoutGrid, Loader2, RefreshCcw, TrendingDown } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ActivityHeatmapCalendar } from "@/components/charts/activity-heatmap-calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRecentAttempts, useResultHeatmap, useResultTopicGroups } from "@/hooks/queries/use-exam-result";
import type { TopicGroup, TopicSubItem } from "@/types/exam-result.types";

const ResultHistoryChart = dynamic(() => import("@/components/charts/result-history-chart").then((m) => m.ResultHistoryChart), {
    ssr: false,
    loading: () => (
        <div className="flex h-[360px] w-full items-center justify-center text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
        </div>
    ),
});

export function ExamResultHistoryView() {
    const [expandedGroups, setExpandedGroups] = useState<string[]>(["re-gv-tg", "ptit-k23"]);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(2026);

    const { data: heatmapData } = useResultHeatmap();
    const { data: recentAttemptsData } = useRecentAttempts();
    const { data: topicGroupsData } = useResultTopicGroups();

    const heatmap = heatmapData ?? {};
    const recentAttempts = recentAttemptsData ?? [];
    const topicGroups = topicGroupsData ?? [];

    const toggleGroup = (groupId: string) => {
        setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]));
    };

    // Find active topic & group if selected
    let currentGroup: TopicGroup | null = null;
    let currentTopic: TopicSubItem | null = null;

    if (selectedTopicId) {
        for (const group of topicGroups) {
            const found = group.children.find((c) => c.id === selectedTopicId);
            if (found) {
                currentGroup = group;
                currentTopic = found;
                break;
            }
        }
    }

    // Chart Data Preparation (when a topic is selected)
    const labels = currentTopic?.attempts.map((a) => `Lần ${a.attemptNum}`) || [];
    const barScores = currentTopic?.attempts.map((a) => a.score) || [];
    const lineScores = currentTopic?.attempts.map((a) => a.totalScore) || [];

    const chartData = {
        labels: labels.length > 0 ? labels : ["Lần 1", "Lần 2", "Lần 3"],
        datasets: [
            {
                type: "line" as const,
                label: "Điểm tổng",
                data: lineScores.length > 0 ? lineScores : [109, 10, 0],
                borderColor: "#22c55e",
                backgroundColor: "#22c55e",
                borderWidth: 2,
                pointBackgroundColor: "#22c55e",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.35,
                order: 1,
            },
            {
                type: "bar" as const,
                label: currentTopic ? (currentTopic.name.length > 30 ? `${currentTopic.name.slice(0, 30)}...` : currentTopic.name) : "Điểm số",
                data: barScores.length > 0 ? barScores : [109, 10, 0],
                backgroundColor: "rgba(217, 83, 79, 0.85)",
                hoverBackgroundColor: "rgba(171, 31, 36, 1)",
                borderRadius: {
                    topLeft: 6,
                    topRight: 6,
                    bottomLeft: 0,
                    bottomRight: 0,
                },
                barThickness: 72,
                maxBarThickness: 90,
                order: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#64748b",
                    font: { size: 13, family: "Roboto, sans-serif" },
                },
            },
            y: {
                beginAtZero: true,
                max: 120,
                ticks: {
                    stepSize: 20,
                    color: "#64748b",
                    font: { size: 12, family: "Roboto, sans-serif" },
                },
                grid: {
                    color: "#f1f5f9",
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(30, 41, 59, 0.95)",
                padding: 10,
                titleFont: { size: 13, weight: "bold" as const },
                bodyFont: { size: 12 },
                cornerRadius: 8,
            },
        },
    };

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-slate-900">
            <div className="mx-auto max-w-[1440px] space-y-6 px-3.5 py-6 sm:space-y-8 sm:px-8 lg:px-10">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                    <Link href="/" className="transition-colors hover:text-[#ab1f24]">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span className="font-bold text-slate-900">Lịch sử kết quả thi</span>
                </div>

                {/* 1. Header: Page Title & Subtitle */}
                <div className="space-y-1.5 text-center">
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#ab1f24] sm:text-[32px] lg:text-[38px]">Kết quả luyện tập</h1>
                    <p className="text-xs text-slate-600 sm:text-sm md:text-base">Xem lại kết quả, phân tích điểm mạnh và tiếp tục cải thiện.</p>
                </div>

                {/* 2. Main Two-Column Layout */}
                <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
                    {/* Left Column: Sidebar Accordion Navigation */}
                    <div className="w-full shrink-0 space-y-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-4 lg:w-[320px] xl:w-[340px]">
                        {/* Root Overview Navigation Item */}
                        <button
                            type="button"
                            onClick={() => setSelectedTopicId(null)}
                            className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-3 text-left text-[14px] transition-all sm:text-[14.5px] ${
                                selectedTopicId === null
                                    ? "bg-[#fff6f7] font-bold text-[#ab1f24] shadow-2xs"
                                    : "font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#ab1f24]"
                            }`}
                        >
                            <LayoutGrid className="h-4 w-4 shrink-0 text-[#ab1f24]" />
                            <span>Hoạt động của bạn (Tổng quan)</span>
                        </button>

                        <div className="space-y-1.5 border-t border-slate-100 pt-2">
                            {topicGroups.map((group) => {
                                const isExpanded = expandedGroups.includes(group.id);
                                const hasActiveChild = group.children.some((c) => c.id === selectedTopicId);

                                return (
                                    <div key={group.id} className="space-y-1.5">
                                        {/* Group Header Button (Cấp 1) */}
                                        <button
                                            type="button"
                                            onClick={() => toggleGroup(group.id)}
                                            className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[14px] font-bold transition-all sm:text-[14.5px] ${
                                                hasActiveChild ? "text-[#ab1f24]" : "text-slate-800 hover:bg-slate-50 hover:text-[#ab1f24]"
                                            }`}
                                        >
                                            <span className="truncate pr-2">{group.name}</span>
                                            {isExpanded ? (
                                                <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                                            )}
                                        </button>

                                        {/* Group Children List (Cấp 2) */}
                                        {isExpanded && (
                                            <div className="space-y-1.5 pl-3">
                                                {group.children.map((child) => {
                                                    const isActive = child.id === selectedTopicId;
                                                    return (
                                                        <button
                                                            key={child.id}
                                                            type="button"
                                                            onClick={() => setSelectedTopicId(child.id)}
                                                            className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[13px] transition-all sm:text-[13.5px] ${
                                                                isActive
                                                                    ? "bg-[#fff6f7] font-bold text-[#ab1f24] shadow-2xs"
                                                                    : "font-medium text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                                                            }`}
                                                        >
                                                            <span className="truncate">{child.name}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Analytics Container */}
                    <div className="w-full min-w-0 flex-1 space-y-6">
                        {/* CASE A: No specific topic selected -> Render Activity Heatmap Calendar (GitHub style) */}
                        {selectedTopicId === null || !currentTopic ? (
                            <div className="space-y-6">
                                {/* Header with Year Selector */}
                                <div className="flex items-center justify-between gap-2">
                                    <h2 className="text-base font-bold text-slate-900 sm:text-[17px]">Hoạt động của bạn</h2>
                                    <div className="flex shrink-0 items-center gap-1.5">
                                        {[2026, 2025].map((yr) => (
                                            <button
                                                key={yr}
                                                type="button"
                                                onClick={() => setSelectedYear(yr)}
                                                className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition-all sm:px-4 ${
                                                    selectedYear === yr
                                                        ? "bg-[#ab1f24] text-white shadow-xs"
                                                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                }`}
                                            >
                                                {yr}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* GitHub-style Activity Heatmap Calendar */}
                                <ActivityHeatmapCalendar year={selectedYear} activityData={heatmap} />

                                {/* 4 Summary Stat Cards for Year Overview */}
                                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
                                    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-4">
                                        <span className="block text-[11px] text-slate-500 sm:text-xs">Tổng bài thi năm {selectedYear}</span>
                                        <div className="mt-1 flex items-center gap-1.5 text-[15px] font-bold text-slate-900 sm:text-[17px]">
                                            <FileText className="h-4 w-4 shrink-0 text-[#ab1f24]" />
                                            <span>38 bài</span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-4">
                                        <span className="block text-[11px] text-slate-500 sm:text-xs">Điểm trung bình</span>
                                        <div className="mt-1 flex items-center gap-1.5 text-[15px] font-bold text-slate-900 sm:text-[17px]">
                                            <BarChart3 className="h-4 w-4 shrink-0 text-emerald-600" />
                                            <span>8.4 / 10</span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-4">
                                        <span className="block text-[11px] text-slate-500 sm:text-xs">Chuỗi luyện tập</span>
                                        <div className="mt-1 flex items-center gap-1.5 truncate text-[15px] font-bold text-amber-600 sm:text-[17px]">
                                            <Flame className="h-4 w-4 shrink-0 text-amber-500" />
                                            <span>7 ngày liên tục</span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-4">
                                        <span className="block text-[11px] text-slate-500 sm:text-xs">Tỷ lệ hoàn thành đạt</span>
                                        <div className="mt-1 flex items-center gap-1.5 text-[15px] font-bold text-emerald-700 sm:text-[17px]">
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                                            <span>94%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* CASE B: Specific topic selected -> Render Combo Bar/Line Chart & Topic Stats */
                            <div className="space-y-6">
                                {/* Topic Breadcrumb & Header */}
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900 sm:text-[16px]">
                                            {currentGroup?.name} / {currentTopic.name}
                                        </h2>
                                        <p className="mt-0.5 text-xs text-slate-500 sm:text-[13px]">Biểu đồ đánh giá kết quả luyện tập của bạn</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedTopicId(null)}
                                        className="h-8.5 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        <LayoutGrid className="mr-1.5 h-3.5 w-3.5 text-[#ab1f24]" />
                                        <span>Xem sơ đồ tổng quan</span>
                                    </Button>
                                </div>

                                {/* 4 Summary Stat Cards for Selected Topic */}
                                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
                                    {/* Card 1: Số lần thi */}
                                    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-4">
                                        <span className="block text-[11px] text-slate-500 sm:text-xs">Số lần thi</span>
                                        <div className="mt-1 flex items-center gap-1.5 text-[15px] font-bold text-slate-900 sm:text-[17px]">
                                            <RefreshCcw className="h-4 w-4 text-slate-700" />
                                            <span>{currentTopic.attemptsCount} lần</span>
                                        </div>
                                    </div>

                                    {/* Card 2: Điểm trung bình */}
                                    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-4">
                                        <span className="block text-[11px] text-slate-500 sm:text-xs">Điểm trung bình</span>
                                        <div className="mt-1 text-[15px] font-bold text-slate-900 sm:text-[17px]">{currentTopic.avgScore}</div>
                                    </div>

                                    {/* Card 3: Điểm cao nhất */}
                                    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-4">
                                        <span className="block text-[11px] text-slate-500 sm:text-xs">Điểm cao nhất</span>
                                        <div className="mt-1 text-[15px] font-bold text-slate-900 sm:text-[17px]">{currentTopic.maxScore}</div>
                                    </div>

                                    {/* Card 4: Xu hướng */}
                                    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:p-4">
                                        <span className="block text-[11px] text-slate-500 sm:text-xs">Xu hướng</span>
                                        <div className="mt-1 flex items-center gap-1.5 text-[15px] font-bold text-rose-600 sm:text-[17px]">
                                            <TrendingDown className="h-4 w-4 text-rose-600" />
                                            <span>{currentTopic.trend === "GIAM" ? "Giảm" : "Tăng"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chart Area Card with Legend */}
                                <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-6">
                                    {/* Legend on Top */}
                                    <div className="flex items-center justify-center gap-6 text-xs font-medium text-slate-700 sm:justify-end">
                                        <div className="flex items-center gap-2">
                                            <div className="h-[2px] w-5 bg-[#22c55e]" />
                                            <span>Điểm tổng</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-2xs h-3.5 w-3.5 bg-[rgba(217,83,79,0.85)]" />
                                            <span className="max-w-[200px] truncate">{currentTopic.name}</span>
                                        </div>
                                    </div>

                                    {/* Chart Canvas */}
                                    <div className="h-[300px] w-full pt-2 sm:h-[360px]">
                                        <ResultHistoryChart data={chartData} options={chartOptions} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. Lịch sử Ca thi & Luyện tập đã thực hiện gần đây */}
                        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 sm:text-base">Lịch sử bài thi & Luyện tập đã nộp</h3>
                                    <p className="mt-0.5 text-xs text-slate-500">Danh sách các bài thi chính thức và các phiên luyện tập gần nhất của bạn</p>
                                </div>
                                <Badge variant="outline" className="border-slate-200 text-xs font-semibold text-slate-600">
                                    {recentAttempts.length} bài đã nộp
                                </Badge>
                            </div>

                            {/* View 1: Mobile Card Layout (block md:hidden) - Tối ưu 100% không bị tràn */}
                            <div className="block space-y-3 md:hidden">
                                {recentAttempts.map((attempt) => (
                                    <div
                                        key={attempt.id}
                                        className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition-all hover:bg-white hover:shadow-2xs"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="inline-block rounded-md bg-slate-200/70 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                                                {attempt.category}
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                                                <CheckCircle2 className="h-3 w-3" />
                                                <span>Đạt</span>
                                            </span>
                                        </div>

                                        <h4 className="text-sm leading-snug font-bold text-slate-900">{attempt.title}</h4>

                                        <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-xs text-slate-500">
                                            <div className="space-y-0.5">
                                                <div>
                                                    Thời gian: <strong>{attempt.submittedAt}</strong>
                                                </div>
                                                <div>
                                                    Điểm số: <strong className="text-sm font-bold text-[#ab1f24]">{attempt.score}</strong>/{attempt.maxScore}
                                                </div>
                                            </div>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            <Link href={attempt.resultUrl as any}>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 rounded-lg border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:border-red-200 hover:bg-red-50 hover:text-[#ab1f24]"
                                                >
                                                    <span>Xem kết quả</span>
                                                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* View 2: Desktop / Tablet Table (hidden md:block) */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-xs font-bold text-slate-400">
                                            <th className="pr-4 pb-3 font-semibold">Tên ca thi / Bài thi</th>
                                            <th className="px-3 pb-3 font-semibold">Phân loại</th>
                                            <th className="px-3 pb-3 font-semibold">Thời gian nộp</th>
                                            <th className="px-3 pb-3 text-center font-semibold">Điểm số</th>
                                            <th className="px-3 pb-3 text-center font-semibold">Trạng thái</th>
                                            <th className="pb-3 pl-3 text-right font-semibold">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                        {recentAttempts.map((attempt) => (
                                            <tr key={attempt.id} className="transition-colors hover:bg-slate-50/70">
                                                <td className="max-w-[240px] truncate py-3.5 pr-4 font-bold text-slate-900">{attempt.title}</td>
                                                <td className="px-3 py-3.5 whitespace-nowrap">
                                                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                                        {attempt.category}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3.5 text-xs whitespace-nowrap text-slate-500">{attempt.submittedAt}</td>
                                                <td className="px-3 py-3.5 text-center font-bold whitespace-nowrap text-slate-900">
                                                    <span className="font-bold text-[#ab1f24]">{attempt.score}</span>/{attempt.maxScore}
                                                </td>
                                                <td className="px-3 py-3.5 text-center whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        <span>Đạt</span>
                                                    </span>
                                                </td>
                                                <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <Link href={attempt.resultUrl as any}>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-[#ab1f24]"
                                                        >
                                                            <span>Xem kết quả</span>
                                                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
