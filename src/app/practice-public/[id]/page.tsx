import type { Metadata } from "next";
import { PracticeExamPublicView } from "@/views/practice/practice-exam-public-view";

export const metadata: Metadata = {
    title: "Làm bài thi thử luyện tập",
    description: "Môi trường thi thử trực tuyến tự do trên RikkeiEdu",
};

export default async function PracticePublicPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PracticeExamPublicView practiceId={id} />;
}
