"use client";

import { useState } from "react";
import { CheckCircle2, Play, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { useExamSession } from "@/hooks/queries/use-exam";
import { useUserProfile } from "@/hooks/queries/use-user";

export function VerifyTicketView() {
    const router = useRouter();
    const { data: exam, isLoading: isExamLoading, isError: isExamError, refetch: refetchExam } = useExamSession();
    const { data: user, isLoading: isUserLoading, isError: isUserError, refetch: refetchUser } = useUserProfile();
    const isLoading = isExamLoading || isUserLoading;
    const isError = isExamError || isUserError;

    const [isVerifying, setIsVerifying] = useState(false);

    const handleStartExam = () => {
        if (!exam) return;
        setIsVerifying(true);
        setTimeout(() => {
            router.push(`/exam/${exam.id}`);
        }, 600);
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 px-4 py-10 font-sans text-slate-900 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-3xl space-y-6">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <Badge variant="success" size="md" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                        Vé thi hợp lệ
                    </Badge>
                    <h1 className="text-[26px] font-bold tracking-tight text-brand-700 sm:text-[32px]">Xác Thực Thông Tin Thí Sinh & Phòng Thi</h1>
                    <p className="text-sm text-slate-600">Vui lòng kiểm tra lại thông tin cá nhân và ca thi trước khi hệ thống bắt đầu bấm giờ</p>
                </div>

                {/* Exam & Candidate Details Card */}
                <QueryStateBoundary
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={() => {
                        refetchExam();
                        refetchUser();
                    }}
                >
                    {exam && user ? (
                        <Card size="md" className="overflow-hidden rounded-2xl border-slate-200/80 bg-white shadow-xs">
                            <CardHeader className="border-b border-brand-100 bg-brand-50 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-900">{exam.title}</CardTitle>
                                        <CardDescription className="mt-0.5 text-sm text-slate-600">{exam.subjectName}</CardDescription>
                                    </div>
                                    <Badge variant="primary" className="bg-brand-600 text-white">
                                        {exam.code}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 p-6">
                                {/* Information Grid */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50 p-4">
                                        <span className="text-xs font-semibold text-slate-500">Thông tin Thí sinh</span>
                                        <div className="space-y-1 text-sm">
                                            <p className="font-bold text-slate-900">{user.fullName}</p>
                                            <p className="font-mono text-xs text-slate-600">Mã: {user.studentCode}</p>
                                            <p className="text-xs text-slate-600">Lớp: {user.className}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50 p-4">
                                        <span className="text-xs font-semibold text-slate-500">Quy cách Ca thi</span>
                                        <div className="space-y-1 text-sm">
                                            <p className="font-bold text-slate-900">Thời lượng: {exam.durationMinutes} phút</p>
                                            <p className="text-xs text-slate-600">Tổng số: {exam.totalQuestions} câu hỏi</p>
                                            <p className="text-xs text-slate-600">Địa điểm: {exam.roomName}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Checklist */}
                                <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                        <span>Kiểm tra an toàn phòng thi</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 text-xs text-emerald-900 sm:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>Đường truyền mạng: Ổn định (Tốt)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>Giám sát chống gian lận: Sẵn sàng</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>Đồng bộ máy chủ thời gian thực: Đã kết nối</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>Thiết bị: Trình duyệt đạt tiêu chuẩn</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="flex flex-col items-center gap-3 pt-2">
                                    <Button
                                        size="lg"
                                        className="h-12 w-full gap-2 rounded-xl bg-brand-600 px-8 font-bold text-white shadow-xs hover:bg-brand-700 sm:w-auto"
                                        onClick={handleStartExam}
                                        disabled={isVerifying}
                                    >
                                        <Play className="h-4 w-4 fill-current" />
                                        <span>{isVerifying ? "Đang khởi tạo phòng thi..." : "Tôi đã sẵn sàng — Bắt đầu làm bài"}</span>
                                    </Button>
                                    <p className="text-xs text-slate-500">Thời gian sẽ bắt đầu đếm ngược ngay khi bạn bước vào phòng thi.</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="flex items-center justify-center py-16 text-slate-500">{UI_TEXT.common.noData}</div>
                    )}
                </QueryStateBoundary>
            </div>
        </div>
    );
}
