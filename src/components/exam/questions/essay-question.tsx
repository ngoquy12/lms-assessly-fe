"use client";

import { EssayEditor } from "@/components/editor/essay-editor";
import type { QuestionItem, UserExamAnswer } from "@/types/exam.types";

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
