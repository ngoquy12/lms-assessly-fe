"use client";

import { ArrowLeft, CheckCircle2, Home, MessageSquare, Mic, Sparkles } from "lucide-react";
import Link from "next/link";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { useInterviewResult } from "@/hooks/queries/use-interview";

export function InterviewResultView({ sessionId: _sessionId }: { sessionId: string }) {
    const { data: result, isLoading, isError, refetch } = useInterviewResult();

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <Link href="/interview" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-600">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Quay lại danh sách phòng phỏng vấn</span>
            </Link>

            <QueryStateBoundary isLoading={isLoading} isError={isError} onRetry={refetch}>
                {result ? (
                    <InterviewResultContent result={result} />
                ) : (
                    <div className="flex items-center justify-center py-16 text-slate-500">{UI_TEXT.common.noData}</div>
                )}
            </QueryStateBoundary>
        </div>
    );
}

function InterviewResultContent({ result }: { result: NonNullable<ReturnType<typeof useInterviewResult>["data"]> }) {
    return (
        <>
            {/* Header Banner */}
            <div className="space-y-4 rounded-3xl bg-linear-to-r from-emerald-600 via-teal-600 to-indigo-700 p-8 text-center text-white shadow-xl">
                <Badge variant="success" size="lg" className="bg-white/20 font-bold text-white">
                    Báo cáo phân tích phỏng vấn AI
                </Badge>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{result.positionTitle}</h1>

                {/* Score */}
                <div className="inline-flex flex-col items-center rounded-2xl bg-white/10 px-8 py-4 backdrop-blur-md">
                    <span className="text-5xl font-black text-white">{result.overallScore}</span>
                    <span className="mt-1 text-xs font-semibold text-emerald-100">Điểm đánh giá tổng quan / 100</span>
                </div>
            </div>

            {/* Sub-scores metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Card size="sm" className="p-4 text-center">
                    <p className="text-2xs mb-1 text-gray-500">Độ trôi chảy (Fluency)</p>
                    <p className="text-xl font-bold text-brand-600">{result.fluencyScore}/100</p>
                    <Progress value={result.fluencyScore} size="sm" className="mt-2" />
                </Card>

                <Card size="sm" className="p-4 text-center">
                    <p className="text-2xs mb-1 text-gray-500">Độ chuẩn ngữ pháp</p>
                    <p className="text-xl font-bold text-brand-600">{result.grammarScore}/100</p>
                    <Progress value={result.grammarScore} size="sm" className="mt-2" />
                </Card>

                <Card size="sm" className="p-4 text-center">
                    <p className="text-2xs mb-1 text-gray-500">Từ vựng chuyên môn</p>
                    <p className="text-xl font-bold text-brand-600">{result.vocabularyScore}/100</p>
                    <Progress value={result.vocabularyScore} size="sm" className="mt-2" />
                </Card>

                <Card size="sm" className="p-4 text-center">
                    <p className="text-2xs mb-1 text-gray-500">Tính logic & Phản xạ</p>
                    <p className="text-xl font-bold text-brand-600">{result.responseLogicScore}/100</p>
                    <Progress value={result.responseLogicScore} size="sm" className="mt-2" />
                </Card>
            </div>

            {/* Strengths & AI Suggestions */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Card size="md" className="border-emerald-200 bg-emerald-50/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>Điểm mạnh trong câu trả lời</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs text-emerald-950">
                        {result.strengths.map((s, i) => (
                            <p key={i}>• {s}</p>
                        ))}
                    </CardContent>
                </Card>

                <Card size="md" className="border-brand-200 bg-brand-50/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-brand-900">
                            <Sparkles className="h-4 w-4 text-brand-600" />
                            <span>Gợi ý cải thiện từ AI Interviewer</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs text-brand-950">
                        {result.aiSuggestions.map((s, i) => (
                            <p key={i}>• {s}</p>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Conversation Transcript */}
            <Card size="md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-bold">
                        <MessageSquare className="h-4 w-4 text-brand-600" />
                        <span>Biên bản hội thoại & Đánh giá từng lượt nói</span>
                    </CardTitle>
                    <CardDescription>Bản ghi âm và nhận diện giọng nói tự động (Speech-to-Text)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {result.transcript.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex gap-3 rounded-xl p-4 text-xs leading-relaxed ${
                                item.speaker === "AI"
                                    ? "border border-slate-200 bg-slate-100 text-slate-900"
                                    : "border border-brand-200 bg-brand-50/60 font-medium text-brand-950"
                            }`}
                        >
                            <div className="shrink-0 font-bold text-brand-700">{item.speaker === "AI" ? "🤖 AI Interviewer:" : "👤 Thí sinh:"}</div>
                            <div className="flex-1 space-y-1">
                                <p>{item.message}</p>
                                <span className="text-2xs font-mono text-gray-400">{item.timestamp}</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4">
                <Link href="/interview">
                    <Button variant="outline" className="gap-2">
                        <Mic className="h-4 w-4" />
                        <span>Luyện phỏng vấn chủ đề khác</span>
                    </Button>
                </Link>
                <Link href="/">
                    <Button className="gap-2">
                        <Home className="h-4 w-4" />
                        <span>Về trang chủ</span>
                    </Button>
                </Link>
            </div>
        </>
    );
}
