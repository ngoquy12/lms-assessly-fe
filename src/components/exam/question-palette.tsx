"use client";

import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuestionItem, UserExamAnswer } from "@/types/exam.types";

export interface QuestionPaletteProps {
    questions: QuestionItem[];
    currentIndex: number;
    answers: Record<string, UserExamAnswer>;
    onSelectQuestion: (index: number) => void;
    className?: string;
}

export function QuestionPalette({ questions, currentIndex, answers, onSelectQuestion, className }: QuestionPaletteProps) {
    const totalAnswered = questions.filter((q) => {
        const ans = answers[q.id];
        return (
            ans &&
            ((ans.selectedOptionIds && ans.selectedOptionIds.length > 0) ||
                (ans.textAnswer && ans.textAnswer.trim().length > 0) ||
                (ans.codeAnswer && ans.codeAnswer.trim().length > 0))
        );
    }).length;

    return (
        <Card size="sm" className={cn("border-gray-200 bg-white", className)}>
            <CardHeader className="border-b border-gray-100 pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-gray-900">Danh sách câu hỏi</CardTitle>
                    <Badge variant="secondary">
                        Đã làm {totalAnswered}/{questions.length}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
                {/* Question buttons matrix */}
                <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, index) => {
                        const isCurrent = index === currentIndex;
                        const ans = answers[q.id];
                        const isAnswered =
                            ans &&
                            ((ans.selectedOptionIds && ans.selectedOptionIds.length > 0) ||
                                (ans.textAnswer && ans.textAnswer.trim().length > 0) ||
                                (ans.codeAnswer && ans.codeAnswer.trim().length > 0));
                        const isFlagged = ans?.isFlagged;

                        return (
                            <button
                                key={q.id}
                                type="button"
                                onClick={() => onSelectQuestion(index)}
                                className={cn(
                                    "relative flex h-10 w-full cursor-pointer items-center justify-center rounded-xl text-xs font-bold transition-all",
                                    isCurrent
                                        ? "bg-brand-600 text-white shadow-sm ring-2 ring-brand-500 ring-offset-2"
                                        : isAnswered
                                          ? "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                                    isFlagged && "ring-1 ring-amber-500",
                                )}
                            >
                                <span>{q.orderNumber}</span>
                                {isFlagged && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-500 text-white">
                                        <Bookmark className="h-2 w-2 fill-current" />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend explanation */}
                <div className="text-2xs space-y-1.5 rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-gray-600">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />
                        <span>Đang làm hiện tại</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <span>Đã hoàn thành câu trả lời</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                        <span>Đã gắn cờ xem lại</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                        <span>Chưa trả lời</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
