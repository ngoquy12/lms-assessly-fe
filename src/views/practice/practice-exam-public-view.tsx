"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Brain, Clock, FileCheck2, HeartHandshake, HelpCircle, Loader2, RotateCcw, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CodeEditor } from "@/components/editor/code-editor";
import { HeaderNav } from "@/components/layout/header-nav";
import { HeaderUserActions } from "@/components/layout/header-user-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { cn } from "@/lib/utils";
import { MOCK_PRACTICE_LIST, getPracticeQuestionsByPracticeId } from "@/mocks/practice.mock";
import type { QuestionItem, UserExamAnswer } from "@/types/exam.types";

export function PracticeExamPublicView({ practiceId }: { practiceId: string }) {
    const router = useRouter();

    // 1. Practice Metadata Lookup
    const practiceMeta = MOCK_PRACTICE_LIST.find((p) => p.id === practiceId) || {
        id: practiceId,
        title: "Luyện tập Node.js Event Loop, Streams & NestJS Framework",
        category: "Backend & Database",
        description: "Kiểm tra kiến thức về Dependency Injection, Middleware, Interceptors, Pipes và Websockets.",
        totalQuestions: 10,
        durationMinutes: 30,
        participantsCount: 410,
        difficulty: "MEDIUM",
        tag: "NestJS",
    };

    const questions: QuestionItem[] = getPracticeQuestionsByPracticeId(practiceId);

    // Total display cells for matrix palette (36 cells matching official exam)
    const TOTAL_PALETTE_CELLS = 36;
    const paletteNumbers = Array.from({ length: TOTAL_PALETTE_CELLS }, (_, i) => i + 1);

    // Keys for LocalStorage persistence
    const STORAGE_KEY_ANSWERS = `lms_practice_answers_${practiceId}`;
    const STORAGE_KEY_START_TIME = `lms_practice_start_time_${practiceId}`;
    const STORAGE_KEY_SAVED_AT = `lms_practice_last_saved_${practiceId}`;

    const [activeQuestionId, setActiveQuestionId] = useState<number>(1);
    const [answers, setAnswers] = useState<Record<string, UserExamAnswer>>({});
    const [isHydrated, setIsHydrated] = useState(false);
    const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [dots, setDots] = useState("");
    const isInitialMount = useRef(true);

    const [secondsRemaining, setSecondsRemaining] = useState(practiceMeta.durationMinutes * 60);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animate dots when saving (Google Docs style)
    useEffect(() => {
        if (!isSaving) {
            setDots("");
            return;
        }
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 300);
        return () => clearInterval(interval);
    }, [isSaving]);

    // 1. Restore cached answers & last saved time from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const cachedAnswers = localStorage.getItem(STORAGE_KEY_ANSWERS);
            if (cachedAnswers) {
                const parsed = JSON.parse(cachedAnswers);
                if (parsed && typeof parsed === "object") {
                    setAnswers(parsed);
                }
            } else {
                // Default initial answer if none cached
                if (questions[0]) {
                    setAnswers({
                        [questions[0].id]: { questionId: questions[0].id, selectedOptionIds: [questions[0].options?.[0]?.id || ""] },
                    });
                }
            }

            const cachedSavedAt = localStorage.getItem(STORAGE_KEY_SAVED_AT);
            if (cachedSavedAt) {
                setLastSavedTime(cachedSavedAt);
            }
        } catch (err) {
            console.warn("Could not restore practice answers from localStorage:", err);
        } finally {
            setIsHydrated(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [STORAGE_KEY_ANSWERS, STORAGE_KEY_SAVED_AT]);

    // 2. Persist answers to localStorage whenever they change with 1s "Đang lưu..." status
    useEffect(() => {
        if (!isHydrated || typeof window === "undefined") return;
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        try {
            if (Object.keys(answers).length > 0) {
                setIsSaving(true);
                localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));

                const timer = setTimeout(() => {
                    const nowFormatted = new Date().toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    });
                    localStorage.setItem(STORAGE_KEY_SAVED_AT, nowFormatted);
                    setLastSavedTime(nowFormatted);
                    setIsSaving(false);
                }, 1000);

                return () => clearTimeout(timer);
            }
        } catch (err) {
            console.warn("Could not persist practice answers to localStorage:", err);
            setIsSaving(false);
        }
    }, [answers, isHydrated, STORAGE_KEY_ANSWERS, STORAGE_KEY_SAVED_AT]);

    // 3. Countdown timer based on persistent start timestamp
    const handleConfirmSubmit = useCallback(() => {
        setIsSubmitting(true);
        setTimeout(() => {
            if (typeof window !== "undefined") {
                try {
                    localStorage.removeItem(STORAGE_KEY_ANSWERS);
                    localStorage.removeItem(STORAGE_KEY_START_TIME);
                    localStorage.removeItem(STORAGE_KEY_SAVED_AT);
                } catch {
                    // ignore
                }
            }
            setIsSubmitting(false);
            setIsSubmitModalOpen(false);
            router.push(`/practice-public/${practiceId}/result`);
        }, 600);
    }, [practiceId, router, STORAGE_KEY_ANSWERS, STORAGE_KEY_START_TIME, STORAGE_KEY_SAVED_AT]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const totalDurationSec = practiceMeta.durationMinutes * 60;
        let sessionStartTime = Number(localStorage.getItem(STORAGE_KEY_START_TIME));
        const now = Date.now();

        if (!sessionStartTime || isNaN(sessionStartTime)) {
            sessionStartTime = now;
            localStorage.setItem(STORAGE_KEY_START_TIME, String(now));
        }

        const elapsedSec = Math.floor((now - sessionStartTime) / 1000);
        const remainingSec = Math.max(0, totalDurationSec - elapsedSec);
        setSecondsRemaining(remainingSec);

        if (remainingSec <= 0) {
            handleConfirmSubmit();
            return;
        }

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
    }, [practiceMeta.durationMinutes, STORAGE_KEY_START_TIME, handleConfirmSubmit]);

    const formatTime = (secs: number) => {
        const hours = Math.floor(secs / 3600);
        const mins = Math.floor((secs % 3600) / 60);
        const remSecs = secs % 60;
        if (hours > 0) {
            return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`;
        }
        return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`;
    };

    // Handlers for Question Interactions
    const handleSelectSingleOption = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                questionId,
                selectedOptionIds: [optionId],
            },
        }));
    };

    const handleToggleMultipleOption = (questionId: string, optionId: string) => {
        const currentSelected = answers[questionId]?.selectedOptionIds || [];
        const nextSelected = currentSelected.includes(optionId) ? currentSelected.filter((id) => id !== optionId) : [...currentSelected, optionId];

        setAnswers((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                questionId,
                selectedOptionIds: nextSelected,
            },
        }));
    };

    const handleTextChange = (questionId: string, text: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                questionId,
                textAnswer: text,
            },
        }));
    };

    const handleMatchingChange = (questionId: string, pairId: string, matchedVal: string) => {
        const currentMatches = answers[questionId]?.matchingAnswers || {};
        setAnswers((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                questionId,
                matchingAnswers: {
                    ...currentMatches,
                    [pairId]: matchedVal,
                },
            },
        }));
    };

    const handleAddOrderingItem = (questionId: string, item: string) => {
        const currentOrdered = answers[questionId]?.orderedItems || [];
        if (currentOrdered.includes(item)) return;
        setAnswers((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                questionId,
                orderedItems: [...currentOrdered, item],
            },
        }));
    };

    const handleRemoveOrderingItem = (questionId: string, indexToRemove: number) => {
        const currentOrdered = answers[questionId]?.orderedItems || [];
        const nextOrdered = currentOrdered.filter((_, idx) => idx !== indexToRemove);
        setAnswers((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                questionId,
                orderedItems: nextOrdered,
            },
        }));
    };

    const handleResetOrdering = (questionId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                questionId,
                orderedItems: [],
            },
        }));
    };

    const scrollToQuestion = (orderNum: number) => {
        setActiveQuestionId(orderNum);
        const el = document.getElementById(`practice-question-card-${orderNum}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Calculate Answered Count
    const answeredCount = questions.filter((q) => {
        const ans = answers[q.id];
        if (!ans) return false;
        if (ans.selectedOptionIds && ans.selectedOptionIds.length > 0) return true;
        if (ans.textAnswer && ans.textAnswer.trim().length > 0) return true;
        if (ans.matchingAnswers && Object.keys(ans.matchingAnswers).length > 0) return true;
        if (ans.orderedItems && ans.orderedItems.length > 0) return true;
        if (ans.codeAnswer && ans.codeAnswer.trim().length > 0) return true;
        return false;
    }).length;

    const getQuestionTypeBadgeLabel = (type: string) => {
        switch (type) {
            case "SINGLE_CHOICE":
                return "Trắc nghiệm 1 đáp án";
            case "MULTIPLE_CHOICE":
                return "Nhiều đáp án";
            case "ORDERING":
                return "Sắp xếp từ / vế câu";
            case "MATCHING":
                return "Ghép đôi";
            case "FILL_IN_BLANKS":
                return "Điền chỗ trống";
            case "CODING":
                return "Lập trình";
            case "ESSAY":
                return "Tự luận";
            case "EQ":
                return "Đánh giá Cảm xúc EQ";
            case "IQ":
                return "Tư duy Logic IQ";
            default:
                return "Luyện tập";
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
            {/* 1. Header (RikkeiEdu + 5 Navigation Tabs + Candidate Avatar) */}
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
                    <Link href="/" className="transition-colors hover:text-brand-600">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <Link href="/practice" className="transition-colors hover:text-brand-600">
                        Luyện tập
                    </Link>
                    <span>/</span>
                    <span className="line-clamp-1 font-bold text-slate-900">{practiceMeta.title}</span>
                </div>

                <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:gap-12">
                    {/* Left Column: Stacked Questions List */}
                    <div className="w-full max-w-[880px] flex-1 space-y-8">
                        {questions.map((q) => {
                            const ans = answers[q.id];
                            const selectedOptionIds = ans?.selectedOptionIds || [];

                            return (
                                <div
                                    key={q.id}
                                    id={`practice-question-card-${q.orderNumber}`}
                                    className="scroll-mt-24 space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-7"
                                >
                                    {/* Question Header & Points Badge */}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <h2 className="text-lg font-bold tracking-tight text-slate-900">Câu hỏi {q.orderNumber}</h2>
                                                <Badge variant="outline" className="border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                                                    {getQuestionTypeBadgeLabel(q.type)}
                                                </Badge>
                                                {q.type === "EQ" && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                                                        <HeartHandshake className="h-3.5 w-3.5" />
                                                        <span>Trí tuệ Cảm xúc</span>
                                                    </span>
                                                )}
                                                {q.type === "IQ" && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                                                        <Brain className="h-3.5 w-3.5" />
                                                        <span>Tư duy Logic</span>
                                                    </span>
                                                )}
                                            </div>
                                            <Badge className="pointer-events-none border border-brand-200 bg-brand-50 text-xs font-bold text-brand-700 shadow-none">
                                                {q.points} điểm
                                            </Badge>
                                        </div>
                                        <p className="mt-3 text-base leading-relaxed font-semibold text-slate-800">{q.title}</p>
                                    </div>

                                    {/* Question Interaction by Type using 100% Shadcn UI Components */}

                                    {/* TYPE 1: SINGLE CHOICE (Shadcn RadioGroup) */}
                                    {q.type === "SINGLE_CHOICE" && q.options && (
                                        <RadioGroup
                                            value={selectedOptionIds[0] || ""}
                                            onValueChange={(val) => handleSelectSingleOption(q.id, val)}
                                            className="space-y-2.5 pt-2"
                                        >
                                            {q.options.map((opt) => {
                                                const isSelected = selectedOptionIds.includes(opt.id);
                                                return (
                                                    <label
                                                        key={opt.id}
                                                        htmlFor={`practice-radio-${q.id}-${opt.id}`}
                                                        className={cn(
                                                            "flex cursor-pointer items-center gap-3.5 rounded-xl border p-3.5 transition-all",
                                                            isSelected
                                                                ? "border-brand-500 bg-brand-50/50 font-semibold text-slate-900 shadow-2xs"
                                                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                                                        )}
                                                    >
                                                        <RadioGroupItem
                                                            value={opt.id}
                                                            id={`practice-radio-${q.id}-${opt.id}`}
                                                            className="border-slate-400 data-[state=checked]:border-brand-600 data-[state=checked]:text-brand-600"
                                                        />
                                                        <span className="text-sm leading-relaxed select-none sm:text-base">{opt.text}</span>
                                                    </label>
                                                );
                                            })}
                                        </RadioGroup>
                                    )}

                                    {/* TYPE 2: MULTIPLE CHOICE (Shadcn Checkbox) */}
                                    {q.type === "MULTIPLE_CHOICE" && q.options && (
                                        <div className="space-y-2.5 pt-2">
                                            {q.options.map((opt) => {
                                                const isSelected = selectedOptionIds.includes(opt.id);
                                                return (
                                                    <label
                                                        key={opt.id}
                                                        htmlFor={`practice-check-${q.id}-${opt.id}`}
                                                        className={cn(
                                                            "flex cursor-pointer items-center gap-3.5 rounded-xl border p-3.5 transition-all",
                                                            isSelected
                                                                ? "border-brand-500 bg-brand-50/50 font-semibold text-slate-900 shadow-2xs"
                                                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                                                        )}
                                                    >
                                                        <Checkbox
                                                            id={`practice-check-${q.id}-${opt.id}`}
                                                            checked={isSelected}
                                                            onCheckedChange={() => handleToggleMultipleOption(q.id, opt.id)}
                                                            className="h-4.5 w-4.5 rounded-md border-slate-400 data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600"
                                                        />
                                                        <span className="text-sm leading-relaxed select-none sm:text-base">{opt.text}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* TYPE 3: ORDERING (Sắp xếp từ / vế câu) */}
                                    {q.type === "ORDERING" && q.orderingItems && (
                                        <div className="space-y-4 pt-2">
                                            {/* Khung kết quả thứ tự của thí sinh */}
                                            <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-700">Thứ tự sắp xếp của bạn:</span>
                                                    {(ans?.orderedItems?.length ?? 0) > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleResetOrdering(q.id)}
                                                            className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                                                        >
                                                            <RotateCcw className="h-3 w-3" />
                                                            <span>Làm lại</span>
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="flex min-h-[56px] flex-wrap items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white p-3">
                                                    {(ans?.orderedItems?.length ?? 0) === 0 ? (
                                                        <span className="text-xs font-medium text-slate-400 italic">
                                                            Bấm vào các bước bên dưới để thêm vào đây theo đúng thứ tự...
                                                        </span>
                                                    ) : (
                                                        ans?.orderedItems?.map((item, idx) => (
                                                            <button
                                                                key={`${item}-${idx}`}
                                                                type="button"
                                                                onClick={() => handleRemoveOrderingItem(q.id, idx)}
                                                                title="Bấm để bỏ bước này"
                                                                className="group flex cursor-pointer items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50/70 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs transition-all hover:border-brand-300 hover:bg-brand-100 active:scale-95"
                                                            >
                                                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                                                                    {idx + 1}
                                                                </span>
                                                                <span>{item}</span>
                                                                <X className="h-3 w-3 text-slate-400 group-hover:text-brand-600" />
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            {/* Kho từ gợi ý */}
                                            <div className="space-y-2">
                                                <span className="text-xs font-semibold text-slate-500">Các bước cần sắp xếp (bấm vào để chọn):</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {q.orderingItems.map((item, idx) => {
                                                        const isPicked = (ans?.orderedItems ?? []).includes(item);
                                                        return (
                                                            <button
                                                                key={`practice-pool-${item}-${idx}`}
                                                                type="button"
                                                                disabled={isPicked}
                                                                onClick={() => handleAddOrderingItem(q.id, item)}
                                                                className={cn(
                                                                    "rounded-xl border px-3.5 py-2 text-sm font-semibold shadow-2xs transition-all",
                                                                    isPicked
                                                                        ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400 opacity-40"
                                                                        : "cursor-pointer border-slate-200 bg-white text-slate-800 hover:border-brand-500 hover:bg-brand-50/40 active:scale-95",
                                                                )}
                                                            >
                                                                {item}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* TYPE 4: MATCHING (Shadcn Select) */}
                                    {q.type === "MATCHING" && q.matchingPairs && (
                                        <div className="space-y-3 pt-2">
                                            {q.matchingPairs.map((pair) => (
                                                <div
                                                    key={pair.id}
                                                    className="grid grid-cols-1 items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50/60 p-4 md:grid-cols-2"
                                                >
                                                    <div className="text-sm font-semibold text-slate-900">{pair.left}</div>
                                                    <div>
                                                        <Select
                                                            value={ans?.matchingAnswers?.[pair.id] || ""}
                                                            onValueChange={(val) => handleMatchingChange(q.id, pair.id, val)}
                                                        >
                                                            <SelectTrigger className="h-11 w-full rounded-xl border-slate-300 bg-white text-sm">
                                                                <SelectValue placeholder="-- Chọn vai trò phù hợp --" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-xl">
                                                                {q.matchingPairs?.map((p) => (
                                                                    <SelectItem key={p.id} value={p.id} className="text-sm">
                                                                        {p.right}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* TYPE 5: FILL IN THE BLANKS (Shadcn Input) */}
                                    {q.type === "FILL_IN_BLANKS" && (
                                        <div className="space-y-3 pt-2">
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed font-medium text-slate-700">
                                                {q.content}
                                            </div>
                                            <Input
                                                type="text"
                                                placeholder="Nhập câu trả lời điền vào chỗ trống..."
                                                value={ans?.textAnswer || ""}
                                                onChange={(e) => handleTextChange(q.id, e.target.value)}
                                                className="h-11 rounded-xl border-slate-300 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                            />
                                        </div>
                                    )}

                                    {/* TYPE 6: CODING (Monaco Code Editor with syntax highlighting & hidden scrollbar) */}
                                    {q.type === "CODING" && (
                                        <div className="pt-2">
                                            <CodeEditor
                                                value={ans?.codeAnswer !== undefined ? ans.codeAnswer : q.codeTemplate || ""}
                                                onChange={(val) =>
                                                    setAnswers((prev) => ({
                                                        ...prev,
                                                        [q.id]: {
                                                            ...prev[q.id],
                                                            questionId: q.id,
                                                            codeAnswer: val || "",
                                                        },
                                                    }))
                                                }
                                                language={q.language || "javascript"}
                                                height="280px"
                                                hideHeader={true}
                                                hideScrollbar={true}
                                            />
                                        </div>
                                    )}

                                    {/* TYPE 7: ESSAY (Shadcn Textarea) */}
                                    {q.type === "ESSAY" && (
                                        <div className="pt-2">
                                            <Textarea
                                                rows={5}
                                                placeholder="Nhập nội dung phân tích tự luận của bạn tại đây..."
                                                value={ans?.textAnswer || ""}
                                                onChange={(e) => handleTextChange(q.id, e.target.value)}
                                                className="min-h-[130px] rounded-xl border-slate-300 p-3.5 text-sm leading-relaxed focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                            />
                                        </div>
                                    )}

                                    {/* TYPE 8: EQ (Đánh giá Trí tuệ Cảm xúc EQ) */}
                                    {q.type === "EQ" && q.options && (
                                        <div className="space-y-3 pt-2">
                                            <RadioGroup
                                                value={selectedOptionIds[0] || ""}
                                                onValueChange={(val) => handleSelectSingleOption(q.id, val)}
                                                className="space-y-2.5"
                                            >
                                                {q.options.map((opt) => {
                                                    const isSelected = selectedOptionIds.includes(opt.id);
                                                    return (
                                                        <label
                                                            key={opt.id}
                                                            htmlFor={`practice-radio-eq-${q.id}-${opt.id}`}
                                                            className={cn(
                                                                "flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all",
                                                                isSelected
                                                                    ? "border-brand-500 bg-brand-50/50 font-semibold text-slate-900 shadow-2xs"
                                                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                                                            )}
                                                        >
                                                            <RadioGroupItem
                                                                value={opt.id}
                                                                id={`practice-radio-eq-${q.id}-${opt.id}`}
                                                                className="mt-0.5 border-slate-400 data-[state=checked]:border-brand-600 data-[state=checked]:text-brand-600"
                                                            />
                                                            <div className="space-y-1">
                                                                <span className="mr-2 text-sm font-bold text-slate-900">{opt.label}.</span>
                                                                <span className="text-sm leading-relaxed select-none sm:text-base">{opt.text}</span>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </RadioGroup>
                                        </div>
                                    )}

                                    {/* TYPE 9: IQ (Tư duy Logic IQ) */}
                                    {q.type === "IQ" && q.options && (
                                        <div className="space-y-4 pt-2">
                                            {q.content && (
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-relaxed font-semibold whitespace-pre-line text-slate-800 shadow-inner">
                                                    {q.content}
                                                </div>
                                            )}

                                            <RadioGroup
                                                value={selectedOptionIds[0] || ""}
                                                onValueChange={(val) => handleSelectSingleOption(q.id, val)}
                                                className="grid grid-cols-1 gap-3 md:grid-cols-2"
                                            >
                                                {q.options.map((opt) => {
                                                    const isSelected = selectedOptionIds.includes(opt.id);
                                                    return (
                                                        <label
                                                            key={opt.id}
                                                            htmlFor={`practice-radio-iq-${q.id}-${opt.id}`}
                                                            className={cn(
                                                                "flex cursor-pointer items-center gap-3.5 rounded-xl border p-4 transition-all",
                                                                isSelected
                                                                    ? "border-brand-500 bg-brand-50/50 font-semibold text-slate-900 shadow-2xs"
                                                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                                                            )}
                                                        >
                                                            <RadioGroupItem
                                                                value={opt.id}
                                                                id={`practice-radio-iq-${q.id}-${opt.id}`}
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
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Sticky Navigation Palette & Submit CTA using Shadcn Card (Synchronized with Official Exam) */}
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

                                {/* Auto-Save Persistence Status Badge with Tooltip */}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex cursor-help items-center justify-between rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-1.5 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100/60">
                                                <div className="flex items-center gap-1.5">
                                                    {isSaving ? (
                                                        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-emerald-600" />
                                                    ) : (
                                                        <HelpCircle className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                                    )}
                                                    <span>{isSaving ? `Đang lưu${dots || "..."}` : "Kết quả tự động lưu vào máy"}</span>
                                                </div>
                                                {lastSavedTime && <span className="font-mono text-[11px] font-semibold text-emerald-700">{lastSavedTime}</span>}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="bottom"
                                            className="max-w-[280px] rounded-xl bg-slate-900 px-3 py-2 text-center text-xs font-normal text-white shadow-xl"
                                        >
                                            Khi bạn thoát khỏi trang và vào lại, nếu ca thi chưa kết thúc thì kết quả vẫn sẽ được lưu lại
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </CardHeader>

                            {/* 8-Column Matrix Palette with Square Buttons (aspect-square) */}
                            <CardContent className="space-y-5 p-0">
                                <div className="grid grid-cols-6 justify-items-center gap-2 sm:grid-cols-6 lg:grid-cols-8">
                                    {paletteNumbers.map((num) => {
                                        const matchingQuestion = questions.find((q) => q.orderNumber === num);
                                        const isAvailable = Boolean(matchingQuestion);
                                        const isCurrent = activeQuestionId === num;
                                        const hasAnswer = matchingQuestion
                                            ? Boolean(
                                                  (answers[matchingQuestion.id]?.selectedOptionIds &&
                                                      answers[matchingQuestion.id].selectedOptionIds!.length > 0) ||
                                                  (answers[matchingQuestion.id]?.textAnswer && answers[matchingQuestion.id].textAnswer!.trim().length > 0) ||
                                                  (answers[matchingQuestion.id]?.matchingAnswers &&
                                                      Object.keys(answers[matchingQuestion.id].matchingAnswers!).length > 0) ||
                                                  (answers[matchingQuestion.id]?.orderedItems && answers[matchingQuestion.id].orderedItems!.length > 0) ||
                                                  (answers[matchingQuestion.id]?.codeAnswer && answers[matchingQuestion.id].codeAnswer!.trim().length > 0),
                                              )
                                            : false;

                                        return (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => isAvailable && scrollToQuestion(num)}
                                                disabled={!isAvailable}
                                                className={cn(
                                                    "flex aspect-square h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-xs font-bold transition-all sm:h-10 sm:w-10 sm:text-sm",
                                                    isCurrent
                                                        ? "border-2 border-brand-600 bg-white text-brand-700 shadow-xs"
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
                                <strong className="font-bold text-brand-700">
                                    {answeredCount}/{questions.length} câu ({questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0}%)
                                </strong>
                            </div>
                            <Progress value={questions.length > 0 ? (answeredCount / questions.length) * 100 : 0} className="h-2 rounded-full bg-slate-100" />
                        </Card>
                    </div>
                </div>
            </main>

            {/* 3. Submit Confirmation Modal */}
            <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
                <DialogContent size="md" className="max-w-[460px] gap-4 rounded-xl border border-slate-200 bg-white px-[24px] py-[20px] shadow-xl">
                    <DialogHeader className="pb-0 text-center sm:text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                            <FileCheck2 className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900">Xác nhận nộp bài luyện tập</DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                            Bạn đã hoàn thành {answeredCount}/{questions.length} câu hỏi. Bạn có muốn kết thúc và xem bảng phân tích điểm, lời giải chi tiết
                            ngay bây giờ?
                        </DialogDescription>
                    </DialogHeader>

                    {/* Test Summary Box */}
                    <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-left">
                        <p className="line-clamp-1 text-sm font-bold text-slate-900">{practiceMeta.title}</p>
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
                                <span>Xem kết quả & Giải thích</span>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
