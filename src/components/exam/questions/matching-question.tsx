"use client";

import { ArrowRight } from "lucide-react";
import type { QuestionItem, UserExamAnswer } from "@/types/exam.types";

export interface MatchingQuestionProps {
    question: QuestionItem;
    answer?: UserExamAnswer;
    onAnswerChange: (matchingAnswers: Record<string, string>) => void;
}

export function MatchingQuestion({ question, answer, onAnswerChange }: MatchingQuestionProps) {
    const currentMatches = answer?.matchingAnswers || {};

    const handleSelect = (pairId: string, selectedRight: string) => {
        onAnswerChange({
            ...currentMatches,
            [pairId]: selectedRight,
        });
    };

    const rightOptions = question.matchingPairs?.map((p) => p.right) || [];

    return (
        <div className="space-y-4">
            {question.matchingPairs?.map((pair, idx) => (
                <div key={pair.id} className="grid grid-cols-1 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-12">
                    {/* Left Concept */}
                    <div className="text-sm font-medium text-gray-900 sm:col-span-5">
                        <span className="mr-2 font-bold text-brand-600">{idx + 1}.</span>
                        {pair.left}
                    </div>

                    <div className="hidden justify-center text-gray-400 sm:col-span-1 sm:flex">
                        <ArrowRight className="h-4 w-4" />
                    </div>

                    {/* Right Select */}
                    <div className="sm:col-span-6">
                        <select
                            value={currentMatches[pair.id] || ""}
                            onChange={(e) => handleSelect(pair.id, e.target.value)}
                            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                        >
                            <option value="">-- Chọn định nghĩa tương ứng --</option>
                            {rightOptions.map((opt, oIdx) => (
                                <option key={oIdx} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
}
