"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { QuestionItem, UserExamAnswer } from "@/types/exam.types";

export interface MultipleChoiceQuestionProps {
    question: QuestionItem;
    answer?: UserExamAnswer;
    onAnswerChange: (selectedOptionIds: string[]) => void;
}

export function MultipleChoiceQuestion({ question, answer, onAnswerChange }: MultipleChoiceQuestionProps) {
    const selectedIds = answer?.selectedOptionIds || [];

    const handleToggle = (optionId: string) => {
        if (selectedIds.includes(optionId)) {
            onAnswerChange(selectedIds.filter((id) => id !== optionId));
        } else {
            onAnswerChange([...selectedIds, optionId]);
        }
    };

    return (
        <div className="space-y-3">
            {question.options?.map((option) => {
                const isChecked = selectedIds.includes(option.id);
                return (
                    <label
                        key={option.id}
                        className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all",
                            isChecked
                                ? "border-brand-500 bg-brand-50/50 shadow-xs ring-1 ring-brand-500"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/80",
                        )}
                    >
                        <Checkbox checked={isChecked} onCheckedChange={() => handleToggle(option.id)} className="mt-0.5" />
                        <div className="flex-1 space-y-1">
                            <span className="text-sm font-semibold text-gray-900">{option.label}. </span>
                            <span className="text-sm leading-relaxed text-gray-800">{option.text}</span>
                        </div>
                    </label>
                );
            })}
        </div>
    );
}
