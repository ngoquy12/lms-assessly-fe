"use client";

import { useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface DayActivityData {
    date: string; // YYYY-MM-DD
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
    tests?: {
        name: string;
        score: number;
        maxScore: number;
        category?: string;
    }[];
}

interface ActivityHeatmapCalendarProps {
    year?: number;
    activityData?: Record<string, DayActivityData>;
    className?: string;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DAY_LABELS = ["T2", "", "T4", "", "T6", "", "CN"];

export function ActivityHeatmapCalendar({ year = 2026, activityData = {}, className }: ActivityHeatmapCalendarProps) {
    const [selectedCellDate, setSelectedCellDate] = useState<string | null>(null);

    // Build the 53-week x 7-day matrix for the given year
    const { calendarWeeks, monthPositions, totalActivities } = useMemo(() => {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        // Day of week: 0 is Sun, 1 is Mon... convert to Monday=0, Sunday=6
        const getDayOfWeekIndex = (date: Date) => {
            const day = date.getDay();
            return day === 0 ? 6 : day - 1;
        };

        const weeks: (DayActivityData | null)[][] = [];
        let currentWeek: (DayActivityData | null)[] = [];

        // Pad the start of first week
        const startDayIndex = getDayOfWeekIndex(startDate);
        for (let i = 0; i < startDayIndex; i++) {
            currentWeek.push(null);
        }

        let total = 0;
        const monthCols: { month: string; colIndex: number }[] = [];
        let lastMonth = -1;

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split("T")[0];
            const currentMonth = currentDate.getMonth();

            // Track month label positions at the first occurrence in a new week
            if (currentMonth !== lastMonth) {
                monthCols.push({
                    month: MONTH_NAMES[currentMonth],
                    colIndex: weeks.length,
                });
                lastMonth = currentMonth;
            }

            const existingData = activityData[dateStr];
            const count = existingData ? existingData.count : 0;
            total += count;

            let level: 0 | 1 | 2 | 3 | 4 = 0;
            if (count >= 4) level = 4;
            else if (count === 3) level = 3;
            else if (count === 2) level = 2;
            else if (count === 1) level = 1;

            const dayData: DayActivityData = existingData || {
                date: dateStr,
                count,
                level,
                tests: [],
            };

            currentWeek.push(dayData);

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Pad the remainder of the last week
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }

        return {
            calendarWeeks: weeks,
            monthPositions: monthCols,
            totalActivities: total,
        };
    }, [year, activityData]);

    const getLevelColorClass = (level: number) => {
        switch (level) {
            case 1:
                return "bg-brand-50 border-brand-200 hover:bg-brand-100";
            case 2:
                return "bg-brand-300 border-brand-400 hover:bg-brand-400";
            case 3:
                return "bg-brand-500 border-brand-600 hover:bg-brand-600";
            case 4:
                return "bg-brand-700 border-brand-800 hover:bg-brand-800";
            default:
                return "bg-slate-100/90 border-slate-200/70 hover:bg-slate-200";
        }
    };

    const formatDateVi = (dateStr: string) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <TooltipProvider delayDuration={100}>
            <div className={cn("space-y-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs sm:p-5 lg:p-6", className)}>
                {/* Month labels & Heatmap Matrix Container */}
                <div className="overflow-x-auto pb-2">
                    <div className="min-w-[720px] select-none">
                        {/* Month header row */}
                        <div className="flex pb-2 pl-7 text-xs font-semibold text-slate-400">
                            {monthPositions.map(({ month, colIndex }, idx) => {
                                const nextCol = monthPositions[idx + 1]?.colIndex ?? calendarWeeks.length;
                                const widthCols = Math.max(1, nextCol - colIndex);
                                return (
                                    <div key={`${month}-${idx}`} style={{ width: `${widthCols * 14}px` }} className="shrink-0 truncate text-left">
                                        {month}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Heatmap Grid with Day Labels on Left */}
                        <div className="flex items-start gap-1.5">
                            {/* Day of week labels */}
                            <div className="flex flex-col gap-1 pr-1 text-[10px] font-bold text-slate-400">
                                {DAY_LABELS.map((lbl, idx) => (
                                    <span key={idx} className="h-3 w-4.5 text-right leading-3">
                                        {lbl}
                                    </span>
                                ))}
                            </div>

                            {/* 53 Columns of 7 Days */}
                            <div className="flex gap-1">
                                {calendarWeeks.map((week, weekIdx) => (
                                    <div key={weekIdx} className="flex flex-col gap-1">
                                        {week.map((day, dayIdx) => {
                                            if (!day) {
                                                return <div key={`empty-${weekIdx}-${dayIdx}`} className="h-3 w-3 rounded-[3px] bg-transparent" />;
                                            }

                                            return (
                                                <Tooltip key={day.date}>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedCellDate(day.date)}
                                                            className={cn(
                                                                "h-3 w-3 cursor-pointer rounded-[3px] border transition-all",
                                                                getLevelColorClass(day.level),
                                                                selectedCellDate === day.date && "ring-2 ring-brand-500 ring-offset-1",
                                                            )}
                                                            aria-label={`${day.date}: ${day.count} bài thi`}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        side="top"
                                                        className="max-w-[260px] rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white shadow-xl"
                                                    >
                                                        <div className="space-y-1">
                                                            <p className="font-bold text-slate-200 capitalize">{formatDateVi(day.date)}</p>
                                                            <p className="text-slate-300">
                                                                {day.count > 0 ? (
                                                                    <span>
                                                                        <strong className="font-bold text-white">{day.count}</strong> bài thi đã hoàn thành
                                                                    </span>
                                                                ) : (
                                                                    <span>Không có hoạt động thi</span>
                                                                )}
                                                            </p>
                                                            {day.tests && day.tests.length > 0 && (
                                                                <div className="mt-1.5 space-y-1 border-t border-slate-700/80 pt-1.5 text-[11px]">
                                                                    {day.tests.map((t, tIdx) => (
                                                                        <div key={tIdx} className="flex items-center justify-between gap-2">
                                                                            <span className="truncate text-slate-300">• {t.name}</span>
                                                                            <span className="shrink-0 font-bold text-emerald-400">
                                                                                {t.score}/{t.maxScore}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Heatmap Footer Legend & Summary Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-2 font-medium">
                        <span>Ít</span>
                        <div className="flex items-center gap-1">
                            <span className="h-3 w-3 rounded-[3px] border border-slate-200/70 bg-slate-100" />
                            <span className="h-3 w-3 rounded-[3px] border border-brand-200 bg-brand-50" />
                            <span className="h-3 w-3 rounded-[3px] border border-brand-400 bg-brand-300" />
                            <span className="h-3 w-3 rounded-[3px] border border-brand-600 bg-brand-500" />
                            <span className="h-3 w-3 rounded-[3px] border border-brand-800 bg-brand-700" />
                        </div>
                        <span>Nhiều</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                        <span>
                            Tổng số: <strong className="font-bold text-brand-600">{totalActivities} bài thi</strong> trong năm {year}
                        </span>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
