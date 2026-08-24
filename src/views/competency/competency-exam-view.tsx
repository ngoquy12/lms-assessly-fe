"use client";

import { useState } from "react";
import { ArrowLeft, Brain, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SAMPLE_LOGIC_QUESTIONS = [
    {
        id: "log-1",
        num: 1,
        title: "Trong một dự án Agile, khi phát hiện một rủi ro kỹ thuật có thể làm chậm tiến độ Sprint, bạn sẽ ưu tiên hành động nào đầu tiên?",
        options: [
            { id: "lo-1a", label: "A", text: "Tự mình cố gắng giải quyết mà không thông báo cho ai để tránh gây hoang mang" },
            { id: "lo-1b", label: "B", text: "Chủ động nêu rõ vấn đề trong buổi Daily Standup hoặc trao đổi ngay với Tech Lead để cùng tìm giải pháp" },
            { id: "lo-1c", label: "C", text: "Bỏ qua tính năng đó và chuyển sang làm việc khác mà không cập nhật Jira" },
            { id: "lo-1d", label: "D", text: "Chờ đến buổi Retrospective cuối Sprint mới báo cáo" },
        ],
    },
    {
        id: "log-2",
        num: 2,
        title: "Tìm số tiếp theo trong dãy quy luật logic: 3, 7, 15, 31, 63, ... ?",
        options: [
            { id: "lo-2a", label: "A", text: "127 (Quy luật: số sau = số trước * 2 + 1)" },
            { id: "lo-2b", label: "B", text: "126" },
            { id: "lo-2c", label: "C", text: "128" },
            { id: "lo-2d", label: "D", text: "120" },
        ],
    },
];

export function CompetencyExamView({ testId }: { testId: string }) {
    const router = useRouter();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentIndex, setCurrentIndex] = useState(0);

    const questions = SAMPLE_LOGIC_QUESTIONS;
    const currentQ = questions[currentIndex];

    const handleSelect = (qId: string, optId: string) => {
        setAnswers((prev) => ({ ...prev, [qId]: optId }));
    };

    const handleFinish = () => {
        router.push(`/competency-assessment/${testId}/result`);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-3xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                    <Link href="/competency-assessment" className="flex items-center gap-2 text-xs text-gray-500 hover:text-brand-600">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Thoát bài đánh giá</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">Đánh giá Năng lực Tư duy</Badge>
                        <Badge variant="primary">
                            Câu {currentIndex + 1}/{questions.length}
                        </Badge>
                    </div>
                </div>

                {/* Question */}
                {currentQ && (
                    <Card size="md" className="shadow-card-sm border-gray-200">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <div className="mb-1 flex items-center gap-2 text-brand-600">
                                <Brain className="h-4 w-4" />
                                <span className="text-xs font-bold text-[#ab1f24]">Câu hỏi tư duy & phản xạ #{currentQ.num}</span>
                            </div>
                            <CardTitle className="text-base leading-relaxed font-bold text-gray-900">{currentQ.title}</CardTitle>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <RadioGroup value={answers[currentQ.id] || ""} onValueChange={(val) => handleSelect(currentQ.id, val)} className="space-y-3">
                                {currentQ.options.map((opt) => (
                                    <label
                                        key={opt.id}
                                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-all ${
                                            answers[currentQ.id] === opt.id
                                                ? "border-brand-500 bg-brand-50/50 shadow-xs ring-1 ring-brand-500"
                                                : "border-gray-200 bg-white hover:bg-gray-50"
                                        }`}
                                    >
                                        <RadioGroupItem value={opt.id} id={opt.id} className="mt-0.5" />
                                        <div className="space-y-0.5">
                                            <span className="font-bold text-gray-900">{opt.label}. </span>
                                            <span className="text-gray-800">{opt.text}</span>
                                        </div>
                                    </label>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                )}

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))} disabled={currentIndex === 0}>
                        Câu trước
                    </Button>

                    {currentIndex < questions.length - 1 ? (
                        <Button onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}>Câu tiếp theo</Button>
                    ) : (
                        <Button variant="success" onClick={handleFinish} className="gap-2">
                            <Send className="h-4 w-4" />
                            <span>Hoàn thành & Xem biểu đồ Radar</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
