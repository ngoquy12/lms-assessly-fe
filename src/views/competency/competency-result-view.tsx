"use client";

import { ArrowLeft, CheckCircle2, Home, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AssessmentRadarChart } from "@/components/charts/assessment-radar-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RADAR_DATA = {
    labels: [
        "Tư duy Logic & Thuật toán",
        "Trí tuệ Cảm xúc (EQ)",
        "Giải quyết Vấn đề",
        "Khả năng Tự học & Nghiên cứu",
        "Làm việc Nhóm & Giao tiếp",
        "Tối ưu & Kiến trúc Code",
    ],
    scores: [88, 85, 92, 90, 84, 89],
};

export function CompetencyResultView({ testId: _testId }: { testId: string }) {
    return (
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
            {/* Header Banner */}
            <div className="space-y-3 rounded-3xl bg-linear-to-r from-amber-600 via-brand-600 to-indigo-700 p-8 text-center text-white shadow-xl">
                <Badge variant="warning" size="lg" className="bg-white/20 font-bold text-white">
                    Báo cáo đánh giá năng lực toàn diện
                </Badge>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Biểu Đồ Radar Đánh Giá Năng Lực Thí Sinh</h1>

                <p className="mx-auto max-w-xl text-sm text-amber-100">
                    Kết quả tổng hợp từ 6 trục năng lực cốt lõi theo mô hình đánh giá kỹ sư phần mềm chuyên nghiệp.
                </p>
            </div>

            {/* Radar Chart Card */}
            <Card size="md" className="shadow-card-md border-gray-200">
                <CardHeader className="pb-2 text-center">
                    <CardTitle className="text-lg font-bold">Đa Giác Năng Lực Toàn Diện</CardTitle>
                    <CardDescription>Điểm số tối đa trên mỗi trục năng lực là 100 điểm</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-6">
                    <div className="w-full max-w-md">
                        <AssessmentRadarChart data={RADAR_DATA} />
                    </div>
                </CardContent>
            </Card>

            {/* Strengths & Recommendations */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card size="md" className="border-emerald-200 bg-emerald-50/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>Điểm mạnh nổi bật</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs text-emerald-950">
                        <p>
                            • <strong>Giải quyết vấn đề (92/100):</strong> Khả năng phân tích tình huống thực tế và đưa ra hướng tiếp cận tối ưu rất xuất sắc.
                        </p>
                        <p>
                            • <strong>Khả năng tự học (90/100):</strong> Nhanh nhạy trong việc nắm bắt công nghệ mới và tự giải quyết bug phát sinh.
                        </p>
                    </CardContent>
                </Card>

                <Card size="md" className="border-brand-200 bg-brand-50/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-bold text-brand-900">
                            <TrendingUp className="h-4 w-4 text-brand-600" />
                            <span>Khuyến nghị nâng cao</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs text-brand-950">
                        <p>
                            • <strong>Giao tiếp & Làm việc nhóm (84/100):</strong> Có thể rèn luyện thêm kỹ năng thuyết trình ý tưởng kiến trúc trước tập thể.
                        </p>
                        <p>
                            • <strong>Trí tuệ cảm xúc (85/100):</strong> Luyện tập thêm kỹ năng quản lý căng thẳng trong các đợt phát hành dự án lớn.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
                <Link href="/competency-assessment">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Danh mục bài đánh giá</span>
                    </Button>
                </Link>
                <Link href="/">
                    <Button className="gap-2">
                        <Home className="h-4 w-4" />
                        <span>Về trang chủ</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
