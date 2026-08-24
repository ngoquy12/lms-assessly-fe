import type { Metadata } from "next";
import { ExamLobbyView } from "@/views/exam/exam-lobby-view";

export const metadata: Metadata = {
    title: "Sảnh ca thi chính thức",
    description: "Danh sách ca thi và phòng thi trực tuyến của thí sinh",
};

export default function ExamLobbyPage() {
    return <ExamLobbyView />;
}
