"use client";

import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MultipleChoiceQuestion } from "@/components/exam/questions/multiple-choice-question";
import { SingleChoiceQuestion } from "@/components/exam/questions/single-choice-question";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useExamQuestions } from "@/hooks/queries/use-exam";
import type { UserExamAnswer } from "@/types/exam.types";

export function PracticeExamPublicView({ practiceId }: { practiceId: string }) {
    const router = useRouter();
    const { data, isLoading, isError, refetch } = useExamQuestions();
    const questions = (data ?? []).slice(0, 3); // Practice sample
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, UserExamAnswer>>({});

    const currentQuestion = questions[currentIndex];
    const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

    const updateAnswer = (partial: Partial<UserExamAnswer>) => {
        if (!currentQuestion) return;
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: {
                ...prev[currentQuestion.id],
                questionId: currentQuestion.id,
                ...partial,
            },
        }));
    };

    const handleFinishPractice = () => {
        router.push(`/practice-public/${practiceId}/result`);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                    <Link href="/practice" className="flex items-center gap-2 text-xs text-gray-500 hover:text-brand-600">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Thoát luyện tập</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">Chế độ luyện tập tự do</Badge>
                        <Badge variant="primary">
                            Câu {currentIndex + 1}/{questions.length}
                        </Badge>
                    </div>
                </div>

                <QueryStateBoundary isLoading={isLoading} isError={isError} onRetry={refetch}>
                    {/* Question Box */}
                    {currentQuestion && (
                        <Card size="md" className="shadow-card-sm border-gray-200">
                            <CardHeader className="border-b border-gray-100 pb-4">
                                <h2 className="text-base leading-relaxed font-bold text-gray-900">
                                    {currentQuestion.orderNumber}. {currentQuestion.title}
                                </h2>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {currentQuestion.type === "SINGLE_CHOICE" ? (
                                    <SingleChoiceQuestion
                                        question={currentQuestion}
                                        answer={currentAnswer}
                                        onAnswerChange={(optId) => updateAnswer({ selectedOptionIds: [optId] })}
                                    />
                                ) : (
                                    <MultipleChoiceQuestion
                                        question={currentQuestion}
                                        answer={currentAnswer}
                                        onAnswerChange={(optIds) => updateAnswer({ selectedOptionIds: optIds })}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                        <Button variant="outline" onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))} disabled={currentIndex === 0}>
                            Câu trước
                        </Button>

                        {currentIndex < questions.length - 1 ? (
                            <Button onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}>Câu tiếp theo</Button>
                        ) : (
                            <Button variant="success" onClick={handleFinishPractice} className="gap-2">
                                <Send className="h-4 w-4" />
                                <span>Hoàn thành & Xem giải thích</span>
                            </Button>
                        )}
                    </div>
                </QueryStateBoundary>
            </div>
        </div>
    );
}
