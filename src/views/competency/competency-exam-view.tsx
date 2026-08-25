"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, FileCheck2, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeaderNav } from "@/components/layout/header-nav";
import { HeaderUserActions } from "@/components/layout/header-user-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCompetencyQuestions } from "@/hooks/queries/use-competency";
import { cn } from "@/lib/utils";

export function CompetencyExamView({ testId }: { testId: string }) {
    const router = useRouter();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    const { data: questionsData } = useCompetencyQuestions();
    const questions = questionsData ?? [];
    const currentQ = questions[currentIndex];

    // LocalStorage recovery
    useEffect(() => {
        try {
            const saved = localStorage.getItem(`competency_answers_${testId}`);
            if (saved) {
                setAnswers(JSON.parse(saved));
            }
        } catch {
            // Ignore storage parse error
        }
    }, [testId]);

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeftSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(timeLeftSeconds / 60);
    const seconds = timeLeftSeconds % 60;
    const timeDisplay = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    const handleSelectOption = (qId: string, optId: string) => {
        const updated = { ...answers, [qId]: optId };
        setAnswers(updated);
        try {
            localStorage.setItem(`competency_answers_${testId}`, JSON.stringify(updated));
        } catch {
            // Storage quota handled
        }
    };

    const handleConfirmSubmit = () => {
        setIsSubmitModalOpen(false);
        router.push(`/competency-assessment/${testId}/result`);
    };

    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-slate-900">
            {/* 1. Header (Brand Logo + 5 Navigation Tabs + Candidate Avatar) */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white shadow-2xs">
                <div className="relative mx-auto flex h-18 max-w-[1440px] items-center justify-between px-6 sm:px-10">
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
                    <Link href="/competency-assessment" className="transition-colors hover:text-[#ab1f24]">
                        Khởi nguyên
                    </Link>
                    <span>/</span>
                    <span className="font-bold text-slate-900">Bài đánh giá năng lực</span>
                </div>

                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                    {/* Left Column: Question Content */}
                    <div className="w-full max-w-[880px] flex-1 space-y-6">
                        {currentQ && (
                            <Card className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                                <CardHeader className="border-b border-slate-100 p-0 pb-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="border-red-200 bg-red-50 text-xs font-bold text-[#ab1f24]">
                                                Câu hỏi #{currentQ.num}
                                            </Badge>
                                            <span className="text-xs font-semibold text-slate-500">{currentQ.category}</span>
                                        </div>

                                        <div className="flex items-center gap-1 text-xs font-medium text-emerald-700">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>Tự động lưu bài làm</span>
                                        </div>
                                    </div>

                                    <CardTitle className="pt-2 text-base leading-relaxed font-bold text-slate-900 sm:text-lg">{currentQ.title}</CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4 p-0">
                                    <RadioGroup
                                        value={answers[currentQ.id] || ""}
                                        onValueChange={(val) => handleSelectOption(currentQ.id, val)}
                                        className="space-y-3"
                                    >
                                        {currentQ.options.map((opt) => {
                                            const isSelected = answers[currentQ.id] === opt.id;
                                            return (
                                                <label
                                                    key={opt.id}
                                                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-xs transition-all sm:text-sm ${
                                                        isSelected
                                                            ? "border-[#ab1f24] bg-red-50/50 shadow-xs ring-1 ring-[#ab1f24]"
                                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                                                    }`}
                                                >
                                                    <RadioGroupItem value={opt.id} id={opt.id} className="mt-0.5 text-[#ab1f24]" />
                                                    <div className="space-y-0.5 leading-relaxed">
                                                        <span className="font-bold text-slate-900">{opt.label}. </span>
                                                        <span className="font-medium text-slate-800">{opt.text}</span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </RadioGroup>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                                            disabled={currentIndex === 0}
                                            className="h-10 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 sm:text-sm"
                                        >
                                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                                            <span>Câu trước</span>
                                        </Button>

                                        {currentIndex < questions.length - 1 ? (
                                            <Button
                                                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                                                className="h-10 rounded-xl bg-[#ab1f24] px-5 text-xs font-bold text-white shadow-xs hover:bg-[#8b1a1f] sm:text-sm"
                                            >
                                                <span>Câu tiếp theo</span>
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => setIsSubmitModalOpen(true)}
                                                className="h-10 gap-1.5 rounded-xl bg-emerald-600 px-5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 sm:text-sm"
                                            >
                                                <Send className="h-4 w-4" />
                                                <span>Nộp bài & Xem kết quả</span>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Sticky Sidebar Palette */}
                    <div className="w-full shrink-0 space-y-5 lg:w-80">
                        {/* 1. Candidate Info Card */}
                        <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-11 w-11 border border-slate-200 shadow-2xs">
                                    <AvatarFallback className="bg-red-50 text-sm font-bold text-[#ab1f24]">BH</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Bảo Hoàng 01</h3>
                                    <p className="font-mono text-xs text-slate-500">SBD: SBD-042 • K23</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Countdown Timer Card */}
                        <div
                            className={cn(
                                "space-y-1 rounded-2xl border p-5 text-center shadow-2xs transition-colors",
                                timeLeftSeconds <= 60
                                    ? "animate-pulse border-red-300 bg-red-100/90 text-[#ab1f24]"
                                    : timeLeftSeconds <= 300
                                      ? "border-amber-200 bg-amber-50/80 text-amber-700"
                                      : "border-red-200/80 bg-red-50/50 text-[#ab1f24]",
                            )}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Clock className={cn("h-5 w-5", timeLeftSeconds <= 300 && timeLeftSeconds > 60 ? "text-amber-600" : "text-[#ab1f24]")} />
                                <span className="text-xs font-bold">Thời gian còn lại</span>
                            </div>
                            <div
                                className={cn(
                                    "font-mono text-3xl font-bold tracking-wider",
                                    timeLeftSeconds <= 300 && timeLeftSeconds > 60 ? "text-amber-700" : "text-[#ab1f24]",
                                )}
                            >
                                {timeDisplay}
                            </div>
                        </div>

                        {/* 3. Question Palette Matrix (Strictly Square Buttons) */}
                        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="text-xs font-bold text-slate-800">Danh sách câu hỏi</span>
                                <span className="text-xs font-bold text-emerald-700">
                                    Đã làm: {answeredCount}/{questions.length}
                                </span>
                            </div>

                            <div className="grid grid-cols-5 gap-2.5">
                                {questions.map((q, idx) => {
                                    const isCurrent = currentIndex === idx;
                                    const isAnswered = Boolean(answers[q.id]);

                                    return (
                                        <button
                                            key={q.id}
                                            type="button"
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`flex aspect-square h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-xs font-bold transition-all sm:h-10 sm:w-10 sm:text-sm ${
                                                isCurrent
                                                    ? "border-2 border-[#ab1f24] bg-red-50 text-[#ab1f24] shadow-xs"
                                                    : isAnswered
                                                      ? "border border-emerald-300 bg-emerald-50 text-emerald-700"
                                                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                onClick={() => setIsSubmitModalOpen(true)}
                                className="h-11 w-full gap-2 rounded-xl bg-[#ab1f24] text-sm font-bold text-white shadow-xs hover:bg-[#8b1a1f]"
                            >
                                <FileCheck2 className="h-4 w-4" />
                                <span>Nộp bài đánh giá</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 4. Submit Confirmation Dialog (Padding 20px 24px, Max Radius 12px) */}
                <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
                    <DialogContent size="md" className="max-w-[460px] gap-4 rounded-xl border border-slate-200 bg-white px-[24px] py-[20px] shadow-xl">
                        <DialogHeader className="pb-0 text-center sm:text-center">
                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#ab1f24]">
                                <FileCheck2 className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-slate-900">Xác nhận nộp bài đánh giá</DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Bạn đã hoàn thành {answeredCount}/{questions.length} câu hỏi. Bạn có chắc chắn muốn kết thúc bài đánh giá?
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="flex-row items-center justify-center gap-2.5 pt-2 sm:justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsSubmitModalOpen(false)}
                                className="h-10 flex-1 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
                            >
                                Làm tiếp
                            </Button>
                            <Button
                                type="button"
                                onClick={handleConfirmSubmit}
                                className="h-10 flex-1 rounded-xl bg-[#ab1f24] text-xs font-bold text-white shadow-xs hover:bg-[#8b1a1f] sm:text-sm"
                            >
                                <span>Xác nhận nộp</span>
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
