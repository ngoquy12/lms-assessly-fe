import type { Metadata } from "next";
import { HomeView } from "@/views/home/home-view";

export const metadata: Metadata = {
    title: "Trang chủ khảo thí",
    description: "Hệ thống Khảo thí & Đánh giá Năng lực Thí sinh LMS Assessly",
};

export default function HomePage() {
    return <HomeView />;
}
