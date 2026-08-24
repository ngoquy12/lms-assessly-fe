import type { Metadata } from "next";
import { CompetencyResultView } from "@/views/competency/competency-result-view";

export const metadata: Metadata = {
    title: "Kết quả đánh giá năng lực & Radar Chart",
    description: "Báo cáo phân tích đa giác năng lực và điểm chỉ số tư duy",
};

export default async function CompetencyResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CompetencyResultView testId={id} />;
}
