"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Flag, Headphones, Loader2, Pause, Play, Volume2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ToeicQuestion {
    id: string;
    num: number;
    part: number;
    partTitle: string;
    title: string;
    options: { id: string; label: string; text: string }[];
}

const MOCK_TOEIC_QUESTIONS: ToeicQuestion[] = [
    {
        id: "tq-1",
        num: 1,
        part: 5,
        partTitle: "Part 5: Incomplete Sentences",
        title: "The quarterly financial report was submitted ______ the finance committee for review.",
        options: [
            { id: "to-1a", label: "A", text: "to" },
            { id: "to-1b", label: "B", text: "at" },
            { id: "to-1c", label: "C", text: "on" },
            { id: "to-1d", label: "D", text: "from" },
        ],
    },
    {
        id: "tq-2",
        num: 2,
        part: 5,
        partTitle: "Part 5: Incomplete Sentences",
        title: "All attendees are required to register ______ arriving at the seminar venue.",
        options: [
            { id: "to-2a", label: "A", text: "prior" },
            { id: "to-2b", label: "B", text: "before" },
            { id: "to-2c", label: "C", text: "earlier" },
            { id: "to-2d", label: "D", text: "ahead" },
        ],
    },
    {
        id: "tq-3",
        num: 3,
        part: 7,
        partTitle: "Part 7: Reading Comprehension",
        title: "What is the primary purpose of the memo sent by the operations department?",
        options: [
            { id: "to-3a", label: "A", text: "To announce new server maintenance protocols and scheduled downtime" },
            { id: "to-3b", label: "B", text: "To recruit additional customer support representatives" },
            { id: "to-3c", label: "C", text: "To celebrate the successful launch of a mobile application" },
            { id: "to-3d", label: "D", text: "To schedule the annual corporate holiday retreat" },
        ],
    },
    {
        id: "tq-4",
        num: 4,
        part: 7,
        partTitle: "Part 7: Reading Comprehension",
        title: "According to the passage, when will the system upgrade officially commence?",
        options: [
            { id: "to-4a", label: "A", text: "On Friday at 11:00 PM" },
            { id: "to-4b", label: "B", text: "On Saturday at 08:00 AM" },
            { id: "to-4c", label: "C", text: "On Sunday at midnight" },
            { id: "to-4d", label: "D", text: "Next Monday morning" },
        ],
    },
];

const SAMPLE_READING_PASSAGE = `
MEMORANDUM
To: All Department Heads and Project Leads
From: IT Infrastructure & Cloud Operations Division
Date: August 24, 2026
Subject: Scheduled Cloud Migration and System Maintenance Window

Please be advised that the Global Cloud Architecture team will perform an extensive system overhaul this coming weekend to enhance data throughput and security compliance across all LMS platforms.

Maintenance Schedule Details:
• Initiation Time: Friday, August 28, 2026 at 11:00 PM (GMT+7)
• Estimated Completion: Saturday, August 29, 2026 at 06:00 AM (GMT+7)
• Affected Services: Internal Assessment Portal, Candidate Grading Service, and Student Record Database.

Action Required:
All faculty members and examiners are advised to save all active grading rubrics and submit pending exam assessments prior to 10:00 PM on Friday. During the maintenance window, the database will operate in read-only mode.

Thank you for your cooperation and patience as we modernize our digital infrastructure.
`;

export function ToeicExamView({ examId }: { examId: string }) {
    const router = useRouter();
    const [answers, setAnswers] = useState<Record<string, string>>({
        "tq-1": "to-1a",
    });
    const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
    const [activeQuestionId, setActiveQuestionId] = useState<number>(1);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [audioProgress, setAudioProgress] = useState(35);
    const [secondsRemaining, setSecondsRemaining] = useState(120 * 60);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirmSubmit = useCallback(() => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitModalOpen(false);
            router.push(`/toeic/${examId}/result`);
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

    const handleSelectOption = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    };

    const toggleFlag = (questionId: string) => {
        setFlaggedQuestions((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
    };

    const scrollToQuestion = (qNum: number) => {
        setActiveQuestionId(qNum);
        const el = document.getElementById(`toeic-q-${qNum}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const answeredCount = Object.keys(answers).length;
    const totalQuestionsCount = 36; // 36 questions in palette
    const paletteNumbers = Array.from({ length: totalQuestionsCount }, (_, i) => i + 1);

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f8fafc] font-sans text-slate-900">
            {/* 1. Sticky Exam Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white shadow-xs">
                <div className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between px-6 sm:px-10">
                    {/* Left: Brand & Exit */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/images/header/logo-rikkei2 1.png"
                                alt="RikkeiEdu"
                                width={110}
                                height={38}
                                className="h-9 w-auto cursor-pointer object-contain"
                                priority
                            />
                        </Link>
                        <div className="hidden items-center gap-2 border-l border-slate-200 pl-6 md:flex">
                            <span className="text-sm font-bold text-slate-900">[TEST] TOEIC (21/08)</span>
                            <Badge variant="outline" className="border-red-200 bg-[#fff6f7] text-xs font-semibold text-[#ab1f24]">
                                Full Test 200 câu
                            </Badge>
                        </div>
                    </div>

                    {/* Right: Timer & Submit CTA */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 font-mono text-base font-bold text-white shadow-xs">
                            <span className="font-sans text-xs font-normal text-slate-400">Còn lại:</span>
                            <span>{formatTime(secondsRemaining)}</span>
                        </div>

                        <Button
                            type="button"
                            onClick={() => setIsSubmitModalOpen(true)}
                            className="h-10 rounded-xl bg-[#ab1f24] px-5 font-bold text-white shadow-xs hover:bg-[#9c1b20] active:scale-98"
                        >
                            <span>Nộp bài</span>
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* 2. Main Body: Split-Screen Layout */}
            <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-6 sm:px-10">
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    {/* Left Column (5 Cols): Audio Player & Reading Passage */}
                    <div className="max-h-[calc(100vh-120px)] space-y-6 overflow-y-auto pr-1 lg:sticky lg:top-24 lg:col-span-6">
                        {/* Listening Player Simulator */}
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                    <Headphones className="h-4 w-4 text-[#ab1f24]" />
                                    <span>Listening Audio Track · TOEIC Section 1</span>
                                </div>
                                <span className="font-mono text-xs text-slate-400">03:45 / 45:00</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#ab1f24] text-white shadow-xs transition-transform hover:bg-[#9c1b20] active:scale-95"
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
                                        <div className="h-full rounded-full bg-[#ab1f24] transition-all" style={{ width: `${audioProgress}%` }} />
                                    </div>
                                    <div className="flex justify-between font-mono text-[10px] text-slate-400">
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

                        {/* Reading Passage Container */}
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <Badge variant="secondary" className="bg-slate-100 text-xs font-semibold text-slate-700">
                                    Reading Passage · Questions 3 - 4
                                </Badge>
                                <span className="text-xs text-slate-400">Đoạn văn 185 từ</span>
                            </div>

                            <div className="prose max-w-none rounded-xl border border-slate-200/60 bg-slate-50/60 p-5 font-serif text-sm leading-relaxed whitespace-pre-wrap text-slate-700 prose-slate">
                                {SAMPLE_READING_PASSAGE}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (6 Cols): Question Cards & Quick Matrix Palette */}
                    <div className="space-y-8 lg:col-span-6">
                        {/* Questions List */}
                        <div className="space-y-6">
                            {MOCK_TOEIC_QUESTIONS.map((q) => {
                                const selectedOpt = answers[q.id];
                                const isFlagged = flaggedQuestions[q.id];

                                return (
                                    <div
                                        key={q.id}
                                        id={`toeic-q-${q.num}`}
                                        className={`scroll-mt-24 space-y-4 rounded-2xl border bg-white p-6 shadow-xs transition-all ${
                                            activeQuestionId === q.num ? "border-slate-400 ring-2 ring-slate-200" : "border-slate-200/80"
                                        }`}
                                    >
                                        {/* Question Card Header */}
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-bold text-[#ab1f24]">Question {q.num}</span>
                                                <Badge variant="outline" className="bg-slate-50 text-[11px] font-semibold text-slate-700">
                                                    {q.partTitle}
                                                </Badge>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => toggleFlag(q.id)}
                                                className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                                                    isFlagged
                                                        ? "border-amber-400 bg-amber-50 text-amber-700"
                                                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                                }`}
                                            >
                                                <Flag className={`h-3.5 w-3.5 ${isFlagged ? "fill-amber-500 text-amber-500" : ""}`} />
                                                <span>{isFlagged ? "Đã gắn cờ" : "Gắn cờ"}</span>
                                            </button>
                                        </div>

                                        {/* Question Text */}
                                        <p className="text-[15px] leading-relaxed font-semibold text-slate-900">{q.title}</p>

                                        {/* 4 Bubble Options (A, B, C, D) */}
                                        <div className="space-y-2.5 pt-1">
                                            {q.options.map((opt) => {
                                                const isSelected = selectedOpt === opt.id;
                                                return (
                                                    <div
                                                        key={opt.id}
                                                        onClick={() => handleSelectOption(q.id, opt.id)}
                                                        className={`flex cursor-pointer items-center gap-3.5 rounded-xl border p-3 transition-all ${
                                                            isSelected
                                                                ? "border-[#007aff] bg-[#f0f7ff] font-medium text-[#1e2328] shadow-2xs"
                                                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        {/* Bubble Letter */}
                                                        <div
                                                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                                                isSelected ? "bg-[#007aff] text-white" : "border border-slate-300 bg-slate-100 text-slate-600"
                                                            }`}
                                                        >
                                                            {opt.label}
                                                        </div>
                                                        <span className="text-sm select-none">{opt.text}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Sticky Palette & Quick Nav */}
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900">Bảng câu hỏi nhanh (Palette)</h3>
                                <span className="text-xs font-semibold text-slate-500">
                                    Đã trả lời: <strong className="text-[#ab1f24]">{answeredCount}</strong>/{totalQuestionsCount}
                                </span>
                            </div>

                            {/* 8-Column Grid */}
                            <div className="grid grid-cols-8 gap-2">
                                {paletteNumbers.map((num) => {
                                    const matchingQ = MOCK_TOEIC_QUESTIONS.find((q) => q.num === num);
                                    const isAvailable = Boolean(matchingQ);
                                    const hasAnswer = matchingQ && Boolean(answers[matchingQ.id]);
                                    const isFlagged = matchingQ && Boolean(flaggedQuestions[matchingQ.id]);
                                    const isCurrent = activeQuestionId === num;

                                    return (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => isAvailable && scrollToQuestion(num)}
                                            disabled={!isAvailable}
                                            className={`relative flex h-9 w-full cursor-pointer items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                                isCurrent
                                                    ? "border-2 border-[#ab1f24] bg-white font-black text-[#ab1f24]"
                                                    : hasAnswer
                                                      ? "border border-emerald-500 bg-emerald-50 text-emerald-800"
                                                      : isFlagged
                                                        ? "border border-amber-400 bg-amber-50 text-amber-800"
                                                        : isAvailable
                                                          ? "border border-slate-200 text-slate-700 hover:bg-slate-50"
                                                          : "cursor-not-allowed border border-slate-100 text-slate-300 opacity-60"
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <Button
                                    type="button"
                                    onClick={() => setIsSubmitModalOpen(true)}
                                    className="h-12 w-full rounded-xl bg-[#ab1f24] text-base font-bold text-white shadow-xs hover:bg-[#9c1b20] active:scale-98"
                                >
                                    <span>Nộp bài & Chấm điểm</span>
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 3. Submit Confirmation Modal (Matching standardized modal) */}
            <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
                <DialogContent className="max-w-[560px] rounded-3xl border-0 bg-white p-8 shadow-2xl sm:p-10">
                    <div className="space-y-6 text-center">
                        <DialogHeader className="space-y-3 p-0 text-center sm:text-center">
                            <DialogTitle className="text-center text-[32px] font-bold tracking-tight text-[#2d2c2c]">Xác nhận nộp bài</DialogTitle>
                            <p className="w-full text-center text-[18px] font-normal text-[#2d2c2c]">Bạn có chắc chắn muốn nộp bài thi TOEIC không?</p>
                        </DialogHeader>

                        <div className="mx-auto w-fit max-w-full space-y-1.5 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-6 py-3.5 text-left shadow-2xs">
                            <p className="text-[15px] whitespace-nowrap text-[#374151]">
                                <strong className="font-semibold text-[#1e2328]">Bài test:</strong> [TEST] TOEIC (21/08)
                            </p>
                            <p className="text-[15px] text-[#374151]">
                                <strong className="font-semibold text-[#1e2328]">Số câu đã làm:</strong> {answeredCount}/{totalQuestionsCount}
                            </p>
                        </div>

                        <p className="text-center text-[17px] font-normal text-[#2d2c2c]">
                            Sau khi nộp, bạn sẽ <span className="font-bold text-[#ab1f24]">không thể thay đổi đáp án</span>
                        </p>

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
