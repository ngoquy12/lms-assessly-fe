import type { Metadata } from "next";
import { RankingView } from "@/views/ranking/ranking-view";

export const metadata: Metadata = {
    title: "Bảng xếp hạng thí sinh",
    description: "Bảng vinh danh top thí sinh có điểm số cao nhất trong các kỳ khảo thí",
};

export default function RankingPage() {
    return <RankingView />;
}
