"use client";

import { useEffect, useState } from "react";
import { Bot, Clock, Mic, PhoneOff, Wifi } from "lucide-react";
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
        <div className="flex min-h-screen flex-col justify-between bg-slate-950 p-4 text-white select-none sm:p-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 font-bold text-white shadow-xs">A</div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-100">AI Voice Interviewer — Frontend React / Next.js</h1>
                        <p className="text-xs text-slate-400">Phiên phỏng vấn mô phỏng kỹ thuật thời gian thực</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs font-bold text-brand-300">
                        <Clock className="h-3.5 w-3.5 text-brand-400" />
                        <span>{timeDisplay}</span>
                    </div>

                    <Button variant="destructive" size="sm" onClick={handleEndInterview} className="gap-1.5">
                        <PhoneOff className="h-4 w-4" />
                        <span>Kết thúc phỏng vấn</span>
                    </Button>
                </div>
            </div>

            {/* Main Interactive Stage */}
            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center space-y-8 py-8">
                {/* AI Avatar Pulse Animation */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute h-48 w-48 animate-ping rounded-full bg-brand-600/20 opacity-60" />
                    <div className="absolute h-36 w-36 animate-pulse rounded-full bg-brand-500/30" />
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-brand-400/40 bg-linear-to-tr from-brand-700 to-indigo-600 text-white shadow-2xl">
                        <Bot className="h-12 w-12 text-white" />
                    </div>
                </div>

                {/* Subtitle / Question Box */}
                <Card size="md" className="w-full border-slate-800 bg-slate-900/90 text-center shadow-2xl backdrop-blur-md">
                    <CardContent className="space-y-2 p-6">
                        <Badge variant="primary" className="mb-1 border-brand-500/40 bg-brand-500/20 text-brand-300">
                            {isAiSpeaking ? "AI Interviewer đang đặt câu hỏi..." : "Đang lắng nghe câu trả lời của bạn..."}
                        </Badge>
                        <p className="text-base leading-relaxed font-semibold text-slate-100">
                            &quot;Bạn có thể giải thích sự khác biệt cốt lõi giữa Server Components và Client Components trong Next.js 16 không?&quot;
                        </p>
                    </CardContent>
                </Card>

                {/* Audio Waveform visualization mockup */}
                <div className="flex h-10 items-center gap-1.5">
                    {[16, 28, 44, 20, 36, 48, 24, 40, 16, 32, 44, 20].map((h, i) => (
                        <div key={i} className="w-1.5 animate-pulse rounded-full bg-brand-400" style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }} />
                    ))}
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-emerald-400">
                    <Wifi className="h-4 w-4" />
                    <span>Realtime WebRTC Audio Stream Active</span>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        size="md"
                        variant={isListeningCandidate ? "default" : "secondary"}
                        className="gap-2 rounded-full px-6"
                        onClick={() => {
                            setIsListeningCandidate(!isListeningCandidate);
                            setIsAiSpeaking(isListeningCandidate);
                        }}
                    >
                        <Mic className="h-4 w-4" />
                        <span>{isListeningCandidate ? "Đang nói (Nhấn để dừng)" : "Nhấn để trả lời"}</span>
                    </Button>
                </div>

                <span>Mã phiên: {sessionId}</span>
            </div>
        </div>
    );
}
