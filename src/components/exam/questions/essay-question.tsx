"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import type { QuestionItem, UserExamAnswer } from "@/types/exam.types";

const EssayEditor = dynamic(() => import("@/components/editor/essay-editor").then((m) => m.EssayEditor), {
    ssr: false,
    loading: () => (
        <div className="flex h-full min-h-[280px] w-full items-center justify-center text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
        </div>
    ),
});

export interface EssayQuestionProps {
    question: QuestionItem;
    answer?: UserExamAnswer;
    onAnswerChange: (textAnswer: string) => void;
}

export function EssayQuestion({ question: _question, answer, onAnswerChange }: EssayQuestionProps) {
    return (
        <div className="space-y-3">
            <EssayEditor
                value={answer?.textAnswer || ""}
                onChange={onAnswerChange}
                placeholder="Nhập nội dung bài tự luận của bạn tại đây..."
                minHeight="280px"
            />
            <p className="text-2xs text-right text-gray-400">Hệ thống hỗ trợ tự động lưu nháp sau mỗi lần gõ</p>
        </div>
    );
}
