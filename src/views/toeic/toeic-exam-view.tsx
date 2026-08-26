"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Clock, Headphones, HelpCircle, Loader2, Pause, Play, Volume2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeaderNav } from "@/components/layout/header-nav";
import { HeaderUserActions } from "@/components/layout/header-user-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { useToeicQuestions } from "@/hooks/queries/use-toeic";
import { cn } from "@/lib/utils";

const INITIAL_DURATION_SECONDS = 7200; // 120 minutes

export function ToeicExamView({ examId, testId }: { examId?: string; testId?: string }) {
    const actualId = examId || testId || "toeic-test-01";
    const router = useRouter();
    const { data } = useToeicQuestions();
    const questions = data ?? [];

    const storageAnswersKey = `lms_toeic_answers_${actualId}`;
    const storageStartTimeKey = `lms_toeic_start_time_${actualId}`;
    const storageLastSavedKey = `lms_toeic_last_saved_${actualId}`;

    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [activeQuestionId, setActiveQuestionId] = useState<number>(1);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [audioProgress, setAudioProgress] = useState(25);
    const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_DURATION_SECONDS);
    const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    // Hydrate answers and timer from LocalStorage
    useEffect(() => {
        try {
            const savedAnswers = localStorage.getItem(storageAnswersKey);
            if (savedAnswers) {
                setAnswers(JSON.parse(savedAnswers));
            }

            const savedStartTime = localStorage.getItem(storageStartTimeKey);
            const now = Date.now();

            if (!savedStartTime) {
                localStorage.setItem(storageStartTimeKey, now.toString());
                setSecondsRemaining(INITIAL_DURATION_SECONDS);
            } else {
                const elapsedSeconds = Math.floor((now - parseInt(savedStartTime, 10)) / 1000);
                const remaining = Math.max(0, INITIAL_DURATION_SECONDS - elapsedSeconds);
                setSecondsRemaining(remaining);
            }

            const savedTime = localStorage.getItem(storageLastSavedKey);
            if (savedTime) {
                setLastSavedTime(savedTime);
            }
        } catch {
            // fallback
        } finally {
            setIsHydrated(true);
        }
    }, [storageAnswersKey, storageStartTimeKey, storageLastSavedKey]);

    // Save to LocalStorage
    const saveToLocalStorage = useCallback(
        (newAnswers: Record<string, string>) => {
            try {
                localStorage.setItem(storageAnswersKey, JSON.stringify(newAnswers));
                const timeStr = new Date().toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });
                localStorage.setItem(storageLastSavedKey, timeStr);
                setLastSavedTime(timeStr);
            } catch {
                // storage full or disabled
            }
        },
        [storageAnswersKey, storageLastSavedKey],
    );

    const handleSelectOption = (questionId: string, optionId: string) => {
        setAnswers((prev) => {
            const updated = { ...prev, [questionId]: optionId };
            saveToLocalStorage(updated);
            return updated;
        });
    };

    // Countdown Timer with auto-submit
    useEffect(() => {
        if (!isHydrated) return;

        const interval = setInterval(() => {
            setSecondsRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleConfirmSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHydrated]);

    const handleConfirmSubmit = () => {
        setIsSubmitting(true);
        try {
            localStorage.removeItem(storageAnswersKey);
            localStorage.removeItem(storageStartTimeKey);
            localStorage.removeItem(storageLastSavedKey);
        } catch {
            // ignore
        }
        setTimeout(() => {
            setIsSubmitModalOpen(false);
            router.push(`/toeic/${actualId}/result`);
        }, 600);
    };

    const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        if (h > 0) {
            return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        }
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const scrollToQuestion = (orderNum: number) => {
        setActiveQuestionId(orderNum);
        const element = document.getElementById(`toeic-question-card-${orderNum}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const answeredCount = Object.keys(answers).length;
    const paletteNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
            {/* 1. Header (RikkeiEdu Logo + 5 Navigation Tabs + Candidate Avatar) */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white shadow-2xs">
                <div className="relative mx-auto flex h-18 max-w-[1440px] items-center justify-between px-6 sm:px-10">
                    {/* Left: Brand Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/images/header/logo-rikkei2 1.png"
                                alt={UI_TEXT.common.appName}
                                width={114}
                                height={40}
                                className="h-10 w-auto cursor-pointer object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Center: Navigation Links */}
                    <HeaderNav />

                    {/* Right: Actions with Bell & Avatar Dropdowns */}
                    <HeaderUserActions />
                </div>
            </header>

            {/* 2. Main Exam Body */}
            <main className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10">
                {/* Breadcrumb Navigation */}
                <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                    <Link href="/toeic" className="transition-colors hover:text-brand-600">
                        Ngoại ngữ
                    </Link>
                    <span>/</span>
                    <span className="font-bold text-slate-900">Phòng thi trực tuyến</span>
                </div>

                <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:gap-12">
                    {/* Left Column: Stacked Questions List & Simulator */}
                    <div className="w-full max-w-[880px] flex-1 space-y-8">
                        {/* Listening Player Simulator */}
                        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-7">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                                    <Headphones className="h-5 w-5 text-brand-600" />
                                    <span>Audio Listening Track · ETS Official Section 1</span>
                                </div>
                                <span className="font-mono text-xs font-semibold text-slate-500">03:45 / 45:00</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white shadow-xs transition-transform hover:bg-brand-700 active:scale-95"
                                >
                                    {isPlayingAudio ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
                                </button>

                                <div className="flex-1 space-y-1">
                                    <div
                                        className="relative h-2 w-full cursor-pointer overflow-hidden rounded-full bg-slate-100"
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const pos = ((e.clientX - rect.left) / rect.width) * 100;
                                            setAudioProgress(Math.min(100, Math.max(0, pos)));
                                        }}
                                    >
                                        <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${audioProgress}%` }} />
                                    </div>
                                    <div className="text-2xs flex justify-between font-mono text-slate-400">
                                        <span>01:15</span>
                                        <span>Tự động phát theo trình tự bài thi</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <Volume2 className="h-4 w-4" />
                                    <span className="text-xs font-semibold">100%</span>
                                </div>
                            </div>
                        </div>

                        {/* Questions List */}
                        {questions.map((q) => {
                            const selectedOptionId = answers[q.id];

                            return (
                                <div
                                    key={q.id}
                                    id={`toeic-question-card-${q.orderNumber}`}
                                    className="scroll-mt-24 space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-7"
                                >
                                    {/* Question Header & Points Badge */}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <h2 className="text-lg font-bold tracking-tight text-slate-900">Câu hỏi {q.orderNumber}</h2>
                                                <Badge variant="outline" className="border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                                                    {q.partTitle}
                                                </Badge>
                                            </div>
                                            <Badge className="border border-brand-200 bg-brand-50 text-xs font-bold text-brand-700 shadow-none">
                                                {q.points} điểm
                                            </Badge>
                                        </div>
                                        <p className="mt-3 text-base leading-relaxed font-semibold text-slate-800">{q.title}</p>
                                    </div>

                                    {/* Options using Shadcn RadioGroup */}
                                    <div className="pt-2">
                                        <RadioGroup
                                            value={selectedOptionId || ""}
                                            onValueChange={(val) => handleSelectOption(q.id, val)}
                                            className="grid grid-cols-1 gap-3"
                                        >
                                            {q.options.map((opt) => {
                                                const isSelected = selectedOptionId === opt.id;
                                                return (
                                                    <label
                                                        key={opt.id}
                                                        htmlFor={`radio-toeic-${q.id}-${opt.id}`}
                                                        className={cn(
                                                            "flex cursor-pointer items-center gap-3.5 rounded-xl border p-4 transition-all",
                                                            isSelected
                                                                ? "border-brand-500 bg-brand-50/50 font-semibold text-slate-900 shadow-2xs"
                                                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                                                        )}
                                                    >
                                                        <RadioGroupItem
                                                            value={opt.id}
                                                            id={`radio-toeic-${q.id}-${opt.id}`}
                                                            className="border-slate-400 data-[state=checked]:border-brand-600 data-[state=checked]:text-brand-600"
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-slate-900">{opt.label}.</span>
                                                            <span className="text-sm leading-relaxed select-none sm:text-base">{opt.text}</span>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </RadioGroup>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Sticky Navigation Palette & Submit CTA */}
                    <div className="sticky top-24 w-full shrink-0 space-y-5 lg:w-[360px] xl:w-[380px]">
                        <Card className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
                            {/* Palette Header with Timer & Auto-Save status */}
                            <CardHeader className="space-y-3 border-b border-slate-100 p-0 pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-bold text-slate-900">Danh sách câu hỏi</CardTitle>
                                    <div
                                        className={cn(
                                            "flex items-center gap-1.5 rounded-xl border px-3 py-1 font-mono text-base font-bold shadow-2xs transition-colors",
                                            secondsRemaining <= 60
                                                ? "animate-pulse border-red-300 bg-red-100 text-red-600"
                                                : secondsRemaining <= 300
                                                  ? "border-amber-200 bg-amber-50 text-amber-700"
                                                  : "border-brand-100 bg-brand-50 text-brand-700",
                                        )}
                                    >
                                        <Clock
                                            className={cn(
                                                "h-4 w-4 shrink-0",
                                                secondsRemaining <= 60 ? "text-red-600" : secondsRemaining <= 300 ? "text-amber-600" : "text-brand-600",
                                            )}
                                        />
                                        <span>{formatTime(secondsRemaining)}</span>
                                    </div>
                                </div>

                                {/* Auto-Save Persistence Status Badge */}
                                <div className="flex items-center justify-between rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-1.5 text-xs font-medium text-emerald-800">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                        <span>Tự động lưu vào máy</span>
                                    </div>
                                    {lastSavedTime && <span className="font-mono text-[11px] font-semibold text-emerald-700">{lastSavedTime}</span>}
                                </div>
                            </CardHeader>

                            {/* 8-Column Matrix Palette with Square Buttons (4 cạnh bằng nhau aspect-square) */}
                            <CardContent className="space-y-5 p-0">
                                <div className="grid grid-cols-6 justify-items-center gap-2 sm:grid-cols-6 lg:grid-cols-8">
                                    {paletteNumbers.map((num) => {
                                        const matchingQuestion = questions.find((q) => q.orderNumber === num);
                                        const isAvailable = Boolean(matchingQuestion);
                                        const isCurrent = activeQuestionId === num;
                                        const hasAnswer = matchingQuestion ? Boolean(answers[matchingQuestion.id]) : false;

                                        return (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => isAvailable && scrollToQuestion(num)}
                                                disabled={!isAvailable}
                                                className={cn(
                                                    "flex aspect-square h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-xs font-bold transition-all sm:h-10 sm:w-10 sm:text-sm",
                                                    isCurrent
                                                        ? "border-2 border-brand-600 bg-white text-brand-600 shadow-xs"
                                                        : hasAnswer
                                                          ? "border border-emerald-300 bg-emerald-50 text-emerald-700"
                                                          : isAvailable
                                                            ? "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                                                            : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300 opacity-40",
                                                )}
                                            >
                                                {num}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Palette Legend */}
                                <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-xs text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-3 w-3 rounded-md border-2 border-brand-600 bg-white" />
                                        <span>Đang làm</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-3 w-3 rounded-md border border-emerald-300 bg-emerald-50" />
                                        <span>Đã làm</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-3 w-3 rounded-md border border-slate-200 bg-white" />
                                        <span>Chưa làm</span>
                                    </div>
                                </div>

                                {/* Submit Exam Button using Shadcn Button */}
                                <div className="pt-1">
                                    <Button
                                        type="button"
                                        size="lg"
                                        onClick={() => setIsSubmitModalOpen(true)}
                                        className="h-12 w-full cursor-pointer gap-2 rounded-xl bg-brand-600 text-base font-bold text-white shadow-xs hover:bg-brand-700 active:scale-98"
                                    >
                                        <span>Nộp bài</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Progress Quick Card with Shadcn Progress */}
                        <Card className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-2xs">
                            <div className="flex justify-between font-semibold">
                                <span>Tiến độ hoàn thành:</span>
                                <strong className="font-bold text-brand-600">
                                    {answeredCount}/{questions.length} câu ({questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0}%)
                                </strong>
                            </div>
                            <Progress value={questions.length > 0 ? (answeredCount / questions.length) * 100 : 0} className="h-2 rounded-full bg-slate-100" />
                        </Card>
                    </div>
                </div>
            </main>

            {/* 3. Submit Confirmation Modal (Padding 20px 24px, Max Radius 12px, Shadcn UI) */}
            <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
                <DialogContent size="md" className="max-w-[460px] gap-4 rounded-xl border border-slate-200 bg-white px-[24px] py-[20px] shadow-xl">
                    <DialogHeader className="pb-0 text-center sm:text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                            <HelpCircle className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900">Xác nhận nộp bài TOEIC</DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?</DialogDescription>
                    </DialogHeader>

                    {/* Test Summary Box */}
                    <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-left">
                        <p className="line-clamp-1 text-sm font-bold text-slate-900">TOEIC Full Test 2026 — Đề Chuẩn ETS Format</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                            <span>
                                Tiến độ:{" "}
                                <strong className="font-bold text-slate-800">
                                    {answeredCount}/{questions.length} câu
                                </strong>
                            </span>
                            <span>•</span>
                            <span>
                                Thời gian còn lại: <strong className="font-mono text-slate-800">{formatTime(secondsRemaining)}</strong>
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-500">
                        Sau khi nộp bài, bạn sẽ <span className="font-bold text-brand-700">không thể chỉnh sửa</span> đáp án.
                    </p>

                    <DialogFooter className="flex-row items-center justify-center gap-2.5 pt-1 sm:justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsSubmitModalOpen(false)}
                            disabled={isSubmitting}
                            className="h-11 flex-1 rounded-xl border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Tiếp tục làm bài
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmSubmit}
                            disabled={isSubmitting}
                            className="h-11 flex-1 rounded-xl bg-brand-600 font-bold text-white shadow-xs hover:bg-brand-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                    <span>Đang nộp...</span>
                                </>
                            ) : (
                                <span>Xác nhận nộp</span>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
