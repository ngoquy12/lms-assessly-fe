"use client";

import { ArrowRight, Clock, Mic } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_INTERVIEW_POSITIONS } from "@/mocks/interview.mock";

export function InterviewListView() {
    const positions = MOCK_INTERVIEW_POSITIONS;

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] px-4 py-10 font-sans text-slate-900 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1440px] space-y-8">
                {/* 1. Header */}
                <div className="space-y-2.5 text-center">
                    <h1 className="text-[32px] font-extrabold tracking-tight text-[#ab1f24] sm:text-[38px]">Luyện Phỏng Vấn Với AI (AI Voice Interview)</h1>
                    <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-[16px]">
                        Môi trường luyện phỏng vấn kỹ thuật và ngoại ngữ trực tiếp bằng giọng nói, nhận phản hồi và chấm điểm ngay lập tức.
                    </p>
                </div>

                {/* 2. Positions Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {positions.map((pos) => (
                        <Card
                            key={pos.id}
                            size="md"
                            className="hover:shadow-card-md flex flex-col justify-between rounded-2xl border-slate-200/80 bg-white transition-all"
                        >
                            <CardHeader>
                                <div className="mb-2 flex items-center justify-between">
                                    <Badge variant="primary" className="border-red-200 bg-[#fff6f7] text-[#ab1f24]">
                                        {pos.category}
                                    </Badge>
                                    <Badge variant="secondary">{pos.level}</Badge>
                                </div>
                                <CardTitle className="line-clamp-2 text-lg font-bold text-slate-900">{pos.title}</CardTitle>
                                <CardDescription className="mt-1 line-clamp-3 text-sm text-slate-600">{pos.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 pt-0">
                                <div className="flex justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5 text-[#ab1f24]" />
                                        <span>{pos.durationMinutes} phút</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Mic className="h-3.5 w-3.5 text-[#ab1f24]" />
                                        <span>{pos.questionsCount} câu hỏi thoại</span>
                                    </span>
                                </div>

                                <Link href={`/ai-interview/check-device/${pos.id}`} className="block">
                                    <Button className="h-11 w-full gap-2 rounded-xl bg-[#ab1f24] font-bold text-white shadow-xs hover:bg-[#90171b]" size="md">
                                        <Mic className="h-4 w-4" />
                                        <span>Kiểm tra thiết bị & Phỏng vấn</span>
                                        <ArrowRight className="ml-auto h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
