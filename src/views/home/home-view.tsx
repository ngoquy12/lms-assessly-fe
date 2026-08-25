"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, CheckCircle2, Clock, KeyRound, Layers, Loader2, Monitor, PlayCircle, Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAssignedExam } from "@/hooks/queries/use-exam";
import { usePracticeList } from "@/hooks/queries/use-practice";

export function HomeView() {
    const router = useRouter();
    const tHome = useTranslations("home");
    const tCommon = useTranslations("common");
    const tPractice = useTranslations("practice");
    const { data, isLoading, isError, refetch } = usePracticeList();
    const practices = data ?? [];
    const { data: assignedExam } = useAssignedExam();
    const categories = Array.from(new Set(practices.map((p) => p.category)));
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Exam Session States: "WAITING" (chờ mở phòng) | "LIVE" (đang diễn ra)
    const [examStatus, setExamStatus] = useState<"WAITING" | "LIVE">("WAITING");
    const [countdownSeconds, setCountdownSeconds] = useState<number>(120); // 2 minutes countdown
    const [isWaitingRoomOpen, setIsWaitingRoomOpen] = useState(false);
    const [isPasscodeDialogOpen, setIsPasscodeDialogOpen] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [passcodeError, setPasscodeError] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Countdown Timer logic
    useEffect(() => {
        if (examStatus === "WAITING" && countdownSeconds > 0) {
            const timer = setInterval(() => {
                setCountdownSeconds((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setExamStatus("LIVE");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [examStatus, countdownSeconds]);

    // Auto-redirect to passcode dialog when countdown hits 0 inside Waiting Room modal
    useEffect(() => {
        if (examStatus === "LIVE" && isWaitingRoomOpen && !isRedirecting) {
            setIsRedirecting(true);
            const redirectTimer = setTimeout(() => {
                setIsWaitingRoomOpen(false);
                setIsRedirecting(false);
                setIsPasscodeDialogOpen(true);
            }, 1200);
            return () => clearTimeout(redirectTimer);
        }
    }, [examStatus, isWaitingRoomOpen, isRedirecting]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const formatMinutes = (secs: number) => {
        return Math.floor(secs / 60)
            .toString()
            .padStart(2, "0");
    };

    const formatSeconds = (secs: number) => {
        return (secs % 60).toString().padStart(2, "0");
    };

    const handleEnterLiveExam = (e: React.FormEvent) => {
        e.preventDefault();
        setPasscodeError("");

        if (!passcode.trim()) {
            setPasscodeError("Vui lòng nhập mã phòng thi do giám thị cung cấp.");
            return;
        }

        if (!assignedExam || passcode.trim().toUpperCase() !== assignedExam.passcode) {
            setPasscodeError("Mã phòng thi không chính xác hoặc chưa được giám thị kích hoạt.");
            return;
        }

        setIsPasscodeDialogOpen(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push(`/exam/${assignedExam.id}` as any);
    };

    const filteredExams = selectedCategory ? practices.filter((p) => p.category === selectedCategory) : practices;

    return (
        <div className="w-full font-sans text-gray-800">
            {/* 1. Hero Section */}
            <section className="w-full bg-linear-to-b from-white to-gray-50 px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
                <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left Hero Content */}
                    <div className="flex flex-col gap-6">
                        <h1 className="text-4xl leading-[1.2] font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-display-xl">
                            {tHome("hero.titlePart1")} <span className="text-brand-500">{tHome("hero.titleHighlight1")}</span> {tHome("hero.titlePart2")}{" "}
                            <span className="text-brand-500">{tHome("hero.titleHighlight2")}</span>{" "}
                            <span className="ml-2 inline-block text-display-sm">✨</span>
                        </h1>

                        <p className="max-w-xl text-base leading-[1.6] text-gray-600 sm:text-lg">{tHome("hero.description")}</p>

                        <div className="flex items-center gap-3 pt-2 sm:gap-4">
                            <Link href="/practice" className="flex-1 sm:flex-initial">
                                <button
                                    type="button"
                                    className="w-full cursor-pointer rounded-full bg-brand-500 px-4 py-3 text-center text-sm font-medium whitespace-nowrap text-white shadow-xs transition-all hover:bg-brand-600 sm:px-8 sm:py-3.5 sm:text-base"
                                >
                                    {tPractice("startPractice")}
                                </button>
                            </Link>
                            <Link href="/huong-dan" className="flex-1 sm:flex-initial">
                                <button
                                    type="button"
                                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border-2 border-brand-500 bg-white px-4 py-3 text-sm font-medium whitespace-nowrap text-brand-500 shadow-xs transition-all hover:bg-red-50/50 sm:gap-2 sm:px-8 sm:py-3.5 sm:text-base"
                                >
                                    <PlayCircle className="h-4 w-4 shrink-0 text-brand-500 sm:h-5 sm:w-5" />
                                    <span>{tHome("hero.viewGuide")}</span>
                                </button>
                            </Link>
                        </div>

                        {/* Assigned / Upcoming Exam Session Hub Card */}
                        <div className="mt-1 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:border-red-200 hover:shadow-sm sm:p-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0 space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {examStatus === "LIVE" ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-bold text-[#ab1f24]">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ab1f24]"></span>
                                                </span>
                                                <span>Ca thi đang diễn ra</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200/80 bg-red-50 px-2.5 py-0.5 text-xs font-bold text-[#ab1f24]">
                                                <Clock className="h-3.5 w-3.5 text-[#ab1f24]" />
                                                <span>Ca thi sắp mở phòng</span>
                                            </span>
                                        )}
                                        <span className="text-xs font-medium text-slate-500">{assignedExam?.category}</span>
                                    </div>

                                    <h3 className="truncate text-sm leading-snug font-bold text-slate-900 sm:text-[15px]">{assignedExam?.title}</h3>

                                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                                        <span>
                                            Thời gian: <strong>{assignedExam?.duration}</strong>
                                        </span>
                                        <span>•</span>
                                        <span>
                                            Số câu: <strong>{assignedExam?.questionCount} câu</strong>
                                        </span>
                                        {examStatus === "WAITING" && (
                                            <>
                                                <span>•</span>
                                                <span>
                                                    Mở sau: <strong className="font-bold text-[#ab1f24]">{formatTime(countdownSeconds)}</strong>
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2 pt-1 sm:pt-0">
                                    {examStatus === "LIVE" ? (
                                        <Button
                                            type="button"
                                            onClick={() => setIsPasscodeDialogOpen(true)}
                                            className="h-10.5 w-full cursor-pointer rounded-xl bg-[#ab1f24] px-5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#8b1a1f] sm:w-auto sm:text-sm"
                                        >
                                            <KeyRound className="mr-1.5 h-4 w-4" />
                                            <span>Nhập mã vào phòng thi</span>
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={() => setIsWaitingRoomOpen(true)}
                                            className="h-10.5 w-full cursor-pointer rounded-xl bg-[#ab1f24] px-5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#8b1a1f] sm:w-auto sm:text-sm"
                                        >
                                            <Timer className="mr-1.5 h-4 w-4" />
                                            <span>Vào phòng chờ</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
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
                                    <div className="text-sm leading-tight font-semibold text-gray-800">{tHome("hero.badgeDaily")}</div>
                                    <div className="mt-1 text-xs text-gray-400">{tHome("hero.badgeDailySub")}</div>
                                </div>

                                {/* Badge Middle Right */}
                                <div className="absolute top-1/2 right-6 max-w-[210px] -translate-y-1/2 rotate-2 transform rounded-xl border border-gray-100/60 bg-white/95 p-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                                    <div className="text-sm leading-tight font-semibold text-gray-800">{tHome("hero.badgeEasy")}</div>
                                    <div className="mt-1 text-xs text-gray-400">{tHome("hero.badgeEasySub")}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Curated Practice Exams Section */}
            <section className="w-full bg-gray-50 px-6 py-20 sm:px-10">
                <div className="mx-auto max-w-[1440px]">
                    <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-display-lg">
                        {tHome("topicsSection.title")} <span className="text-brand-500">{tHome("topicsSection.titleHighlight")}</span>{" "}
                        {tHome("topicsSection.titleSuffix")}
                    </h2>
                    <p className="mx-auto mb-10 max-w-3xl text-center text-base text-gray-600 sm:text-lg">{tHome("topicsSection.description")}</p>

                    {/* Filter Tabs */}
                    <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory(null)}
                            className={`cursor-pointer rounded-lg px-6 py-3 text-base font-medium transition-all ${
                                selectedCategory === null ? "bg-brand-500 text-white shadow-xs" : "bg-white text-gray-800 hover:bg-brand-500 hover:text-white"
                            }`}
                        >
                            {tHome("topicsSection.allTopics")}
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
                                {tCommon("all")} +
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
                                                <Badge
                                                    variant="primary"
                                                    className="pointer-events-none border-red-200/80 bg-red-50 font-semibold text-[#ab1f24]"
                                                    size="sm"
                                                >
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
                                                    className="pointer-events-none"
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
            <section className="w-full bg-white px-6 py-20 sm:px-10">
                <div className="mx-auto max-w-[1440px] space-y-4 text-center">
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
            <section className="w-full border-t border-gray-100 bg-white px-6 py-12 sm:px-10">
                <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 sm:grid-cols-3">
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
            <section className="w-full bg-gray-50 px-6 py-20 sm:px-10">
                <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
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

            {/* Modal 1: Phòng Chờ Thi Trực Tuyến Tối Giản */}
            <Dialog open={isWaitingRoomOpen} onOpenChange={setIsWaitingRoomOpen}>
                <DialogContent size="md" className="max-w-[420px] gap-5 rounded-2xl border-0 bg-white px-6 py-6 shadow-2xl">
                    <DialogHeader className="space-y-2 pb-0 text-center sm:text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#ab1f24]">
                            <Timer className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-900">Phòng chờ ca thi</DialogTitle>
                            <DialogDescription className="mt-1 line-clamp-1 text-xs text-slate-500">{assignedExam?.title}</DialogDescription>
                        </div>
                    </DialogHeader>

                    {/* Real-time Countdown Core */}
                    {examStatus === "WAITING" ? (
                        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 text-center">
                            <span className="block text-xs font-semibold text-slate-500">Thời gian còn lại để mở phòng thi</span>
                            <div className="flex items-center justify-center gap-2">
                                <div className="min-w-[80px] rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                                    <div className="font-mono text-3xl font-bold text-slate-900 sm:text-4xl">{formatMinutes(countdownSeconds)}</div>
                                    <div className="mt-0.5 text-[10px] font-bold text-slate-400">Phút</div>
                                </div>
                                <span className="text-2xl font-bold text-slate-400">:</span>
                                <div className="min-w-[80px] rounded-xl border border-red-200 bg-white p-3 shadow-xs">
                                    <div className="font-mono text-3xl font-bold text-[#ab1f24] sm:text-4xl">{formatSeconds(countdownSeconds)}</div>
                                    <div className="mt-0.5 text-[10px] font-bold text-slate-400">Giây</div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400">Hệ thống sẽ tự động chuyển vào bài thi khi hết giờ</p>
                        </div>
                    ) : (
                        <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-700">
                                <CheckCircle2 className="h-5 w-5 animate-bounce text-emerald-600" />
                                <span>Ca thi đã mở!</span>
                            </div>
                            <p className="text-xs text-slate-500">Đang chuyển sang màn hình nhập mã...</p>
                            <div className="flex justify-center pt-1">
                                <Loader2 className="h-5 w-5 animate-spin text-[#ab1f24]" />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex-row items-center justify-center gap-2 pt-0 sm:justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsWaitingRoomOpen(false)}
                            className="h-11 flex-1 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
                        >
                            Đóng
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                setExamStatus("LIVE");
                                setCountdownSeconds(0);
                                setIsWaitingRoomOpen(false);
                                setIsPasscodeDialogOpen(true);
                            }}
                            className="h-11 flex-1 rounded-xl bg-[#ab1f24] text-xs font-bold text-white shadow-xs hover:bg-[#8b1a1f] sm:text-sm"
                        >
                            Vào thi ngay
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal 2: Xác Thực Nhập Mã Phòng Thi Tối Giản */}
            <Dialog open={isPasscodeDialogOpen} onOpenChange={setIsPasscodeDialogOpen}>
                <DialogContent size="md" className="max-w-[420px] gap-5 rounded-2xl border-0 bg-white px-6 py-6 shadow-2xl">
                    <DialogHeader className="space-y-2 pb-0 text-center sm:text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#ab1f24]">
                            <KeyRound className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-900">Nhập mã phòng thi</DialogTitle>
                            <DialogDescription className="mt-1 line-clamp-1 text-xs text-slate-500">{assignedExam?.title}</DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleEnterLiveExam} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Nhập mã do giám thị cấp..."
                                    value={passcode}
                                    onChange={(e) => {
                                        setPasscode(e.target.value);
                                        if (passcodeError) setPasscodeError("");
                                    }}
                                    autoFocus
                                    className="h-13 rounded-xl border-slate-200 bg-slate-50/70 text-center font-mono text-lg font-bold tracking-widest text-slate-900 uppercase transition-all placeholder:font-sans placeholder:text-xs placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#ab1f24] focus:bg-white focus:ring-1 focus:ring-[#ab1f24]"
                                />
                            </div>
                            {passcodeError && <p className="text-center text-xs font-semibold text-red-600">{passcodeError}</p>}
                        </div>

                        <DialogFooter className="flex-row items-center justify-center gap-2 pt-2 sm:justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsPasscodeDialogOpen(false)}
                                className="h-11 flex-1 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="h-11 flex-1 rounded-xl bg-[#ab1f24] text-xs font-bold text-white shadow-xs hover:bg-[#8b1a1f] sm:text-sm"
                            >
                                <span>Vào thi</span>
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
