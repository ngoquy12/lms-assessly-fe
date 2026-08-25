import type { Metadata } from "next";
import { ExamTakingView } from "@/views/exam/exam-taking-view";

export const metadata: Metadata = {
    title: "Phòng thi trực tuyến",
    description: "Môi trường thi trực tuyến bảo mật RikkeiEdu",
};

export default async function ExamTakingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ExamTakingView examId={id} />;
}
