"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export interface DatePickerProps {
    value?: string; // Format: "YYYY-MM-DD"
    onChange?: (date: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

const MONTHS_VN = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

const WEEKDAYS_VN = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function DatePicker({ value, onChange, placeholder = "Chọn ngày...", className, disabled = false }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    // Initial selected date
    const selectedDate = React.useMemo(() => {
        if (!value) return null;
        const [y, m, d] = value.split("-").map(Number);
        if (!y || !m || !d) return null;
        return new Date(y, m - 1, d);
    }, [value]);

    // View state for month/year navigation
    const [viewMonth, setViewMonth] = React.useState<number>(selectedDate ? selectedDate.getMonth() : new Date().getMonth());
    const [viewYear, setViewYear] = React.useState<number>(selectedDate ? selectedDate.getFullYear() : new Date().getFullYear());

    // Synchronize view state when value changes
    React.useEffect(() => {
        if (selectedDate) {
            setViewMonth(selectedDate.getMonth());
            setViewYear(selectedDate.getFullYear());
        }
    }, [selectedDate]);

    // Generate years range (1950 to Current Year + 5)
    const currentYear = new Date().getFullYear();
    const years = React.useMemo(() => {
        const list: number[] = [];
        for (let y = currentYear + 2; y >= 1950; y--) {
            list.push(y);
        }
        return list;
    }, [currentYear]);

    // Calculate days for current view month
    const daysInMonth = React.useMemo(() => {
        return new Date(viewYear, viewMonth + 1, 0).getDate();
    }, [viewYear, viewMonth]);

    const firstDayOfWeek = React.useMemo(() => {
        // 0 = Sunday, 1 = Monday ... convert so Monday is index 0
        const day = new Date(viewYear, viewMonth, 1).getDay();
        return (day + 6) % 7;
    }, [viewYear, viewMonth]);

    const handleSelectDay = (day: number) => {
        const formattedMonth = String(viewMonth + 1).padStart(2, "0");
        const formattedDay = String(day).padStart(2, "0");
        const resultString = `${viewYear}-${formattedMonth}-${formattedDay}`;
        onChange?.(resultString);
        setOpen(false);
    };

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((prev) => prev - 1);
        } else {
            setViewMonth((prev) => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((prev) => prev + 1);
        } else {
            setViewMonth((prev) => prev + 1);
        }
    };

    // Format display string
    const displayString = React.useMemo(() => {
        if (!selectedDate) return placeholder;
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const year = selectedDate.getFullYear();
        return `${day}/${month}/${year}`;
    }, [selectedDate, placeholder]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                        "flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-slate-300 bg-white px-3.5 text-xs font-medium text-slate-900 transition-all hover:border-slate-400 focus:border-[#ab1f24] focus:ring-1 focus:ring-[#ab1f24] focus:outline-hidden disabled:cursor-not-allowed disabled:bg-slate-100/80 disabled:text-slate-400 sm:text-sm",
                        !selectedDate && "font-normal text-slate-400",
                        className,
                    )}
                >
                    <span className="truncate">{displayString}</span>
                    <CalendarIcon className="h-4 w-4 shrink-0 text-slate-400" />
                </button>
            </PopoverTrigger>

            <PopoverContent align="start" sideOffset={6} className="w-[300px] space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                {/* Header: Month & Year Selectors & Navigation */}
                <div className="flex items-center justify-between gap-1 pb-1">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={handlePrevMonth}
                        className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1.5">
                        {/* Month Select */}
                        <Select value={String(viewMonth)} onValueChange={(val) => setViewMonth(Number(val))}>
                            <SelectTrigger className="h-8 rounded-lg border-slate-200 px-2 text-xs font-semibold text-slate-800">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-56 rounded-xl border-slate-200">
                                {MONTHS_VN.map((m, idx) => (
                                    <SelectItem key={idx} value={String(idx)} className="text-xs font-medium">
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Year Select */}
                        <Select value={String(viewYear)} onValueChange={(val) => setViewYear(Number(val))}>
                            <SelectTrigger className="h-8 rounded-lg border-slate-200 px-2 font-mono text-xs font-semibold text-slate-800">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-56 rounded-xl border-slate-200 font-mono">
                                {years.map((y) => (
                                    <SelectItem key={y} value={String(y)} className="text-xs font-medium">
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={handleNextMonth}
                        className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 text-center">
                    {WEEKDAYS_VN.map((w, idx) => (
                        <span key={idx} className="text-[11px] font-bold text-slate-400">
                            {w}
                        </span>
                    ))}
                </div>

                {/* Calendar Days Matrix */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells before month start */}
                    {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="h-8 w-8" />
                    ))}

                    {/* Days in Month */}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const isSelected =
                            selectedDate &&
                            selectedDate.getDate() === dayNum &&
                            selectedDate.getMonth() === viewMonth &&
                            selectedDate.getFullYear() === viewYear;

                        const isToday = new Date().getDate() === dayNum && new Date().getMonth() === viewMonth && new Date().getFullYear() === viewYear;

                        return (
                            <button
                                key={dayNum}
                                type="button"
                                onClick={() => handleSelectDay(dayNum)}
                                className={cn(
                                    "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs font-medium transition-all",
                                    isSelected
                                        ? "bg-[#ab1f24] font-bold text-white shadow-xs hover:bg-[#8b1a1f]"
                                        : isToday
                                          ? "border border-[#ab1f24] font-bold text-[#ab1f24] hover:bg-red-50"
                                          : "text-slate-700 hover:bg-slate-100",
                                )}
                            >
                                {dayNum}
                            </button>
                        );
                    })}
                </div>

                {/* Quick actions: Hôm nay & Đóng */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                    <button
                        type="button"
                        onClick={() => {
                            const now = new Date();
                            const y = now.getFullYear();
                            const m = String(now.getMonth() + 1).padStart(2, "0");
                            const d = String(now.getDate()).padStart(2, "0");
                            onChange?.(`${y}-${m}-${d}`);
                            setOpen(false);
                        }}
                        className="cursor-pointer font-semibold text-[#ab1f24] hover:underline"
                    >
                        Hôm nay
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onChange?.("");
                            setOpen(false);
                        }}
                        className="cursor-pointer font-medium text-slate-500 hover:text-slate-700"
                    >
                        Xóa
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
