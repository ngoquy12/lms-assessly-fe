import type { Metadata } from "next";
import { CheckDeviceView } from "@/views/interview/check-device-view";

export const metadata: Metadata = {
    title: "Kiểm tra thiết bị âm thanh phỏng vấn",
    description: "Kiểm tra Microphone, Loa và đường truyền trước khi vào phỏng vấn AI",
};

export default async function CheckDevicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CheckDeviceView positionId={id} />;
}
