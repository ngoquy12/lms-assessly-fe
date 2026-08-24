import type { Metadata } from "next";
import { LoginView } from "@/views/auth/login-view";

export const metadata: Metadata = {
    title: "Đăng nhập thí sinh",
    description: "Đăng nhập vào Hệ thống Khảo thí & Đánh giá Năng lực LMS Assessly",
};

export default function LoginPage() {
    return <LoginView />;
}
