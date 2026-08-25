import type { Metadata } from "next";
import { PracticeListView } from "@/views/practice/practice-list-view";

export const metadata: Metadata = {
    title: "Thư viện đề luyện tập",
    description: "Bộ đề thi thử và luyện tập kỹ năng trực tuyến RikkeiEdu",
};

export default function PracticePage() {
    return <PracticeListView />;
}
