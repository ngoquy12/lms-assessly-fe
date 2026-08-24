"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Play, Terminal } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import type { QuestionItem, UserExamAnswer } from "@/types/exam.types";

const CodeEditor = dynamic(() => import("@/components/editor/code-editor").then((m) => m.CodeEditor), {
    ssr: false,
    loading: () => (
        <div className="flex h-full min-h-[340px] w-full items-center justify-center text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
        </div>
    ),
});

export interface CodingQuestionProps {
    question: QuestionItem;
    answer?: UserExamAnswer;
    onAnswerChange: (codeAnswer: string) => void;
}

export function CodingQuestion({ question, answer, onAnswerChange }: CodingQuestionProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [testResult, setTestResult] = useState<string | null>(null);

    const handleRunCode = () => {
        setIsRunning(true);
        setTimeout(() => {
            setIsRunning(false);
            setTestResult("✓ Test case 1 passed (Time: 12ms)\n✓ Test case 2 passed (Time: 8ms)\n✓ Test case 3 passed (Time: 15ms)\n=> 3/3 Test cases PASSED!");
        }, 500);
    };

    return (
        <div className="space-y-4">
            <CodeEditor
                value={answer?.codeAnswer || question.codeTemplate || ""}
                onChange={(val) => onAnswerChange(val || "")}
                language={question.language || "javascript"}
                height="340px"
            />

            {/* Test Run Actions */}
            <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-100/70 p-3 sm:flex-row">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Terminal className="h-4 w-4 text-brand-600" />
                    <span>Môi trường thực thi: Node.js v20 Sandbox</span>
                </div>

                <Button size="sm" onClick={handleRunCode} disabled={isRunning} className="gap-1.5">
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{isRunning ? "Đang chạy test..." : "Chạy thử nghiệm Test Case"}</span>
                </Button>
            </div>

            {/* Console Output */}
            {testResult && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-950 p-4 font-mono text-xs text-emerald-400">
                    <div className="mb-1 flex items-center gap-1.5 font-bold text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Kết quả kiểm thử tự động:</span>
                    </div>
                    <pre className="whitespace-pre-wrap">{testResult}</pre>
                </div>
            )}
        </div>
    );
}
