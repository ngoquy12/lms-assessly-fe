"use client";

import { useState } from "react";
import { BarChart3, Clock, Layers, Monitor, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { Badge } from "@/components/ui/badge";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { usePracticeList } from "@/hooks/queries/use-practice";

export function HomeView() {
    const { data, isLoading, isError, refetch } = usePracticeList();
    const practices = data ?? [];
    const categories = Array.from(new Set(practices.map((p) => p.category)));
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredExams = selectedCategory ? practices.filter((p) => p.category === selectedCategory) : practices;

    return (
        <div className="w-full font-sans text-gray-800">
            {/* 1. Hero Section */}
            <section className="w-full bg-linear-to-b from-white to-gray-50 px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
                <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left Hero Content */}
                    <div className="flex flex-col gap-6">
                        <h1 className="text-4xl leading-[1.2] font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-display-xl">
                            Mỗi <span className="text-brand-500">Bài Thi</span> giúp bạn đánh giá và nâng cao{" "}
                            <span className="text-brand-500">Năng Lực Của Mình!</span> <span className="ml-2 inline-block text-display-sm">✨</span>
                        </h1>

                        <p className="max-w-xl text-base leading-[1.6] text-gray-600 sm:text-lg">
                            Hệ thống khảo thí trực tuyến chuyên nghiệp giúp bạn đánh giá chính xác kiến thức và kỹ năng. Hãy bắt đầu thi ngay để khám phá năng
                            lực thực sự của bạn!
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Link href="/practice">
                                <button
                                    type="button"
                                    className="cursor-pointer rounded-full bg-brand-500 px-8 py-3.5 text-base font-medium text-white shadow-xs transition-all hover:bg-brand-600"
                                >
                                    {UI_TEXT.home.startPractice}
                                </button>
                            </Link>
                            <Link href="/huong-dan">
                                <button
                                    type="button"
                                    className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-brand-500 bg-white px-8 py-3.5 text-base font-medium text-brand-500 shadow-xs transition-all hover:bg-red-50/50"
                                >
                                    <PlayCircle className="h-5 w-5 text-brand-500" />
                                    <span>Xem hướng dẫn</span>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Hero Image Frame (Exact -2deg rotation with 2deg counter-rotated badges) */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[560px] -rotate-2 transform">
                            <div className="relative rounded-2xl border-2 border-dashed border-black/20 bg-white p-5 pb-0 shadow-[0_20px_40px_rgba(188,34,40,0.3)]">
                                <Image
                                    src="/images/home/model-1.png"
                                    alt="Thí sinh đang làm bài thi"
                                    width={560}
                                    height={440}
                                    className="block h-auto w-full rounded-xl object-contain"
                                    priority
                                />

                                {/* Badge Bottom Left */}
                                <div className="absolute bottom-6 left-6 max-w-[210px] rotate-2 transform rounded-xl border border-gray-100/60 bg-white/95 p-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                                    <div className="text-sm leading-tight font-semibold text-gray-800">Đề thi mới mỗi ngày</div>
                                    <div className="mt-1 text-xs text-gray-400">Cập nhật liên tục - đừng bỏ lỡ!</div>
                                </div>

                                {/* Badge Middle Right */}
                                <div className="absolute top-1/2 right-6 max-w-[210px] -translate-y-1/2 rotate-2 transform rounded-xl border border-gray-100/60 bg-white/95 p-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                                    <div className="text-sm leading-tight font-semibold text-gray-800">Học dễ dàng</div>
                                    <div className="mt-1 text-xs text-gray-400">Hoàn thành bài thi. Kết quả xuất sắc!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Curated Practice Exams Section */}
            <section className="w-full bg-gray-50 px-6 py-20 sm:px-10 lg:px-12">
                <div className="mx-auto max-w-[1400px]">
                    <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-display-lg">
                        Đề Thi Theo Chủ Đề: <span className="text-brand-500">Đánh Giá Năng Lực</span> Chính Xác
                    </h2>
                    <p className="mx-auto mb-10 max-w-3xl text-center text-base text-gray-600 sm:text-lg">
                        Khám phá các đề thi được phân loại theo chủ đề, giúp bạn đánh giá chính xác kiến thức và kỹ năng của mình ở từng lĩnh vực.
                    </p>

                    {/* Filter Tabs */}
                    <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory(null)}
                            className={`cursor-pointer rounded-lg px-6 py-3 text-base font-medium transition-all ${
                                selectedCategory === null ? "bg-brand-500 text-white shadow-xs" : "bg-white text-gray-800 hover:bg-brand-500 hover:text-white"
                            }`}
                        >
                            Tất cả chủ đề
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setSelectedCategory(category)}
                                className={`cursor-pointer rounded-lg px-6 py-3 text-base font-medium transition-all ${
                                    selectedCategory === category
                                        ? "bg-brand-500 text-white shadow-xs"
                                        : "bg-white text-gray-800 hover:bg-brand-500 hover:text-white"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                        <Link href="/topics">
                            <button
                                type="button"
                                className="cursor-pointer rounded-lg border border-dashed border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-800 transition-all hover:border-brand-500 hover:text-brand-500"
                            >
                                Xem thêm +
                            </button>
                        </Link>
                    </div>

                    {/* Exams Cards Grid */}
                    <QueryStateBoundary isLoading={isLoading} isError={isError} onRetry={refetch}>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredExams.map((practice) => (
                                <Link key={practice.id} href={`/practice-public/${practice.id}`}>
                                    <div className="group flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1.5 hover:shadow-xl">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <Badge variant="primary" className="border-red-200 bg-brand-25 text-brand-600" size="sm">
                                                    {practice.category}
                                                </Badge>
                                                <Badge
                                                    variant={
                                                        practice.difficulty === "HARD"
                                                            ? "destructive"
                                                            : practice.difficulty === "MEDIUM"
                                                              ? "warning"
                                                              : "success"
                                                    }
                                                    size="sm"
                                                >
                                                    {practice.difficulty === "HARD" ? "Nâng cao" : practice.difficulty === "MEDIUM" ? "Trung bình" : "Cơ bản"}
                                                </Badge>
                                            </div>
                                            <h3 className="line-clamp-2 text-lg font-bold text-gray-800 transition-colors group-hover:text-brand-500">
                                                {practice.title}
                                            </h3>
                                            <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">{practice.description}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs font-medium text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-brand-500" />
                                                {practice.durationMinutes} phút
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Layers className="h-3.5 w-3.5 text-brand-500" />
                                                {practice.totalQuestions} câu hỏi
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </QueryStateBoundary>
                </div>
            </section>

            {/* 3. Future-Proof Assessment Banner */}
            <section className="w-full bg-white px-6 py-20 sm:px-10 lg:px-12">
                <div className="mx-auto max-w-[1400px] space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        <span className="text-brand-500">Đánh Giá Năng Lực</span> Chính Xác Với Hệ Thống Khảo Thí Trực Tuyến
                    </h2>
                    <p className="mx-auto max-w-[900px] text-base leading-[1.6] text-gray-600 sm:text-lg">
                        Hệ thống khảo thí trực tuyến chuyên nghiệp giúp bạn đánh giá chính xác kiến thức và kỹ năng. Thi mọi lúc, mọi nơi với giao diện thân
                        thiện và kết quả tức thì. Bất kể bạn ở đâu hay thời gian nào, luôn có thể kiểm tra năng lực của mình.
                    </p>
                </div>
            </section>

            {/* 4. Statistics Counter Section */}
            <section className="w-full border-t border-gray-100 bg-white px-6 py-12 sm:px-10 lg:px-12">
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 sm:grid-cols-3">
                    <div className="space-y-2 p-6 text-center">
                        <div className="text-5xl font-bold text-brand-500">5.000+</div>
                        <div className="text-base text-gray-600">bài học & đề thi trực tuyến</div>
                    </div>

                    <div className="space-y-2 p-6 text-center">
                        <div className="text-5xl font-bold text-brand-500">98%</div>
                        <div className="text-base text-gray-600">học viên tự tin hơn sau khi ôn luyện</div>
                    </div>

                    <div className="space-y-2 p-6 text-center">
                        <div className="text-5xl font-bold text-brand-500">1.000+</div>
                        <div className="text-base text-gray-600">học viên đã đạt kết quả cao trong các kỳ thi</div>
                    </div>
                </div>
            </section>

            {/* 5. Key Features Section */}
            <section className="w-full bg-gray-50 px-6 py-20 sm:px-10 lg:px-12">
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Left Features List */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Được Xây Dựng Cho <span className="text-brand-500">Khảo Thí Trực Tuyến</span> Chuyên Nghiệp
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-brand-500 shadow-xs">
                                    <Monitor className="h-6 w-6" />
                                </div>
                                <p className="pt-2 text-base leading-relaxed text-gray-600">
                                    Giao diện đơn giản, trực quan giúp bạn tập trung vào bài thi - không cần lo lắng về công nghệ phức tạp.
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-brand-500 shadow-xs">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <p className="pt-2 text-base leading-relaxed text-gray-600">
                                    Thi trực tuyến mọi lúc, mọi nơi với kết quả tức thì và báo cáo chi tiết ngay sau khi hoàn thành.
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-brand-500 shadow-xs">
                                    <BarChart3 className="h-6 w-6" />
                                </div>
                                <p className="pt-2 text-base leading-relaxed text-gray-600">
                                    Xem kết quả và phân tích chi tiết ngay lập tức: điểm số, thời gian, và đánh giá năng lực từng phần.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Features Image */}
                    <div className="flex justify-center">
                        <div className="relative max-w-[480px]">
                            <Image
                                src="/images/banner/peoplecontact.png"
                                alt="Hệ thống khảo thí trực tuyến Rikkei Education"
                                width={480}
                                height={380}
                                className="h-auto w-full object-contain drop-shadow-md"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
