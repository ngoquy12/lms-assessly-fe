"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Code2, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MOCK_EXAM_QUESTIONS, MOCK_EXAM_SESSION } from "@/mocks/exam.mock";
import type { UserExamAnswer } from "@/types/exam.types";

export function ExamTakingView({ examId }: { examId: string }) {
    const router = useRouter();
    const exam = MOCK_EXAM_SESSION;
    const questions = MOCK_EXAM_QUESTIONS;

    const [activeQuestionId, setActiveQuestionId] = useState<number>(1);
    const [answers, setAnswers] = useState<Record<string, UserExamAnswer>>({
        "q-1": { questionId: "q-1", selectedOptionIds: ["opt-1a"] },
    });
    const [secondsRemaining, setSecondsRemaining] = useState(exam.durationMinutes * 60);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirmSubmit = useCallback(() => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitModalOpen(false);
            router.push(`/exam/${examId}/result`);
        }, 800);
    }, [examId, router]);

    // Timer Countdown
    useEffect(() => {
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
    }, [handleConfirmSubmit]);

    const formatTime = (secs: number) => {
        const hours = Math.floor(secs / 3600);
        const mins = Math.floor((secs % 3600) / 60);
        const remSecs = secs % 60;
        return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`;
    };

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

    const scrollToQuestion = (orderNum: number) => {
        setActiveQuestionId(orderNum);
        const el = document.getElementById(`question-card-${orderNum}`);
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
        return false;
    }).length;

    // Total display cells for matrix palette (36 cells as in UI screenshot)
    const TOTAL_PALETTE_CELLS = 36;
    const paletteNumbers = Array.from({ length: TOTAL_PALETTE_CELLS }, (_, i) => i + 1);

    return (
        <div className="min-h-screen w-full bg-white font-sans text-[#1e2328]">
            {/* 1. Header (RikkeiEdu + 5 Navigation Tabs + Candidate Name & Avatar) */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <div className="relative mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 sm:px-10">
                    {/* Left: Brand Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/images/header/logo-rikkei2 1.png"
                                alt="RikkeiEdu"
                                width={114}
                                height={40}
                                className="h-10 w-auto cursor-pointer object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Center: 5 Nav Tabs */}
                    <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex">
                        <Link href="/page-exam" className="text-[16px] font-semibold text-[#ab1f24]">
                            Khảo thí
                        </Link>
                        <Link href="/toeic" className="text-[16px] font-medium text-[#1e2328] transition-colors hover:text-[#ab1f24]">
                            TOEIC
                        </Link>
                        <Link
                            href="/competency-assessment"
                            className="relative flex items-center text-[16px] font-medium text-[#1e2328] transition-colors hover:text-[#ab1f24]"
                        >
                            <span>Khởi nguyên</span>
                            <span className="absolute -top-2 left-full ml-0.5 rounded bg-[#ab1f24] px-1 py-0.5 text-[8px] leading-none font-semibold text-white">
                                new
                            </span>
                        </Link>
                        <Link href="/exam-result" className="text-[16px] font-medium text-[#1e2328] transition-colors hover:text-[#ab1f24]">
                            Hoạt động
                        </Link>
                        <Link href="/interview" className="text-[16px] font-medium text-[#1e2328] transition-colors hover:text-[#ab1f24]">
                            Interview
                        </Link>
                    </nav>

                    {/* Right: Candidate Profile Info */}
                    <div className="flex items-center gap-3">
                        <span className="hidden text-[16px] font-semibold text-[#1e2328] sm:inline-block">{exam.candidateName}</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-amber-400 to-rose-500 font-bold text-white shadow-xs">
                            😊
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Main Exam Body */}
            <main className="mx-auto max-w-[1440px] px-6 py-10 sm:px-10">
                <div className="flex flex-col items-start justify-between gap-12 lg:flex-row">
                    {/* Left Column: Stacked Questions List */}
                    <div className="w-full max-w-[880px] flex-1 space-y-12">
                        {questions.map((q) => {
                            const ans = answers[q.id];
                            const selectedOptionIds = ans?.selectedOptionIds || [];

                            return (
                                <div
                                    key={q.id}
                                    id={`question-card-${q.orderNumber}`}
                                    className="scroll-mt-28 space-y-4 border-b border-gray-100/80 pt-2 pb-10 last:border-b-0"
                                >
                                    {/* Question Title & Type Label */}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-[18px] font-bold tracking-tight text-[#007aff]">Câu hỏi {q.orderNumber}</h2>
                                            <Badge variant="secondary" className="text-xs font-semibold text-gray-600">
                                                {q.points} điểm
                                            </Badge>
                                        </div>
                                        <p className="mt-2 text-[16px] leading-relaxed font-semibold text-[#1e2328]">{q.title}</p>
                                    </div>

                                    {/* Question Interaction by Type using Shadcn UI Components */}

                                    {/* TYPE 1: SINGLE CHOICE (Shadcn RadioGroup) */}
                                    {q.type === "SINGLE_CHOICE" && q.options && (
                                        <RadioGroup
                                            value={selectedOptionIds[0] || ""}
                                            onValueChange={(val) => handleSelectSingleOption(q.id, val)}
                                            className="space-y-3 pt-2"
                                        >
                                            {q.options.map((opt) => {
                                                const isSelected = selectedOptionIds.includes(opt.id);
                                                return (
                                                    <label
                                                        key={opt.id}
                                                        htmlFor={`radio-${q.id}-${opt.id}`}
                                                        className={`flex cursor-pointer items-center gap-4 rounded-xl p-3.5 transition-all ${
                                                            isSelected
                                                                ? "bg-[#e5e7eb]/80 font-medium text-[#1e2328] shadow-2xs"
                                                                : "text-[#374151] hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        <RadioGroupItem
                                                            value={opt.id}
                                                            id={`radio-${q.id}-${opt.id}`}
                                                            className="h-5 w-5 border-gray-400 data-[state=checked]:border-[#007aff] data-[state=checked]:text-[#007aff]"
                                                        />
                                                        <span className="text-[16px] select-none">{opt.text}</span>
                                                    </label>
                                                );
                                            })}
                                        </RadioGroup>
                                    )}

                                    {/* TYPE 2: MULTIPLE CHOICE (Shadcn Checkbox) */}
                                    {q.type === "MULTIPLE_CHOICE" && q.options && (
                                        <div className="space-y-3 pt-2">
                                            {q.options.map((opt) => {
                                                const isSelected = selectedOptionIds.includes(opt.id);
                                                return (
                                                    <label
                                                        key={opt.id}
                                                        htmlFor={`check-${q.id}-${opt.id}`}
                                                        className={`flex cursor-pointer items-center gap-4 rounded-xl p-3.5 transition-all ${
                                                            isSelected
                                                                ? "bg-[#e5e7eb]/80 font-medium text-[#1e2328] shadow-2xs"
                                                                : "text-[#374151] hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        <Checkbox
                                                            id={`check-${q.id}-${opt.id}`}
                                                            checked={isSelected}
                                                            onCheckedChange={() => handleToggleMultipleOption(q.id, opt.id)}
                                                            className="h-5 w-5 rounded-md border-gray-400 data-[state=checked]:border-[#007aff] data-[state=checked]:bg-[#007aff]"
                                                        />
                                                        <span className="text-[16px] select-none">{opt.text}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* TYPE 3: FILL IN THE BLANKS (Shadcn Input) */}
                                    {q.type === "FILL_IN_BLANKS" && (
                                        <div className="space-y-4 pt-2">
                                            <p className="rounded-xl border border-gray-200/60 bg-gray-50 p-4 text-[15px] text-gray-700">{q.content}</p>
                                            <Input
                                                type="text"
                                                placeholder="Nhập câu trả lời điền vào chỗ trống..."
                                                value={ans?.textAnswer || ""}
                                                onChange={(e) => handleTextChange(q.id, e.target.value)}
                                                className="h-12 border-gray-300 text-[16px] focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]"
                                            />
                                        </div>
                                    )}

                                    {/* TYPE 4: MATCHING (Ghép đôi) */}
                                    {q.type === "MATCHING" && q.matchingPairs && (
                                        <div className="space-y-3 pt-2">
                                            {q.matchingPairs.map((pair) => (
                                                <div
                                                    key={pair.id}
                                                    className="grid grid-cols-1 items-center gap-4 rounded-xl border border-gray-200/70 bg-gray-50/70 p-4 md:grid-cols-2"
                                                >
                                                    <div className="text-[15px] font-semibold text-[#1e2328]">{pair.left}</div>
                                                    <div>
                                                        <select
                                                            value={ans?.matchingAnswers?.[pair.id] || ""}
                                                            onChange={(e) => handleMatchingChange(q.id, pair.id, e.target.value)}
                                                            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#007aff]"
                                                        >
                                                            <option value="">-- Chọn định nghĩa phù hợp --</option>
                                                            {q.matchingPairs?.map((p) => (
                                                                <option key={p.id} value={p.id}>
                                                                    {p.right}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* TYPE 5: ESSAY (Tự luận) */}
                                    {q.type === "ESSAY" && (
                                        <div className="pt-2">
                                            <textarea
                                                rows={4}
                                                placeholder="Nhập nội dung trình bày của bạn tại đây..."
                                                value={ans?.textAnswer || ""}
                                                onChange={(e) => handleTextChange(q.id, e.target.value)}
                                                className="w-full rounded-xl border border-gray-300 p-4 text-[15px] leading-relaxed outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]"
                                            />
                                        </div>
                                    )}

                                    {/* TYPE 6: CODING (Lập trình) */}
                                    {q.type === "CODING" && (
                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                                    <Code2 className="h-4 w-4 text-[#ab1f24]" />
                                                    <span>Ngôn ngữ: JavaScript (ES6)</span>
                                                </span>
                                            </div>
                                            <div className="overflow-hidden rounded-xl border border-slate-700 bg-[#1e1e1e] p-4 font-mono text-sm text-emerald-400">
                                                <textarea
                                                    rows={8}
                                                    value={ans?.codeAnswer || q.codeTemplate || ""}
                                                    onChange={(e) =>
                                                        setAnswers((prev) => ({
                                                            ...prev,
                                                            [q.id]: {
                                                                ...prev[q.id],
                                                                questionId: q.id,
                                                                codeAnswer: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                    className="w-full resize-y bg-transparent font-mono text-sm text-emerald-400 outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Sticky Navigation Palette & Submit CTA using Shadcn Card */}
                    <div className="sticky top-24 w-full shrink-0 space-y-6 lg:w-[380px]">
                        <Card className="space-y-6 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs">
                            {/* Palette Header with Timer */}
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100 p-0 pb-4">
                                <CardTitle className="text-[17px] font-bold text-[#1e2328]">Danh sách câu hỏi</CardTitle>
                                <div className="font-mono text-[18px] font-bold text-[#1e2328]">{formatTime(secondsRemaining)}</div>
                            </CardHeader>

                            {/* 8-Column Matrix Palette */}
                            <CardContent className="space-y-6 p-0">
                                <div className="grid grid-cols-8 gap-2">
                                    {paletteNumbers.map((num) => {
                                        const matchingQuestion = questions.find((q) => q.orderNumber === num);
                                        const isAvailable = Boolean(matchingQuestion);
                                        const isCurrent = activeQuestionId === num;
                                        const hasAnswer = matchingQuestion
                                            ? Boolean(
                                                  (answers[matchingQuestion.id]?.selectedOptionIds &&
                                                      answers[matchingQuestion.id].selectedOptionIds!.length > 0) ||
                                                  answers[matchingQuestion.id]?.textAnswer ||
                                                  answers[matchingQuestion.id]?.matchingAnswers ||
                                                  answers[matchingQuestion.id]?.codeAnswer,
                                              )
                                            : false;

                                        return (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => isAvailable && scrollToQuestion(num)}
                                                disabled={!isAvailable}
                                                className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-sm text-sm font-medium transition-all ${
                                                    isCurrent
                                                        ? "border-2 border-[#ab1f24] bg-white font-bold text-[#ab1f24]"
                                                        : hasAnswer
                                                          ? "border border-emerald-500 bg-emerald-50 font-semibold text-emerald-800"
                                                          : isAvailable
                                                            ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                            : "cursor-not-allowed border border-gray-200 text-gray-400 opacity-60"
                                                }`}
                                            >
                                                {num}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Submit Exam Button using Shadcn Button */}
                                <div>
                                    <Button
                                        type="button"
                                        size="lg"
                                        onClick={() => setIsSubmitModalOpen(true)}
                                        className="h-12 w-full cursor-pointer gap-2 rounded-lg bg-[#ab1f24] text-[16px] font-bold text-white shadow-xs hover:bg-[#8b1a1f] active:scale-98"
                                    >
                                        <span>Nộp bài</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Progress Quick Card with Shadcn Progress */}
                        <Card className="space-y-2 rounded-xl border border-gray-200/70 bg-gray-50 p-4 text-xs text-gray-600">
                            <div className="flex justify-between font-medium">
                                <span>Tiến độ làm bài:</span>
                                <strong className="font-bold text-[#ab1f24]">
                                    {answeredCount} / {questions.length} câu
                                </strong>
                            </div>
                            <Progress value={(answeredCount / questions.length) * 100} size="sm" className="bg-gray-200" />
                        </Card>
                    </div>
                </div>
            </main>

            {/* 3. Submit Confirmation Modal (Exact design matching user reference image) */}
            <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
                <DialogContent className="max-w-[560px] rounded-3xl border-0 bg-white p-8 shadow-2xl sm:p-10">
                    <div className="space-y-6 text-center">
                        {/* Title */}
                        <DialogHeader className="space-y-3 p-0 text-center sm:text-center">
                            <DialogTitle className="text-center text-[32px] font-bold tracking-tight text-[#2d2c2c]">Xác nhận nộp bài</DialogTitle>
                            <p className="w-full text-center text-[18px] font-normal text-[#2d2c2c]">Bạn có chắc chắn muốn nộp bài không?</p>
                        </DialogHeader>

                        {/* Test Info Box (Auto-expands to text width) */}
                        <div className="mx-auto w-fit max-w-full space-y-1.5 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-6 py-3.5 text-left shadow-2xs">
                            <p className="text-[15px] whitespace-nowrap text-[#374151]">
                                <strong className="font-semibold text-[#1e2328]">Bài test:</strong> {exam.title || "Bài thi"}
                            </p>
                            <p className="text-[15px] text-[#374151]">
                                <strong className="font-semibold text-[#1e2328]">Số câu hỏi:</strong> {questions.length}
                            </p>
                        </div>

                        {/* Warning notice */}
                        <p className="text-center text-[17px] font-normal text-[#2d2c2c]">
                            Sau khi nộp, bạn sẽ <span className="font-bold text-[#ab1f24]">không thể thay đổi đáp án</span>
                        </p>

                        {/* 2 Action Buttons */}
                        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => setIsSubmitModalOpen(false)}
                                disabled={isSubmitting}
                                className="h-12 w-full cursor-pointer rounded-xl border border-[#ab1f24] bg-white text-[16px] font-bold text-[#ab1f24] transition-all hover:bg-red-50/60 active:scale-98 sm:w-[215px]"
                            >
                                Tiếp tục làm bài
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSubmit}
                                disabled={isSubmitting}
                                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ab1f24] text-[16px] font-bold text-white shadow-xs transition-all hover:bg-[#8b1a1f] active:scale-98 sm:w-[215px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Đang nộp...</span>
                                    </>
                                ) : (
                                    <span>Nộp bài</span>
                                )}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
