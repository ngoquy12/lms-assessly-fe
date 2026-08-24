import type { Metadata } from "next";
import { VerifyTicketView } from "@/views/exam/verify-ticket-view";

export const metadata: Metadata = {
    title: "Xác thực vé ca thi",
    description: "Kiểm tra thông tin thí sinh và ca thi trước khi bắt đầu làm bài",
};

export default function VerifyTicketPage() {
    return <VerifyTicketView />;
}
