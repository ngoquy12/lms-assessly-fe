import type { Metadata } from "next";
import { ToeicExamView } from "@/views/toeic/toeic-exam-view";

export const metadata: Metadata = {
    title: "Phòng thi ngoại ngữ TOEIC / IELTS",
    description: "Giao diện phòng thi chia đôi màn hình Split-Screen chuẩn quốc tế",
};

export default async function ToeicExamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ToeicExamView examId={id} />;
}
