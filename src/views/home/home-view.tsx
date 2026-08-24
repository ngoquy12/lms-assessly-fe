"use client";

import { useState } from "react";
import { BarChart3, Clock, Monitor, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TOPIC_TABS = [
    { id: "all", name: "Tất cả chủ đề" },
    { id: "java", name: "Java Core & Spring" },
    { id: "frontend", name: "ReactJS & Frontend" },
    { id: "database", name: "Database & SQL" },
    { id: "embedded", name: "Lập trình C/C++" },
];

const CURATED_EXAMS = [
    {
        id: "exam-1",
        title: "Đề Thi Khảo Sát Năng Lực Lập Trình Java Căn Bản",
        description: "Kiểm tra kiến thức cốt lõi về OOP, Collection Framework, Exception Handling và đa luồng.",
        image: "/images/bannerPractice/practice1.png",
        tag: "Công khai",
        topicId: "java",
        questionCount: 40,
        duration: "60 phút",
    },
    {
        id: "exam-2",
        title: "Đề Thi Luyện Tập ReactJS & Next.js Toàn Diện",
        description: "Đánh giá khả năng xây dựng ứng dụng với React 19, Hooks, Server Components và State Management.",
        image: "/images/bannerPractice/practice2.png",
        tag: "Công khai",
        topicId: "frontend",
        questionCount: 35,
        duration: "45 phút",
    },
    {
        id: "exam-3",
        title: "Bộ Đề Luyện Thi SQL Server & Tối Ưu Truy Vấn",
        description: "Đánh giá kỹ năng viết truy vấn phức tạp, Indexing, Transaction và thiết kế cơ sở dữ liệu quan hệ.",
        image: "/images/bannerPractice/practice3.png",
        tag: "Công khai",
        topicId: "database",
        questionCount: 30,
        duration: "45 phút",
    },
    {
        id: "exam-4",
        title: "Đề Thi Khảo Sát Kiến Thức C++ & Cấu Trúc Dữ Liệu",
        description: "Kiểm tra tư duy giải thuật, quản lý bộ nhớ con trỏ, STL và tối ưu hóa hiệu năng ứng dụng.",
        image: "/images/bannerPractice/practice1.png",
        tag: "Công khai",
        topicId: "embedded",
        questionCount: 40,
        duration: "60 phút",
    },
];

export function HomeView() {
    const [selectedTopic, setSelectedTopic] = useState("all");

    const filteredExams = selectedTopic === "all" ? CURATED_EXAMS : CURATED_EXAMS.filter((e) => e.topicId === selectedTopic);

    return (
        <div className="w-full font-sans text-[#1e2328]">
            {/* 1. Hero Section */}
            <section className="w-full bg-linear-to-b from-[#ffffff] to-[#f3f4f6] px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
                <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left Hero Content */}
                    <div className="flex flex-col gap-6">
                        <h1 className="text-4xl leading-[1.2] font-bold tracking-tight text-[#000000] sm:text-5xl lg:text-[56px]">
                            Mỗi <span className="text-[#ab1f24]">Bài Thi</span> giúp bạn đánh giá và nâng cao{" "}
                            <span className="text-[#ab1f24]">Năng Lực Của Mình!</span> <span className="ml-2 inline-block text-[32px]">✨</span>
                        </h1>

                        <p className="max-w-xl text-base leading-[1.6] text-[#374151] sm:text-lg">
                            Hệ thống khảo thí trực tuyến chuyên nghiệp giúp bạn đánh giá chính xác kiến thức và kỹ năng. Hãy bắt đầu thi ngay để khám phá năng
                            lực thực sự của bạn!
                        </p>

                        <div className="flex items-center gap-4 pt-2">
                            <Link href="/huong-dan">
                                <button
                                    type="button"
                                    className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-[#ab1f24] bg-white px-8 py-3.5 text-base font-medium text-[#ab1f24] shadow-xs transition-all hover:bg-red-50/50"
                                >
                                    <PlayCircle className="h-5 w-5 text-[#ab1f24]" />
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
                                    <div className="text-sm leading-tight font-semibold text-[#1e2328]">Đề thi mới mỗi ngày</div>
                                    <div className="mt-1 text-xs text-[#6b7280]">Cập nhật liên tục - đừng bỏ lỡ!</div>
                                </div>

                                {/* Badge Middle Right */}
                                <div className="absolute top-1/2 right-6 max-w-[210px] -translate-y-1/2 rotate-2 transform rounded-xl border border-gray-100/60 bg-white/95 p-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                                    <div className="text-sm leading-tight font-semibold text-[#1e2328]">Học dễ dàng</div>
                                    <div className="mt-1 text-xs text-[#6b7280]">Hoàn thành bài thi. Kết quả xuất sắc!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Curated Practice Exams Section */}
            <section className="w-full bg-[#f3f4f6] px-6 py-20 sm:px-10 lg:px-12">
                <div className="mx-auto max-w-[1400px]">
                    <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#000000] sm:text-4xl lg:text-[42px]">
                        Đề Thi Theo Chủ Đề: <span className="text-[#ab1f24]">Đánh Giá Năng Lực</span> Chính Xác
                    </h2>
                    <p className="mx-auto mb-10 max-w-3xl text-center text-base text-[#374151] sm:text-lg">
                        Khám phá các đề thi được phân loại theo chủ đề, giúp bạn đánh giá chính xác kiến thức và kỹ năng của mình ở từng lĩnh vực.
                    </p>

                    {/* Filter Tabs */}
                    <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
                        {TOPIC_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setSelectedTopic(tab.id)}
                                className={`cursor-pointer rounded-lg px-6 py-3 text-base font-medium transition-all ${
                                    selectedTopic === tab.id
                                        ? "bg-[#ab1f24] text-white shadow-xs"
                                        : "bg-white text-[#1e2328] hover:bg-[#ab1f24] hover:text-white"
                                }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                        <Link href="/topics">
                            <button
                                type="button"
                                className="cursor-pointer rounded-lg border border-dashed border-gray-300 bg-white px-6 py-3 text-base font-medium text-[#1e2328] transition-all hover:border-[#ab1f24] hover:text-[#ab1f24]"
                            >
                                Xem thêm +
                            </button>
                        </Link>
                    </div>

                    {/* Exams Cards Grid */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {filteredExams.map((exam) => (
                            <Link key={exam.id} href={`/practice-public/${exam.id}`}>
                                <div className="group flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1.5 hover:shadow-xl">
                                    <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
                                        <Image
                                            src={exam.image}
                                            alt={exam.title}
                                            width={320}
                                            height={200}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3 rounded bg-[#10b981] px-2.5 py-1 text-xs font-medium text-white">{exam.tag}</div>
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                                        <div className="space-y-2">
                                            <h3 className="line-clamp-2 text-lg font-bold text-[#1e2328] transition-colors group-hover:text-[#ab1f24]">
                                                {exam.title}
                                            </h3>
                                            <p className="line-clamp-2 text-sm leading-relaxed text-[#6b7280]">{exam.description}</p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-medium text-[#6b7280]">
                                            <span>{exam.questionCount} câu hỏi</span>
                                            <span>{exam.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Future-Proof Assessment Banner */}
            <section className="w-full bg-white px-6 py-20 sm:px-10 lg:px-12">
                <div className="mx-auto max-w-[1400px] space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[#000000] sm:text-4xl">
                        <span className="text-[#ab1f24]">Đánh Giá Năng Lực</span> Chính Xác Với Hệ Thống Khảo Thí Trực Tuyến
                    </h2>
                    <p className="mx-auto max-w-[900px] text-base leading-[1.6] text-[#374151] sm:text-lg">
                        Hệ thống khảo thí trực tuyến chuyên nghiệp giúp bạn đánh giá chính xác kiến thức và kỹ năng. Thi mọi lúc, mọi nơi với giao diện thân
                        thiện và kết quả tức thì. Bất kể bạn ở đâu hay thời gian nào, luôn có thể kiểm tra năng lực của mình.
                    </p>
                </div>
            </section>

            {/* 4. Statistics Counter Section */}
            <section className="w-full border-t border-gray-100 bg-white px-6 py-12 sm:px-10 lg:px-12">
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 sm:grid-cols-3">
                    <div className="space-y-2 p-6 text-center">
                        <div className="text-5xl font-bold text-[#ab1f24]">5.000+</div>
                        <div className="text-base text-[#374151]">bài học & đề thi trực tuyến</div>
                    </div>

                    <div className="space-y-2 p-6 text-center">
                        <div className="text-5xl font-bold text-[#ab1f24]">98%</div>
                        <div className="text-base text-[#374151]">học viên tự tin hơn sau khi ôn luyện</div>
                    </div>

                    <div className="space-y-2 p-6 text-center">
                        <div className="text-5xl font-bold text-[#ab1f24]">1.000+</div>
                        <div className="text-base text-[#374151]">học viên đã đạt kết quả cao trong các kỳ thi</div>
                    </div>
                </div>
            </section>

            {/* 5. Key Features Section */}
            <section className="w-full bg-[#f3f4f6] px-6 py-20 sm:px-10 lg:px-12">
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Left Features List */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight text-[#000000] sm:text-4xl">
                            Được Xây Dựng Cho <span className="text-[#ab1f24]">Khảo Thí Trực Tuyến</span> Chuyên Nghiệp
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#ab1f24] shadow-xs">
                                    <Monitor className="h-6 w-6" />
                                </div>
                                <p className="pt-2 text-base leading-relaxed text-[#374151]">
                                    Giao diện đơn giản, trực quan giúp bạn tập trung vào bài thi - không cần lo lắng về công nghệ phức tạp.
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#ab1f24] shadow-xs">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <p className="pt-2 text-base leading-relaxed text-[#374151]">
                                    Thi trực tuyến mọi lúc, mọi nơi với kết quả tức thì và báo cáo chi tiết ngay sau khi hoàn thành.
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#ab1f24] shadow-xs">
                                    <BarChart3 className="h-6 w-6" />
                                </div>
                                <p className="pt-2 text-base leading-relaxed text-[#374151]">
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
