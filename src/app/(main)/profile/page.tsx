import type { Metadata } from "next";
import { ProfileView } from "@/views/profile/profile-view";

export const metadata: Metadata = {
    title: "Hồ sơ thí sinh",
    description: "Quản lý thông tin tài khoản và kết quả chứng chỉ khảo thí",
};

export default function ProfilePage() {
    return <ProfileView />;
}
