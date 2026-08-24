"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Mic, Volume2, Wifi } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function CheckDeviceView({ positionId }: { positionId: string }) {
    const router = useRouter();
    const micVolume = 75;
    const [isTestingAudio, setIsTestingAudio] = useState(false);

    const handleStartSession = () => {
        router.push(`/ai-interview/session/${positionId}`);
    };

    const handleTestSound = () => {
        setIsTestingAudio(true);
        setTimeout(() => setIsTestingAudio(false), 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/interview" className="flex items-center gap-2 text-xs text-gray-500 hover:text-brand-600">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Quay lại danh sách vị trí</span>
                    </Link>
                    <Badge variant="secondary">Bước 1: Kiểm tra thiết bị</Badge>
                </div>

                <Card size="md" className="shadow-card-sm border-gray-200">
                    <CardHeader className="pb-2 text-center">
                        <CardTitle className="text-xl font-bold text-gray-900">Kiểm Tra Âm Thanh & Microphone</CardTitle>
                        <CardDescription>Đảm bảo AI có thể nghe rõ giọng nói của bạn trong suốt phiên phỏng vấn</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-4">
                        {/* Mic Test */}
                        <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50/60 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <Mic className="h-4 w-4 text-brand-600" />
                                    <span>Tín hiệu Microphone</span>
                                </div>
                                <Badge variant="success">Hoạt động tốt</Badge>
                            </div>

                            <div className="space-y-1.5">
                                <div className="text-2xs flex justify-between text-gray-500">
                                    <span>Mức âm lượng thu âm:</span>
                                    <span className="font-semibold text-emerald-600">{micVolume}%</span>
                                </div>
                                <Progress value={micVolume} size="md" />
                            </div>
                            <p className="text-2xs text-gray-500">Hãy thử nói một câu vào micro để kiểm tra thanh âm lượng</p>
                        </div>

                        {/* Speaker Test */}
                        <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50/60 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <Volume2 className="h-4 w-4 text-indigo-600" />
                                    <span>Loa & Tai nghe phát âm</span>
                                </div>
                                <Button size="sm" variant="outline" onClick={handleTestSound} disabled={isTestingAudio} className="gap-1.5 text-xs">
                                    <Volume2 className="h-3.5 w-3.5" />
                                    <span>{isTestingAudio ? "Đang phát âm thanh mẫu..." : "Phát âm thanh thử"}</span>
                                </Button>
                            </div>
                            <p className="text-2xs text-gray-500">Nhấn nút phát âm thanh thử để đảm bảo bạn nghe rõ giọng đọc của AI Interviewer</p>
                        </div>

                        {/* Network Status */}
                        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900">
                            <div className="flex items-center gap-2">
                                <Wifi className="h-4 w-4 text-emerald-600" />
                                <span className="font-semibold">Đường truyền kết nối Audio Stream: Tốt (Latency &lt; 40ms)</span>
                            </div>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </div>

                        {/* Start Action */}
                        <div className="pt-2">
                            <Button size="lg" className="w-full gap-2" onClick={handleStartSession}>
                                <span>Thiết bị đã sẵn sàng — Vào phòng phỏng vấn</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
