import type { Metadata } from "next";
import { VoiceInterviewView } from "@/views/interview/voice-interview-view";

export const metadata: Metadata = {
    title: "Phòng phỏng vấn giọng nói AI",
    description: "Phỏng vấn trực tiếp bằng giọng nói và nhận diện tương tác AI thời gian thực",
};

export default async function VoiceInterviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <VoiceInterviewView sessionId={id} />;
}
