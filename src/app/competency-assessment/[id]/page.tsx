import type { Metadata } from "next";
import { CompetencyExamView } from "@/views/competency/competency-exam-view";

export const metadata: Metadata = {
    title: "Làm bài test đánh giá năng lực tư duy",
    description: "Khảo sát tư duy logic, EQ, IQ và kỹ năng giải quyết vấn đề",
};

export default async function CompetencyExamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CompetencyExamView testId={id} />;
}
