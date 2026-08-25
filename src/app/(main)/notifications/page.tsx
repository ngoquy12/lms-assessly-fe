import type { Metadata } from "next";
import { NotificationListView } from "@/views/notifications/notification-list-view";

export const metadata: Metadata = {
    title: "Trung tâm Thông báo",
    description: "Xem toàn bộ thông báo về ca thi, kết quả phỏng vấn AI, bài đánh giá và hoạt động đào tạo tại RikkeiEdu.",
};

export default function NotificationsPage() {
    return <NotificationListView />;
}
