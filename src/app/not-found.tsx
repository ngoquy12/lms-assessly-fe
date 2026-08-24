import type { Metadata } from "next";
import { NotFoundView } from "@/views/error/not-found-view";

export const metadata: Metadata = {
    title: "404 - Không tìm thấy trang",
    description: "Trang bạn yêu cầu không tồn tại trên LMS Assessly",
};

export default function NotFoundPage() {
    return <NotFoundView />;
}
