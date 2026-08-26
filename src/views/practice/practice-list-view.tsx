"use client";

import { useState } from "react";
import { Clock, Layers, Play, Search, Users, X } from "lucide-react";
import Link from "next/link";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePracticeList } from "@/hooks/queries/use-practice";

export function PracticeListView() {
    const [searchQuery, setSearchQuery] = useState("");
    const { data, isLoading, isError, refetch } = usePracticeList();
    const practices = data ?? [];

    const filtered = practices.filter(
        (p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
            <div className="mx-auto max-w-[1440px] space-y-8 px-6 py-8 sm:px-10">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                    <Link href="/" className="transition-colors hover:text-brand-600">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span className="font-bold text-slate-900">Luyện tập</span>
                </div>

                {/* 1. Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[32px] font-extrabold tracking-tight text-brand-700 sm:text-[38px]">Thư Viện Đề Luyện Tập</h1>
                        <p className="mt-1 text-[15px] text-slate-600 sm:text-[16px]">
                            Tự do làm các bài thi thử, rèn luyện kỹ năng và xem đáp án giải thích chi tiết.
                        </p>
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Tìm kiếm đề luyện tập..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 rounded-xl border-slate-300 bg-white pr-4 pl-10 text-sm shadow-2xs focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* 2. Practice Items Grid */}
                <QueryStateBoundary isLoading={isLoading} isError={isError} onRetry={refetch}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((item) => (
                            <Card
                                key={item.id}
                                size="md"
                                className="hover:shadow-card-md flex flex-col justify-between rounded-2xl border-slate-200/80 bg-white transition-all"
                            >
                                <CardHeader>
                                    <div className="mb-2 flex items-center justify-between">
                                        <Badge
                                            variant="primary"
                                            className="pointer-events-none border-brand-200/80 bg-brand-50 font-semibold text-brand-700"
                                            size="sm"
                                        >
                                            {item.category}
                                        </Badge>
                                        <Badge
                                            variant={item.difficulty === "HARD" ? "destructive" : item.difficulty === "MEDIUM" ? "warning" : "success"}
                                            size="sm"
                                            className="pointer-events-none"
                                        >
                                            {item.difficulty === "HARD" ? "Nâng cao" : item.difficulty === "MEDIUM" ? "Trung bình" : "Cơ bản"}
                                        </Badge>
                                    </div>
                                    <CardTitle className="line-clamp-2 text-base font-bold text-slate-900">{item.title}</CardTitle>
                                    <CardDescription className="line-clamp-2 text-sm text-slate-600">{item.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4 pt-0">
                                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5 text-brand-600" />
                                            <span>{item.durationMinutes} phút</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Layers className="h-3.5 w-3.5 text-brand-600" />
                                            <span>{item.totalQuestions} câu</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3.5 w-3.5 text-brand-600" />
                                            <span>{item.participantsCount} lượt</span>
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <Link href={`/practice/${item.id}`}>
                                            <Button variant="outline" size="sm" className="h-10 w-full rounded-xl font-semibold">
                                                Chi tiết đề
                                            </Button>
                                        </Link>
                                        <Link href={`/practice-public/${item.id}`}>
                                            <Button
                                                size="sm"
                                                className="h-10 w-full gap-1 rounded-xl bg-brand-600 font-bold text-white shadow-xs hover:bg-brand-700"
                                            >
                                                <Play className="h-3.5 w-3.5 fill-current" />
                                                <span>Luyện ngay</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </QueryStateBoundary>
            </div>
        </div>
    );
}
