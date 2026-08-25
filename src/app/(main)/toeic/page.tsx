import type { Metadata } from "next";
import { ToeicListView } from "@/views/toeic/toeic-list-view";

export const metadata: Metadata = {
    title: "Chứng chỉ ngoại ngữ TOEIC & IELTS",
    description: "Bộ đề thi và phòng thi ngoại ngữ chuẩn quốc tế RikkeiEdu",
};

export default function ToeicPage() {
    return <ToeicListView />;
}
