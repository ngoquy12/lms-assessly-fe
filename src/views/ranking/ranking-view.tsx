"use client";

import { Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useLeaderboard } from "@/hooks/queries/use-user";

export function RankingView() {
    const { data, isLoading, isError, refetch } = useLeaderboard();
    const leaderboard = data ?? [];

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-slate-900">
            <div className="mx-auto max-w-[1440px] space-y-8 px-6 py-8 sm:px-10">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                    <Link href="/" className="transition-colors hover:text-[#ab1f24]">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span className="font-bold text-slate-900">Bảng xếp hạng</span>
                </div>

                {/* 1. Header Banner */}
                <div className="rounded-3xl bg-linear-to-r from-[#ab1f24] via-[#90171b] to-slate-900 p-8 text-white shadow-lg">
                    <div className="max-w-2xl space-y-2">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                            <Trophy className="h-3.5 w-3.5 text-amber-300" />
                            <span>Bảng Vinh Danh Khảo Thí Toàn Hệ Thống</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Bảng Xếp Hạng Thí Sinh</h1>
                        <p className="text-sm text-red-100">
                            Top những thí sinh có tổng điểm xuất sắc nhất qua các kỳ khảo sát năng lực và bài thi chính thức.
                        </p>
                    </div>
                </div>

                <QueryStateBoundary isLoading={isLoading} isError={isError} onRetry={refetch}>
                    {/* 2. Top 3 Podium Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {/* Top 2 */}
                        <Card
                            size="sm"
                            className="relative order-2 overflow-hidden rounded-2xl border-slate-200/80 bg-white p-6 text-center shadow-xs sm:order-1"
                        >
                            <div className="absolute top-0 right-0 left-0 h-1.5 bg-slate-300" />
                            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center">
                                <Image src="/images/rank/silver.png" alt="Hạng 2" width={56} height={56} className="h-12 w-auto object-contain" />
                            </div>
                            <Badge variant="secondary" className="mb-2">
                                Hạng 2
                            </Badge>
                            <h3 className="font-bold text-slate-900">{leaderboard[1]?.studentName}</h3>
                            <p className="text-xs text-slate-500">{leaderboard[1]?.studentCode}</p>
                            <p className="mt-2 text-xl font-extrabold text-[#ab1f24]">{leaderboard[1]?.totalScore} pts</p>
                        </Card>

                        {/* Top 1 */}
                        <Card
                            size="md"
                            className="relative order-1 scale-105 overflow-hidden rounded-2xl border-amber-300 bg-amber-50/40 p-6 text-center shadow-md sm:order-2"
                        >
                            <div className="absolute top-0 right-0 left-0 h-2 bg-amber-400" />
                            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center">
                                <Image src="/images/rank/gold.png" alt="Quán Quân" width={64} height={64} className="h-14 w-auto object-contain" />
                            </div>
                            <Badge variant="warning" className="mb-2 border-amber-300 bg-amber-100 text-amber-800">
                                Quán Quân
                            </Badge>
                            <h3 className="text-base font-bold text-slate-900">{leaderboard[0]?.studentName}</h3>
                            <p className="text-xs text-slate-500">{leaderboard[0]?.studentCode}</p>
                            <p className="mt-2 text-2xl font-extrabold text-[#ab1f24]">{leaderboard[0]?.totalScore} pts</p>
                        </Card>

                        {/* Top 3 */}
                        <Card size="sm" className="relative order-3 overflow-hidden rounded-2xl border-amber-200/80 bg-white p-6 text-center shadow-xs">
                            <div className="absolute top-0 right-0 left-0 h-1.5 bg-amber-600" />
                            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center">
                                <Image src="/images/rank/bronze.png" alt="Hạng 3" width={56} height={56} className="h-12 w-auto object-contain" />
                            </div>
                            <Badge variant="secondary" className="mb-2">
                                Hạng 3
                            </Badge>
                            <h3 className="font-bold text-slate-900">{leaderboard[2]?.studentName}</h3>
                            <p className="text-xs text-slate-500">{leaderboard[2]?.studentCode}</p>
                            <p className="mt-2 text-xl font-extrabold text-[#ab1f24]">{leaderboard[2]?.totalScore} pts</p>
                        </Card>
                    </div>

                    {/* 3. Detailed Table */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                        <div className="border-b border-slate-100 p-6">
                            <h2 className="text-base font-bold text-slate-900">Danh sách xếp hạng tổng thể</h2>
                            <p className="text-xs text-slate-500">Cập nhật theo thời gian thực sau mỗi ca thi được công bố điểm</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-red-100 bg-[#fff6f7] text-[#ab1f24]">
                                        <th className="px-6 py-4 text-sm font-bold tracking-tight">Hạng</th>
                                        <th className="px-6 py-4 text-sm font-bold tracking-tight">Thí sinh</th>
                                        <th className="px-6 py-4 text-sm font-bold tracking-tight">Mã thí sinh</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold tracking-tight">Số bài thi</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold tracking-tight">Tổng điểm</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {leaderboard.map((item) => (
                                        <tr key={item.id} className="transition-colors hover:bg-slate-50/70">
                                            <td className="px-6 py-4 font-bold text-slate-900">#{item.rank}</td>
                                            <td className="px-6 py-4 text-[15px] font-semibold text-slate-900">{item.studentName}</td>
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.studentCode}</td>
                                            <td className="px-6 py-4 text-center text-sm font-medium text-slate-600">{item.examsCompleted} bài</td>
                                            <td className="px-6 py-4 text-right text-base font-extrabold text-[#ab1f24]">{item.totalScore}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </QueryStateBoundary>
            </div>
        </div>
    );
}
