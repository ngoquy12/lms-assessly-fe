"use client";

import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { useTopicDetail } from "@/hooks/queries/use-practice";

export function TopicDetailView({ topicId }: { topicId: string }) {
    const { data: topic, isLoading, isError, refetch } = useTopicDetail(topicId);

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <Link href="/topics" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-600">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Quay lại cây chủ đề kiến thức</span>
            </Link>

            <QueryStateBoundary isLoading={isLoading} isError={isError} onRetry={refetch}>
                {topic ? (
                    <Card size="md" className="shadow-card-sm border-gray-200">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <div className="flex items-center justify-between">
                                <Badge variant="primary">{topic.questionsCount} câu hỏi ngân hàng</Badge>
                            </div>
                            <CardTitle className="pt-1 text-2xl font-bold text-gray-900">{topic.name}</CardTitle>
                            <CardDescription>{topic.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-6">
                            <h3 className="text-sm font-bold text-gray-900">Danh sách các chuyên đề ôn luyện</h3>

                            <div className="space-y-3">
                                {topic.subTopics?.map((sub, idx) => (
                                    <div
                                        key={sub.id}
                                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-xs transition-all hover:border-brand-300 hover:bg-gray-50/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{sub.name}</p>
                                                <p className="text-xs text-gray-500">{sub.questionsCount} câu hỏi luyện tập</p>
                                            </div>
                                        </div>

                                        <Link href="/practice">
                                            <Button size="sm" className="gap-1.5">
                                                <Play className="h-3.5 w-3.5 fill-current" />
                                                <span>Bắt đầu ôn</span>
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex items-center justify-center py-16 text-slate-500">{UI_TEXT.common.noData}</div>
                )}
            </QueryStateBoundary>
        </div>
    );
}
