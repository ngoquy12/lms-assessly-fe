"use client";

import {
    ArrowRight,
    Award,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    HelpCircle,
    MapPin,
    RotateCcw,
    Sparkles,
    UserCheck,
    XCircle,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeaderNav } from "@/components/layout/header-nav";
import { HeaderUserActions } from "@/components/layout/header-user-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { usePracticeCriteria, usePracticeQuestionReviews } from "@/hooks/queries/use-practice";

export function PracticeResultPublicView({ practiceId = "topic-react-core" }: { practiceId?: string }) {
    const { data: criteria = [] } = usePracticeCriteria();
    const { data: reviews = [] } = usePracticeQuestionReviews();

    const totalQuestions = 8;
    const correctCount = 7;
    const score = 88;
    const maxScore = 100;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
            {/* 1. Header (Brand Logo + 5 Navigation Tabs + Candidate Avatar) */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white shadow-2xs">
                <div className="relative mx-auto flex h-18 max-w-[1440px] items-center justify-between px-6 sm:px-10">
                    {/* Left: Brand Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/images/header/logo-rikkei2 1.png"
                                alt={UI_TEXT.common.appName}
                                width={114}
                                height={40}
                                className="h-10 w-auto cursor-pointer object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Center: Navigation Links */}
                    <HeaderNav />

                    {/* Right: Actions with Bell & Avatar Dropdowns */}
                    <HeaderUserActions />
                </div>
            </header>

            {/* 2. Main Result Content */}
            <main className="mx-auto max-w-[1440px] space-y-6 px-6 py-8 sm:px-10">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                    <Link href="/practice" className="transition-colors hover:text-brand-600">
                        {UI_TEXT.practiceResultPublic.breadcrumb.practice}
                    </Link>
                    <span>{UI_TEXT.practiceResultPublic.breadcrumb.separator}</span>
                    <span className="font-bold text-slate-900">{UI_TEXT.practiceResultPublic.breadcrumb.result}</span>
                </div>

                {/* 1. Hero Score Banner Card */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
                    <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                        {/* Left: Title & Status */}
                        <div className="space-y-2.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="rounded-lg border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
                                >
                                    {UI_TEXT.practiceResultPublic.banner.passedBadge}
                                </Badge>
                                <Badge className="border border-slate-200 bg-slate-100 text-xs font-medium text-slate-700 shadow-none">
                                    {UI_TEXT.practiceResultPublic.banner.rankBadge}
                                </Badge>
                                <span className="flex items-center gap-1 text-xs font-normal text-slate-500">
                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                    <span>24/08/2026 16:40:00</span>
                                </span>
                            </div>

                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                    Khảo sát Năng lực Lập trình Toàn diện &amp; Frameworks Hiện đại
                                </h1>
                                <p className="mt-1 text-sm font-normal text-slate-600">
                                    Báo cáo đánh giá chi tiết về kiến thức cốt lõi, tư duy giải thuật và độ chính xác trong phiên luyện tập.
                                </p>
                            </div>
                        </div>

                        {/* Right: Big Score Box */}
                        <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-brand-100 bg-linear-to-br from-brand-50/70 via-white to-brand-50/30 p-4 shadow-2xs sm:p-5">
                            <div className="text-center sm:text-right">
                                <p className="text-xs font-medium text-slate-500">{UI_TEXT.practiceResultPublic.banner.scoreTitle}</p>
                                <div className="mt-0.5 flex items-baseline justify-center gap-1 sm:justify-end">
                                    <span className="text-3xl font-bold tracking-tight text-brand-700 sm:text-4xl">{score}</span>
                                    <span className="text-base font-semibold text-slate-400">/{maxScore}</span>
                                </div>
                                <p className="mt-0.5 text-xs font-semibold text-emerald-700">
                                    {UI_TEXT.practiceResultPublic.banner.accuracyPrefix} {correctCount}/{totalQuestions}{" "}
                                    {UI_TEXT.practiceResultPublic.banner.questionUnit} ({percentage}%)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Core 4-Metric Summary Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* 1. Correct Answers */}
                    <Card className="space-y-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-4 shadow-2xs sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-600">{UI_TEXT.practiceResultPublic.metrics.correctTitle}</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-2xs">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <p className="font-mono text-xl font-bold text-emerald-800 sm:text-2xl">
                                {correctCount} / {totalQuestions}{" "}
                                <span className="text-xs font-normal text-slate-500 sm:text-sm">{UI_TEXT.practiceResultPublic.metrics.questionUnit}</span>
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-emerald-700">
                                {UI_TEXT.practiceResultPublic.metrics.accuracyRate} {percentage}%
                            </p>
                        </div>
                    </Card>

                    {/* 2. Time Taken */}
                    <Card className="space-y-2.5 rounded-2xl border border-indigo-200/80 bg-indigo-50/30 p-4 shadow-2xs sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-600">{UI_TEXT.practiceResultPublic.metrics.timeTitle}</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 shadow-2xs">
                                <Clock className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <p className="font-mono text-xl font-bold text-indigo-800 sm:text-2xl">
                                18:45 <span className="text-xs font-normal text-slate-500 sm:text-sm">{UI_TEXT.practiceResultPublic.metrics.timeMax}</span>
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-indigo-700">{UI_TEXT.practiceResultPublic.metrics.timeSaved}</p>
                        </div>
                    </Card>

                    {/* 3. Average Speed */}
                    <Card className="space-y-2.5 rounded-2xl border border-amber-200/80 bg-amber-50/30 p-4 shadow-2xs sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-600">{UI_TEXT.practiceResultPublic.metrics.avgSpeedTitle}</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shadow-2xs">
                                <Zap className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <p className="font-mono text-xl font-bold text-amber-800 sm:text-2xl">
                                2m 20s{" "}
                                <span className="text-xs font-normal text-slate-500 sm:text-sm">{UI_TEXT.practiceResultPublic.metrics.perQuestionUnit}</span>
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-amber-700">{UI_TEXT.practiceResultPublic.metrics.speedComparison}</p>
                        </div>
                    </Card>

                    {/* 4. Rank & Proficiency */}
                    <Card className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-600">{UI_TEXT.practiceResultPublic.metrics.proficiencyTitle}</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-2xs">
                                <Award className="h-4 w-4 text-brand-600" />
                            </div>
                        </div>
                        <div>
                            <p className="font-mono text-xl font-bold text-slate-900 sm:text-2xl">
                                Top 5% <span className="text-xs font-normal text-slate-500 sm:text-sm">{UI_TEXT.practiceResultPublic.metrics.courseScope}</span>
                            </p>
                            <p className="mt-0.5 text-xs font-normal text-slate-500">{UI_TEXT.practiceResultPublic.metrics.proficiencyLevel}</p>
                        </div>
                    </Card>
                </div>

                {/* 3. Knowledge Breakdown Matrix */}
                <Card className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                    <CardHeader className="border-b border-slate-100 p-0 pb-4">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div>
                                <CardTitle className="text-base font-bold text-slate-900">{UI_TEXT.practiceResultPublic.breakdown.title}</CardTitle>
                                <CardDescription className="text-xs text-slate-500">{UI_TEXT.practiceResultPublic.breakdown.description}</CardDescription>
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>
                                    {UI_TEXT.practiceResultPublic.breakdown.completionRate} {percentage}%
                                </span>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-0">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {criteria.map((crit, idx) => (
                                <div key={idx} className="space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-slate-800">{crit.name}</span>
                                        <span className="font-mono font-bold text-brand-700">
                                            {crit.score} ({crit.percentage}%)
                                        </span>
                                    </div>
                                    <Progress value={crit.percentage} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Detailed Question Review & Explanations (Wao Experience) */}
                <Card className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                    <CardHeader className="border-b border-slate-100 p-0 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
                                    <BookOpen className="h-4 w-4 text-brand-600" />
                                    <span>{UI_TEXT.practiceResultPublic.review.title}</span>
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-500">{UI_TEXT.practiceResultPublic.review.description}</CardDescription>
                            </div>
                            <Badge variant="outline" className="border-slate-300 bg-slate-50 font-mono text-xs font-semibold text-slate-700">
                                {UI_TEXT.practiceResultPublic.review.focusedBadge}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 p-0">
                        {reviews.map((q) => (
                            <div
                                key={q.id}
                                className={`space-y-4 rounded-2xl border p-5 transition-all sm:p-6 ${
                                    q.isCorrect ? "border-emerald-200/80 bg-emerald-50/20" : "border-rose-200/80 bg-rose-50/20"
                                }`}
                            >
                                {/* Question Top Badge & Result */}
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className={
                                                q.isCorrect
                                                    ? "border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-700"
                                                    : "border-rose-300 bg-rose-50 text-xs font-bold text-rose-700"
                                            }
                                        >
                                            {UI_TEXT.practiceResultPublic.review.questionPrefix} {q.orderNumber}
                                        </Badge>
                                        <span className="text-xs font-semibold text-slate-500">{q.category}</span>
                                    </div>

                                    {q.isCorrect ? (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            <span>{UI_TEXT.practiceResultPublic.review.correctBadge}</span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                                            <XCircle className="h-3.5 w-3.5" />
                                            <span>{UI_TEXT.practiceResultPublic.review.incorrectBadge}</span>
                                        </span>
                                    )}
                                </div>

                                {/* Question Title */}
                                <h3 className="text-sm leading-relaxed font-bold text-slate-900 sm:text-base">{q.title}</h3>

                                {/* Options List */}
                                <div className="space-y-2">
                                    {q.options.map((opt) => {
                                        const isSelectedByUser = q.userSelectedId === opt.id;
                                        const isCorrectOption = q.correctOptionId === opt.id;

                                        let optStyle = "border-slate-200 bg-white text-slate-700";
                                        if (isCorrectOption) {
                                            optStyle = "border-emerald-300 bg-emerald-50/80 font-semibold text-emerald-900";
                                        } else if (isSelectedByUser && !isCorrectOption) {
                                            optStyle = "border-rose-300 bg-rose-50/80 font-semibold text-rose-900";
                                        }

                                        return (
                                            <div
                                                key={opt.id}
                                                className={`flex items-start justify-between gap-3 rounded-xl border p-3 text-xs leading-relaxed sm:text-sm ${optStyle}`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <span className="font-bold">{opt.label}.</span>
                                                    <span>{opt.text}</span>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-1">
                                                    {isCorrectOption && (
                                                        <Badge className="bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                                            {UI_TEXT.practiceResultPublic.review.correctOptionBadge}
                                                        </Badge>
                                                    )}
                                                    {isSelectedByUser && !isCorrectOption && (
                                                        <Badge className="bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                                            {UI_TEXT.practiceResultPublic.review.userChoiceBadge}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Explanation Box */}
                                <div className="space-y-1 rounded-xl border border-slate-200/80 bg-white p-4 text-xs text-slate-700 sm:text-sm">
                                    <div className="flex items-center gap-1.5 font-bold text-brand-700">
                                        <HelpCircle className="h-4 w-4" />
                                        <span>{UI_TEXT.practiceResultPublic.review.explanationLabel}</span>
                                    </div>
                                    <p className="pl-5 leading-relaxed text-slate-600">{q.explanation}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 5. Candidate & Exam Session Details Box (Standardized) */}
                <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
                    <CardHeader className="border-b border-slate-100 p-0 pb-3.5">
                        <CardTitle className="text-sm font-bold text-slate-900 sm:text-base">{UI_TEXT.practiceResultPublic.candidateInfo.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pt-4">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2 md:grid-cols-3">
                            {/* 1. Candidate Name */}
                            <div className="space-y-1">
                                <span className="text-xs font-normal text-slate-500">{UI_TEXT.practiceResultPublic.candidateInfo.fullNameLabel}</span>
                                <p className="font-bold text-slate-900">Bảo Hoàng 01</p>
                            </div>

                            {/* 2. Candidate Code & SBD */}
                            <div className="space-y-1">
                                <span className="text-xs font-normal text-slate-500">{UI_TEXT.practiceResultPublic.candidateInfo.studentCodeLabel}</span>
                                <p className="font-mono font-bold text-slate-900">
                                    BH-2026-0889 <span className="font-sans font-medium text-slate-600">(SBD-042)</span>
                                </p>
                            </div>

                            {/* 3. Candidate Class */}
                            <div className="space-y-1">
                                <span className="text-xs font-normal text-slate-500">{UI_TEXT.practiceResultPublic.candidateInfo.classLabel}</span>
                                <p className="font-semibold text-slate-900">Lớp K23-WebDev (Khóa K23)</p>
                            </div>

                            {/* 4. Position */}
                            <div className="space-y-1">
                                <span className="text-xs font-normal text-slate-500">{UI_TEXT.practiceResultPublic.candidateInfo.topicLabel}</span>
                                <p className="font-semibold text-slate-900">Khảo sát Năng lực Lập trình Toàn diện</p>
                            </div>

                            {/* 5. Room Name */}
                            <div className="space-y-1">
                                <span className="text-xs font-normal text-slate-500">{UI_TEXT.practiceResultPublic.candidateInfo.roomLabel}</span>
                                <p className="flex items-center gap-1.5 font-semibold text-slate-900">
                                    <MapPin className="h-3.5 w-3.5 text-brand-600" />
                                    <span>Thư viện Luyện tập Trực tuyến Rikkei Edu</span>
                                </p>
                            </div>

                            {/* 6. Session Code */}
                            <div className="space-y-1">
                                <span className="text-xs font-normal text-slate-500">{UI_TEXT.practiceResultPublic.candidateInfo.sessionCodeLabel}</span>
                                <p className="font-mono font-bold text-slate-900">PRAC-2026-WEB-01</p>
                            </div>

                            {/* 7. Evaluators */}
                            <div className="space-y-1 sm:col-span-2">
                                <span className="text-xs font-normal text-slate-500">{UI_TEXT.practiceResultPublic.candidateInfo.evaluatorsLabel}</span>
                                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                    {["Ban Cố vấn Đào tạo CNTT Rikkei Edu", "ThS. Nguyễn Văn Anh"].map((evaluator, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                                        >
                                            <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                                            <span>{evaluator}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 8. Session Time Range */}
                            <div className="space-y-1">
                                <span className="text-xs font-normal text-slate-500">{UI_TEXT.practiceResultPublic.candidateInfo.timeRangeLabel}</span>
                                <p className="text-xs font-semibold text-slate-900 sm:text-sm">16:21:15 - 16:40:00 (24/08/2026)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 6. Navigation Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href="/practice">
                            <Button
                                variant="outline"
                                className="h-10 gap-2 rounded-xl border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
                            >
                                <FileText className="h-4 w-4" />
                                <span>{UI_TEXT.practiceResultPublic.actions.backToLibrary}</span>
                            </Button>
                        </Link>
                        <Link href={`/practice-public/${practiceId}`}>
                            <Button
                                variant="outline"
                                className="h-10 gap-2 rounded-xl border-brand-200 bg-brand-50/50 px-4 text-xs font-bold text-brand-700 hover:bg-brand-100 sm:text-sm"
                            >
                                <RotateCcw className="h-4 w-4" />
                                <span>{UI_TEXT.practiceResultPublic.actions.retry}</span>
                            </Button>
                        </Link>
                    </div>

                    <Link href="/">
                        <Button className="h-10 gap-2 rounded-xl bg-brand-600 px-5 text-xs font-semibold text-white shadow-xs hover:bg-brand-700 sm:text-sm">
                            <span>{UI_TEXT.practiceResultPublic.actions.goHome}</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
