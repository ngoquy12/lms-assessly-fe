import { MOCK_LATENCY_MS } from "@/constants/app.constants";

/**
 * Độ trễ giả lập cho tầng service khi chưa có API thật.
 * Đây là chỗ DUY NHẤT tạo độ trễ giả — khi nối API thật, service không dùng helper này nữa.
 */
export function simulateLatency<T>(data: T): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), MOCK_LATENCY_MS);
    });
}
