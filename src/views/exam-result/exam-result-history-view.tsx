"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2, RefreshCcw, TrendingDown } from "lucide-react";
import dynamic from "next/dynamic";

const ResultHistoryChart = dynamic(() => import("@/components/charts/result-history-chart").then((m) => m.ResultHistoryChart), {
    ssr: false,
    loading: () => (
        <div className="flex h-[360px] w-full items-center justify-center text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
        </div>
    ),
});

interface TopicSubItem {
    id: string;
    name: string;
    attemptsCount: number;
    avgScore: number;
    maxScore: number;
    trend: "GIAM" | "TANG" | "ON_DINH";
    attempts: {
        attemptNum: number;
        score: number;
        totalScore: number;
    }[];
}

interface TopicGroup {
    id: string;
    name: string;
    children: TopicSubItem[];
}

const MOCK_TOPIC_GROUPS: TopicGroup[] = [
    {
        id: "ptit-k23",
        name: "[PTIT K23] Ôn tập kiến thức BE",
        children: [
            {
                id: "ptit-01",
                name: "[PTIT K23] Khung đề khảo thí kiến thức BE",
                attemptsCount: 2,
                avgScore: 75.5,
                maxScore: 88,
                trend: "TANG",
                attempts: [
                    { attemptNum: 1, score: 63, totalScore: 63 },
                    { attemptNum: 2, score: 88, totalScore: 88 },
                ],
            },
            {
                id: "ptit-02",
                name: "[PTIT-K23] Đánh giá năng lực Backend Java",
                attemptsCount: 1,
                avgScore: 80,
                maxScore: 80,
                trend: "ON_DINH",
                attempts: [{ attemptNum: 1, score: 80, totalScore: 80 }],
            },
        ],
    },
    {
        id: "re-gv-tg",
        name: "[RE_GV/TG]Đánh giá năng lực",
        children: [
            {
                id: "re-01",
                name: "[RE_GV/TG]Đánh giá năng lực- Test",
                attemptsCount: 3,
                avgScore: 39.7,
                maxScore: 109,
                trend: "GIAM",
                attempts: [
                    { attemptNum: 1, score: 109, totalScore: 109 },
                    { attemptNum: 2, score: 10, totalScore: 10 },
                    { attemptNum: 3, score: 0, totalScore: 0 },
                ],
            },
            {
                id: "re-02",
                name: "[RE_GV/TG]Đánh giá năng lực- Lập trình C nâng cao",
                attemptsCount: 2,
                avgScore: 65,
                maxScore: 90,
                trend: "TANG",
                attempts: [
                    { attemptNum: 1, score: 40, totalScore: 40 },
                    { attemptNum: 2, score: 90, totalScore: 90 },
                ],
            },
        ],
    },
    {
        id: "frontend-react",
        name: "[Frontend] React & Next.js 16",
        children: [
            {
                id: "fe-01",
                name: "Frontend Core & TypeScript Pro",
                attemptsCount: 2,
                avgScore: 85,
                maxScore: 92,
                trend: "TANG",
                attempts: [
                    { attemptNum: 1, score: 78, totalScore: 78 },
                    { attemptNum: 2, score: 92, totalScore: 92 },
                ],
            },
            {
                id: "fe-02",
                name: "Next.js App Router & Turbopack Practice",
                attemptsCount: 1,
                avgScore: 95,
                maxScore: 95,
                trend: "ON_DINH",
                attempts: [{ attemptNum: 1, score: 95, totalScore: 95 }],
            },
        ],
    },
];

export function ExamResultHistoryView() {
    const [expandedGroups, setExpandedGroups] = useState<string[]>(["re-gv-tg", "ptit-k23"]);
    const [selectedTopicId, setSelectedTopicId] = useState<string>("re-01");

    const toggleGroup = (groupId: string) => {
        setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]));
    };

    // Find active topic & group
    let currentGroup: TopicGroup = MOCK_TOPIC_GROUPS[1];
    let currentTopic: TopicSubItem = MOCK_TOPIC_GROUPS[1].children[0];

    for (const group of MOCK_TOPIC_GROUPS) {
        const found = group.children.find((c) => c.id === selectedTopicId);
        if (found) {
            currentGroup = group;
            currentTopic = found;
            break;
        }
    }

    // Chart Data Preparation
    const labels = currentTopic.attempts.map((a) => `Lần ${a.attemptNum}`);
    const barScores = currentTopic.attempts.map((a) => a.score);
    const lineScores = currentTopic.attempts.map((a) => a.totalScore);

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
                label: currentTopic.name.length > 30 ? `${currentTopic.name.slice(0, 30)}...` : currentTopic.name,
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
                display: false, // We render the exact legend as shown in the screenshot
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
        <div className="min-h-screen w-full bg-[#f8fafc] px-4 py-10 font-sans text-slate-900 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1440px] space-y-8">
                {/* 1. Header: Page Title & Subtitle */}
                <div className="space-y-2 text-center">
                    <h1 className="text-[32px] font-extrabold tracking-tight text-[#ab1f24] sm:text-[38px]">Kết quả luyện tập</h1>
                    <p className="text-[15px] text-slate-600 sm:text-[16px]">Xem lại kết quả, phân tích điểm mạnh và tiếp tục cải thiện.</p>
                </div>

                {/* 2. Main Two-Column Layout */}
                <div className="flex flex-col items-start gap-8 lg:flex-row">
                    {/* Left Column: Sidebar Accordion Navigation */}
                    {/* Left Column: Sidebar Accordion Navigation */}
                    <div className="w-full shrink-0 space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs lg:w-[340px]">
                        {MOCK_TOPIC_GROUPS.map((group) => {
                            const isExpanded = expandedGroups.includes(group.id);
                            const hasActiveChild = group.children.some((c) => c.id === selectedTopicId);

                            return (
                                <div key={group.id} className="space-y-1.5">
                                    {/* Group Header Button (Cấp 1) */}
                                    <button
                                        type="button"
                                        onClick={() => toggleGroup(group.id)}
                                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-3 text-left text-[15px] font-bold transition-all ${
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
                                                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-2.5 text-left text-[13.5px] transition-all ${
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

                    {/* Right Column: Analytics & Combo Chart Container */}
                    <div className="w-full min-w-0 flex-1 space-y-6">
                        {/* Topic Breadcrumb & Header */}
                        <div>
                            <h2 className="text-[16px] font-bold text-slate-900">
                                {currentGroup.name} / {currentTopic.name}
                            </h2>
                            <p className="mt-0.5 text-[13px] text-slate-500">Biểu đồ đánh giá kết quả luyện tập của bạn</p>
                        </div>

                        {/* 4 Summary Stat Cards */}
                        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
                            {/* Card 1: Số lần thi */}
                            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                                <span className="block text-xs text-slate-500">Số lần thi</span>
                                <div className="mt-1 flex items-center gap-1.5 text-[17px] font-bold text-slate-900">
                                    <RefreshCcw className="h-4 w-4 text-slate-700" />
                                    <span>{currentTopic.attemptsCount} lần</span>
                                </div>
                            </div>

                            {/* Card 2: Điểm trung bình */}
                            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                                <span className="block text-xs text-slate-500">Điểm trung bình</span>
                                <div className="mt-1 text-[17px] font-bold text-slate-900">{currentTopic.avgScore}</div>
                            </div>

                            {/* Card 3: Điểm cao nhất */}
                            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                                <span className="block text-xs text-slate-500">Điểm cao nhất</span>
                                <div className="mt-1 text-[17px] font-bold text-slate-900">{currentTopic.maxScore}</div>
                            </div>

                            {/* Card 4: Xu hướng */}
                            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                                <span className="block text-xs text-slate-500">Xu hướng</span>
                                <div className="mt-1 flex items-center gap-1.5 text-[17px] font-bold text-rose-600">
                                    <TrendingDown className="h-4 w-4 text-rose-600" />
                                    <span>{currentTopic.trend === "GIAM" ? "Giảm" : "Tăng"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Area Card with Legend */}
                        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
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
                            <div className="h-[360px] w-full pt-2">
                                <ResultHistoryChart data={chartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
