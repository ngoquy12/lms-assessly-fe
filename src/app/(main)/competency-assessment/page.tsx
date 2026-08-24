import type { Metadata } from "next";
import { CompetencyListView } from "@/views/competency/competency-list-view";

export const metadata: Metadata = {
    title: "Đánh giá năng lực & EQ/IQ",
    description: "Bộ bài test đánh giá tư duy logic, EQ, IQ và kỹ năng mềm",
};

export default function CompetencyPage() {
    return <CompetencyListView />;
}
