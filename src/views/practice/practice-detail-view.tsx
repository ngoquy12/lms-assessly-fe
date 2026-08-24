"use client";

import { ArrowLeft, Clock, Layers, Play, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PRACTICE_LIST } from "@/mocks/practice.mock";

export function PracticeDetailView({ practiceId }: { practiceId: string }) {
    const practice = MOCK_PRACTICE_LIST.find((p) => p.id === practiceId) || MOCK_PRACTICE_LIST[0]!;

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <Link href="/practice" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-600">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Quay lại danh sách đề luyện tập</span>
            </Link>

            <Card size="md" className="shadow-card-sm border-gray-200">
                <CardHeader className="space-y-3 border-b border-gray-100 pb-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <Badge variant="secondary" size="md">
                            {practice.category}
                        </Badge>
                        <Badge variant={practice.difficulty === "HARD" ? "destructive" : practice.difficulty === "MEDIUM" ? "warning" : "success"}>
                            {practice.difficulty === "HARD" ? "Nâng cao" : practice.difficulty === "MEDIUM" ? "Trung bình" : "Cơ bản"}
                        </Badge>
                    </div>

                    <CardTitle className="text-2xl leading-tight font-bold text-gray-900">{practice.title}</CardTitle>

                    <CardDescription className="text-sm leading-relaxed text-gray-600">{practice.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <Clock className="mx-auto mb-1 h-5 w-5 text-brand-600" />
                            <p className="text-xl font-bold text-gray-900">{practice.durationMinutes} phút</p>
                            <p className="text-2xs text-gray-500">Thời gian làm bài</p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <Layers className="mx-auto mb-1 h-5 w-5 text-brand-600" />
                            <p className="text-xl font-bold text-gray-900">{practice.totalQuestions} câu</p>
                            <p className="text-2xs text-gray-500">Tổng số câu hỏi</p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <Users className="mx-auto mb-1 h-5 w-5 text-brand-600" />
                            <p className="text-xl font-bold text-gray-900">{practice.participantsCount}</p>
                            <p className="text-2xs text-gray-500">Lượt tham gia</p>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-2 rounded-xl border border-brand-100 bg-brand-50/40 p-4 text-xs text-brand-900">
                        <p className="text-sm font-bold text-brand-800">Lưu ý khi làm bài luyện tập:</p>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>Bài luyện tập không áp dụng giám thị tự động và không giới hạn số lần làm bài.</li>
                            <li>Bạn có thể xem giải thích chi tiết ngay sau khi nộp bài để củng cố kiến thức.</li>
                            <li>Hệ thống lưu lại kết quả thi thử vào lịch sử học tập cá nhân.</li>
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Link href={`/practice-public/${practice.id}`} className="w-full sm:w-auto">
                            <Button size="lg" className="w-full gap-2 px-8 sm:w-auto">
                                <Play className="h-4 w-4 fill-current" />
                                <span>Bắt đầu làm bài luyện tập</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
