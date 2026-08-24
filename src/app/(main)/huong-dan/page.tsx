import type { Metadata } from "next";
import { ExamGuideView } from "@/views/guide/exam-guide-view";

export const metadata: Metadata = {
    title: "Quy chế & Hướng dẫn làm bài thi",
    description: "Hướng dẫn thao tác làm bài và quy định phòng thi chống gian lận trên LMS Assessly",
};

export default function ExamGuidePage() {
    return <ExamGuideView />;
}
