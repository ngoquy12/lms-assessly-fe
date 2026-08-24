"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { QuestionItem, UserExamAnswer } from "@/types/exam.types";

export interface SingleChoiceQuestionProps {
    question: QuestionItem;
    answer?: UserExamAnswer;
    onAnswerChange: (selectedOptionId: string) => void;
}

export function SingleChoiceQuestion({ question, answer, onAnswerChange }: SingleChoiceQuestionProps) {
    const selectedId = answer?.selectedOptionIds?.[0] || "";

    return (
        <div className="space-y-4">
            <RadioGroup value={selectedId} onValueChange={onAnswerChange} className="gap-3">
                {question.options?.map((option) => {
                    const isSelected = selectedId === option.id;
                    return (
                        <label
                            key={option.id}
                            htmlFor={option.id}
                            className={cn(
                                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all",
                                isSelected
                                    ? "border-brand-500 bg-brand-50/50 shadow-xs ring-1 ring-brand-500"
                                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/80",
                            )}
                        >
                            <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
                            <div className="flex-1 space-y-1">
                                <span className="text-sm font-semibold text-gray-900">{option.label}. </span>
                                <span className="text-sm leading-relaxed text-gray-800">{option.text}</span>
                            </div>
                        </label>
                    );
                })}
            </RadioGroup>
        </div>
    );
}
