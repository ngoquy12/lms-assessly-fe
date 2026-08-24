"use client";

import { ArrowRight, Award, FileText, Home, RotateCcw, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOCK_EXAM_RESULT } from "@/mocks/exam.mock";

export function ExamResultDetailView({ examId: _examId }: { examId: string }) {
    const result = MOCK_EXAM_RESULT;
    const percentage = result.percentage || Math.round((result.score / result.maxScore) * 100);

    const summaryCards = [
        {
            id: "exam-name",
            icon: "/images/icon/note.png",
            title: "Tên bài thi",
            value: result.examTitle,
            isHighlight: false,
        },
        {
            id: "candidate-name",
            icon: "/images/icon/user.png",
            title: "Tên thí sinh",
            value: `${result.candidateName} (${result.candidateCode})`,
            isHighlight: false,
        },
        {
            id: "submitted-at",
            icon: "/images/icon/calendar.png",
            title: "Giờ - Ngày thi",
            value: "16:40 - 24/08/2026",
            isHighlight: false,
        },
        {
            id: "duration-spent",
            icon: "/images/icon/clock-red.png",
            title: "Thời gian làm bài",
            value: `${Math.floor(result.durationSpentSeconds / 60)} phút ${result.durationSpentSeconds % 60} giây`,
            isHighlight: true,
        },
        {
            id: "correct-answers",
            icon: "/images/icon/tick-circle.png",
            title: "Số câu trả lời đúng",
            value: `${result.totalCorrect} / ${result.totalCorrect + result.totalWrong} câu (${percentage}%)`,
            isHighlight: true,
        },
        {
            id: "final-grade",
            icon: "/images/icon/target.png",
            title: "Xếp loại năng lực",
            value: "Xuất sắc (Đạt)",
            isHighlight: true,
        },
    ];

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] px-4 py-10 font-sans text-slate-900 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1280px] space-y-10">
                {/* 1. Top Result Hero Card (Mascot + Arc Gauge + Congratulations) */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] sm:p-12">
                    <div className="flex flex-col items-center justify-center gap-10 md:flex-row lg:gap-24">
                        {/* Left: Mascot Illustration */}
                        <div className="flex shrink-0 justify-center">
                            <Image
                                src="/images/cat/Catgood.png"
                                alt="Chúc mừng bạn hoàn thành tốt bài thi"
                                width={260}
                                height={310}
                                className="h-auto w-[220px] object-contain drop-shadow-md sm:w-[260px]"
                                priority
                            />
                        </div>

                        {/* Right: Score Gauge & Call to Action */}
                        <div className="flex max-w-lg flex-col items-center space-y-4 text-center md:items-start md:text-left">
                            {/* Half-circle Arc Gauge */}
                            <div className="relative flex h-[115px] w-[220px] flex-col items-center justify-center">
                                <svg fill="none" height="110" viewBox="0 0 200 100" width="220" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                                    {/* Track Background */}
                                    <path
                                        d="M192.5 100C196.642 100 200.029 96.6373 199.719 92.5068C197.933 68.7256 187.69 46.2688 170.711 29.2893C151.957 10.5357 126.522 2.00233e-06 100 0C73.4784 -2.00233e-06 48.043 10.5357 29.2893 29.2893C12.3099 46.2688 2.06698 68.7256 0.280917 92.5068C-0.0293006 96.6373 3.35786 100 7.5 100C11.6421 100 14.9656 96.6351 15.3305 92.509C17.0813 72.7114 25.7306 54.0612 39.8959 39.8959C55.8365 23.9553 77.4566 15 100 15C122.543 15 144.163 23.9553 160.104 39.8959C174.269 54.0612 182.919 72.7114 184.67 92.509C185.034 96.6351 188.358 100 192.5 100Z"
                                        fill="#e2e8f0"
                                    />
                                    {/* Progress Fill */}
                                    <path
                                        d="M192.5 100C196.642 100 200.029 96.6373 199.719 92.5068C197.933 68.7256 187.69 46.2688 170.711 29.2893C151.957 10.5357 126.522 2.00233e-06 100 0C73.4784 -2.00233e-06 48.043 10.5357 29.2893 29.2893C12.3099 46.2688 2.06698 68.7256 0.280917 92.5068C-0.0293006 96.6373 3.35786 100 7.5 100C11.6421 100 14.9656 96.6351 15.3305 92.509C17.0813 72.7114 25.7306 54.0612 39.8959 39.8959C55.8365 23.9553 77.4566 15 100 15C122.543 15 144.163 23.9553 160.104 39.8959C174.269 54.0612 182.919 72.7114 184.67 92.509C185.034 96.6351 188.358 100 192.5 100Z"
                                        fill="#ab1f24"
                                        style={{
                                            clipPath: `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`,
                                        }}
                                    />
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                                    <span className="text-xs font-semibold text-slate-500">Tổng điểm</span>
                                    <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                                        {result.score}
                                        <span className="text-lg font-semibold text-slate-400">/{result.maxScore}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Headline */}
                            <div className="space-y-1 pt-1">
                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Chúc mừng bạn đã hoàn thành!</h1>
                                <p className="text-sm leading-relaxed font-medium text-slate-600 sm:text-base">
                                    Hãy tiếp tục cố gắng và phát huy ở những bài học và kỳ khảo thí tiếp theo nhé!
                                </p>
                            </div>

                            {/* CTA Button */}
                            <div className="pt-2">
                                <Link href="/page-exam">
                                    <button
                                        type="button"
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#ab1f24] px-8 py-3.5 text-base font-bold text-white shadow-[0_4px_14px_rgba(188,34,40,0.25)] transition-all hover:bg-[#9c1b20] hover:shadow-[0_6px_20px_rgba(188,34,40,0.35)] active:scale-98"
                                    >
                                        <span>Quay lại danh sách ca thi</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Summary Grid (6 Metric Cards) */}
                <div className="space-y-6">
                    <div className="space-y-1 text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Tóm tắt kết quả</h2>
                        <p className="text-sm font-medium text-slate-500">Thông tin chi tiết về phiên thi và các chỉ số đạt được</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {summaryCards.map((card) => (
                            <div
                                key={card.id}
                                className={`flex flex-col justify-between space-y-4 rounded-2xl border p-6 transition-all ${
                                    card.isHighlight
                                        ? "border-red-200/60 bg-linear-to-b from-[#fff6f7] to-white shadow-2xs"
                                        : "border-slate-200/80 bg-white shadow-2xs"
                                }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f8e9ea] shadow-2xs">
                                        <Image src={card.icon} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500">{card.title}</p>
                                        <p className="mt-0.5 line-clamp-1 text-lg font-bold text-slate-900">{card.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Criteria Performance Breakdown */}
                <Card className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)] sm:p-8">
                    <CardHeader className="border-b border-slate-100 p-0 pb-4">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Phân tích ma trận năng lực theo tiêu chí</CardTitle>
                                <CardDescription className="mt-1 text-xs text-slate-500">
                                    Mức độ thành thạo và tỷ lệ trả lời chính xác ở từng phần kiến thức
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="w-fit border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-700">
                                <Sparkles className="mr-1 h-3 w-3 text-emerald-500" />
                                <span>Tỷ lệ đạt: {percentage}%</span>
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5 p-0">
                        <div className="space-y-4">
                            {result.criteriaBreakdown.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span className="text-slate-800">{item.criteriaName}</span>
                                        <span className="font-bold text-[#ab1f24]">
                                            {item.correct}/{item.total} câu ({item.percentage}%)
                                        </span>
                                    </div>
                                    <Progress value={item.percentage} size="md" className="bg-slate-100" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Academy Feedback */}
                {result.feedback && (
                    <div className="space-y-2 rounded-2xl border border-amber-200/80 bg-linear-to-r from-amber-50/70 via-white to-amber-50/40 p-6 shadow-2xs sm:p-7">
                        <div className="flex items-center gap-2 text-sm font-bold text-amber-700">
                            <Award className="h-4 w-4 text-amber-600" />
                            <span>Nhận xét đánh giá từ Hội đồng Khảo thí Rikkei Education</span>
                        </div>
                        <p className="text-sm leading-relaxed font-medium text-slate-700">{result.feedback}</p>
                    </div>
                )}

                {/* 5. Navigation Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/70 pt-4">
                    <Link href="/page-exam">
                        <Button variant="outline" size="lg" className="gap-2 text-sm font-semibold">
                            <FileText className="h-4 w-4" />
                            <span>Quay lại danh sách ca thi</span>
                        </Button>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link href="/exam/exam-01">
                            <Button variant="secondary" size="lg" className="gap-2 text-sm font-semibold">
                                <RotateCcw className="h-4 w-4" />
                                <span>Làm lại bài thi</span>
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button size="lg" className="gap-2 bg-[#ab1f24] text-sm font-bold text-white shadow-xs hover:bg-[#8b1a1f]">
                                <Home className="h-4 w-4" />
                                <span>Về trang chủ</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
