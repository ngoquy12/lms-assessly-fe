"use client";

import { ChevronRight, FolderTree } from "lucide-react";
import Link from "next/link";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTopicsList } from "@/hooks/queries/use-practice";

export function TopicsView() {
    const { data, isLoading, isError, refetch } = useTopicsList();
    const topics = data ?? [];

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] px-4 py-10 font-sans text-slate-900 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1440px] space-y-8">
                {/* 1. Header */}
                <div>
                    <h1 className="text-[32px] font-extrabold tracking-tight text-[#ab1f24] sm:text-[38px]">Cây Kiến Thức & Chủ Đề Ôn Luyện</h1>
                    <p className="mt-1 text-[15px] text-slate-600 sm:text-[16px]">Hệ thống chủ đề kiến thức phân cấp kèm ngân hàng câu hỏi ôn tập chuyên sâu</p>
                </div>

                {/* 2. Topics Grid */}
                <QueryStateBoundary isLoading={isLoading} isError={isError} onRetry={refetch}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {topics.map((topic) => (
                            <Card
                                key={topic.id}
                                size="md"
                                className="hover:shadow-card-md flex flex-col justify-between rounded-2xl border-slate-200/80 bg-white transition-all"
                            >
                                <CardHeader>
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="rounded-xl bg-[#fff6f7] p-2.5 text-[#ab1f24]">
                                            <FolderTree className="h-5 w-5" />
                                        </div>
                                        <Badge variant="secondary">{topic.questionsCount} câu hỏi</Badge>
                                    </div>
                                    <CardTitle className="text-lg font-bold text-slate-900">{topic.name}</CardTitle>
                                    <CardDescription className="text-sm text-slate-600">{topic.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4 pt-0">
                                    {topic.subTopics && (
                                        <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                                            <span className="text-xs font-semibold text-slate-500">Nhóm chủ đề con</span>
                                            <div className="space-y-1.5">
                                                {topic.subTopics.map((sub) => (
                                                    <div key={sub.id} className="flex items-center justify-between text-xs text-slate-700">
                                                        <span className="truncate">{sub.name}</span>
                                                        <span className="font-mono text-slate-400">{sub.questionsCount} câu</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Link href={`/topics/${topic.id}`} className="block">
                                        <Button
                                            variant="outline"
                                            className="h-10 w-full justify-between rounded-xl font-semibold hover:border-[#ab1f24] hover:text-[#ab1f24]"
                                            size="sm"
                                        >
                                            <span>Vào ôn luyện theo chủ đề</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </QueryStateBoundary>
            </div>
        </div>
    );
}
