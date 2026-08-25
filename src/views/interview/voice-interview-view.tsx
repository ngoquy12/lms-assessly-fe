"use client";

import { useEffect, useState } from "react";
import { Bot, Clock, Mic, MicOff, PhoneOff, Wifi } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function VoiceInterviewView({ sessionId }: { sessionId: string }) {
    const router = useRouter();
    const [isAiSpeaking, setIsAiSpeaking] = useState(true);
    const [isListeningCandidate, setIsListeningCandidate] = useState(false);
    const [secondsElapsed, setSecondsElapsed] = useState(48);

    useEffect(() => {
        const timer = setInterval(() => setSecondsElapsed((prev) => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    const timeDisplay = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    const handleEndInterview = () => {
        router.push(`/interview/result/${sessionId}`);
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-[#0f172a] font-sans text-white select-none">
            {/* Top Bar */}
            <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/images/header/logo-rikkei2 1.png"
                                alt="RikkeiEdu"
                                width={110}
                                height={38}
                                className="h-9 w-auto object-contain brightness-0 invert"
                                priority
                            />
                        </Link>
                        <div className="hidden border-l border-slate-700 pl-4 sm:block">
                            <h1 className="text-sm font-bold text-slate-100">AI Voice Interviewer — Frontend React / Next.js</h1>
                            <p className="text-xs text-slate-400">Phiên phỏng vấn mô phỏng kỹ thuật thời gian thực</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 font-mono text-sm font-bold text-white shadow-2xs">
                            <Clock className="h-4 w-4 text-red-400" />
                            <span>{timeDisplay}</span>
                        </div>

                        <Button
                            onClick={handleEndInterview}
                            className="h-10 gap-1.5 rounded-xl bg-[#ab1f24] px-4 text-xs font-bold text-white shadow-md hover:bg-[#8b1a1f] sm:text-sm"
                        >
                            <PhoneOff className="h-4 w-4" />
                            <span>Kết thúc phỏng vấn</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Interactive Stage */}
            <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center space-y-8 px-4 py-8">
                {/* AI Avatar Pulse Animation */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute h-48 w-48 animate-ping rounded-full bg-red-600/20 opacity-60" />
                    <div className="absolute h-36 w-36 animate-pulse rounded-full bg-red-500/30" />
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-red-400/40 bg-linear-to-tr from-[#ab1f24] to-red-800 text-white shadow-2xl">
                        <Bot className="h-12 w-12 text-white" />
                    </div>
                </div>

                {/* Subtitle / Question Box */}
                <Card className="w-full rounded-2xl border-slate-800 bg-slate-900/90 text-center shadow-2xl backdrop-blur-md">
                    <CardContent className="space-y-3 p-6">
                        <Badge variant="outline" className="border-red-400/40 bg-red-500/20 px-3 py-0.5 text-xs font-semibold text-red-300">
                            {isAiSpeaking ? "AI Interviewer đang đặt câu hỏi..." : "Đang lắng nghe câu trả lời của bạn..."}
                        </Badge>
                        <p className="text-base leading-relaxed font-semibold text-slate-100 sm:text-lg">
                            &quot;Bạn có thể giải thích sự khác biệt cốt lõi giữa Server Components và Client Components trong Next.js không? Khi nào nên chọn
                            từng loại?&quot;
                        </p>
                    </CardContent>
                </Card>

                {/* Audio Waveform visualization mockup */}
                <div className="flex h-10 items-center gap-1.5">
                    {[16, 28, 44, 20, 36, 48, 24, 40, 16, 32, 44, 20].map((h, i) => (
                        <div key={i} className="w-1.5 animate-pulse rounded-full bg-red-400" style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }} />
                    ))}
                </div>
            </main>

            {/* Bottom Controls */}
            <footer className="border-t border-slate-800 bg-slate-900/80 px-6 py-4">
                <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2 font-medium text-emerald-400">
                        <Wifi className="h-4 w-4" />
                        <span>Realtime WebRTC Audio Stream Active (Độ trễ: 32ms)</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            size="lg"
                            className={`h-11 gap-2 rounded-xl px-6 font-bold shadow-md transition-all ${
                                isListeningCandidate ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-[#ab1f24] text-white hover:bg-[#8b1a1f]"
                            }`}
                            onClick={() => {
                                setIsListeningCandidate(!isListeningCandidate);
                                setIsAiSpeaking(isListeningCandidate);
                            }}
                        >
                            {isListeningCandidate ? (
                                <>
                                    <MicOff className="h-4 w-4" />
                                    <span>Đang thu âm (Bấm để gửi câu trả lời)</span>
                                </>
                            ) : (
                                <>
                                    <Mic className="h-4 w-4" />
                                    <span>Bật mic trả lời</span>
                                </>
                            )}
                        </Button>
                    </div>

                    <span className="font-mono text-slate-500">Mã phiên: {sessionId}</span>
                </div>
            </footer>
        </div>
    );
}
