"use client";

import { Input } from "@/components/ui/input";
import type { QuestionItem, UserExamAnswer } from "@/types/exam.types";

export interface FillBlanksQuestionProps {
    question: QuestionItem;
    answer?: UserExamAnswer;
    onAnswerChange: (textAnswer: string) => void;
}

export function FillBlanksQuestion({ question, answer, onAnswerChange }: FillBlanksQuestionProps) {
    return (
        <div className="space-y-4">
            {question.content && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">{question.content}</div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">Nhập đáp án của bạn:</label>
                <Input
                    size="lg"
                    placeholder="Nhập từ hoặc cụm từ chính xác..."
                    value={answer?.textAnswer || ""}
                    onChange={(e) => onAnswerChange(e.target.value)}
                />
            </div>
        </div>
    );
}
