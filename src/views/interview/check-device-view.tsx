"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Mic, Volume2, Wifi } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeaderNav } from "@/components/layout/header-nav";
import { HeaderUserActions } from "@/components/layout/header-user-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function CheckDeviceView({ positionId }: { positionId: string }) {
    const router = useRouter();
    const micVolume = 85;
    const [isTestingAudio, setIsTestingAudio] = useState(false);

    const handleStartSession = () => {
        router.push(`/ai-interview/session/${positionId}`);
    };

    const handleTestSound = () => {
        setIsTestingAudio(true);
        setTimeout(() => setIsTestingAudio(false), 1500);
    };

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-slate-900">
            {/* 1. Header (Brand Logo + 5 Navigation Tabs + Candidate Profile) */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white shadow-2xs">
                <div className="relative mx-auto flex h-18 max-w-[1440px] items-center justify-between px-6 sm:px-10">
                    {/* Left: Brand Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/images/header/logo-rikkei2 1.png"
                                alt="RikkeiEdu"
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

            {/* 2. Main Content */}
            <main className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10">
                <div className="mx-auto max-w-3xl space-y-6">
                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                            <Link href="/interview" className="transition-colors hover:text-[#ab1f24]">
                                Phỏng vấn AI
                            </Link>
                            <span>/</span>
                            <span className="font-bold text-slate-900">Kiểm tra thiết bị âm thanh</span>
                        </div>
                        <Badge variant="outline" className="border-red-200 bg-red-50 text-xs font-semibold text-[#ab1f24]">
                            Bước 1: Chuẩn bị thiết bị
                        </Badge>
                    </div>

                    <Card className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
                        <CardHeader className="p-0 pb-2 text-center">
                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#ab1f24]">
                                <Mic className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-xl font-bold text-slate-900 sm:text-2xl">Kiểm tra âm thanh & Microphone</CardTitle>
                            <CardDescription className="text-sm text-slate-600">
                                Đảm bảo hệ thống AI Interviewer có thể nghe rõ giọng nói của bạn trong suốt phiên thoại.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5 p-0">
                            {/* Mic Test */}
                            <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                        <Mic className="h-4 w-4 text-[#ab1f24]" />
                                        <span>Tín hiệu Microphone</span>
                                    </div>
                                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-xs font-semibold text-emerald-700">
                                        Hoạt động tốt
                                    </Badge>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>Mức âm lượng thu âm:</span>
                                        <span className="font-mono font-bold text-emerald-700">{micVolume}%</span>
                                    </div>
                                    <Progress value={micVolume} className="h-2" />
                                </div>
                                <p className="text-2xs text-slate-400">Hãy thử nói một câu vào microphone để kiểm tra thanh âm lượng</p>
                            </div>

                            {/* Speaker Test */}
                            <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                        <Volume2 className="h-4 w-4 text-indigo-600" />
                                        <span>Loa & Tai nghe phát âm</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleTestSound}
                                        disabled={isTestingAudio}
                                        className="h-8 gap-1.5 rounded-lg border-slate-200 text-xs font-semibold"
                                    >
                                        <Volume2 className="h-3.5 w-3.5" />
                                        <span>{isTestingAudio ? "Đang phát âm thanh mẫu..." : "Phát âm thanh thử"}</span>
                                    </Button>
                                </div>
                                <p className="text-2xs text-slate-400">Nhấn nút phát âm thanh thử để đảm bảo bạn nghe rõ câu hỏi của AI Interviewer</p>
                            </div>

                            {/* Network Status */}
                            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-900">
                                <div className="flex items-center gap-2">
                                    <Wifi className="h-4 w-4 text-emerald-600" />
                                    <span>Đường truyền kết nối Audio Stream: Rất tốt (Độ trễ &lt; 35ms)</span>
                                </div>
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                                <Link href="/interview">
                                    <Button
                                        variant="outline"
                                        className="h-11 gap-2 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span>Quay lại</span>
                                    </Button>
                                </Link>

                                <Button
                                    size="lg"
                                    onClick={handleStartSession}
                                    className="h-11 flex-1 gap-2 rounded-xl bg-[#ab1f24] px-6 text-xs font-bold text-white shadow-md hover:bg-[#8b1a1f] sm:flex-initial sm:text-sm"
                                >
                                    <span>Thiết bị đã sẵn sàng — Vào phỏng vấn</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
