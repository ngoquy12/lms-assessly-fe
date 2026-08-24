import { DEMO_CREDENTIALS, MOCK_SESSION_TOKEN } from "@/constants/auth.constants";
import { MOCK_USER_PROFILE } from "@/mocks/user.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { AuthSession, LoginCredentials } from "@/types/auth.types";
import type { UserProfile } from "@/types/user.types";
import { clearSessionToken, getSessionToken, setSessionToken } from "@/utils/session";

/**
 * Đăng nhập (mock, chưa có API). Kiểm tra khớp thông tin demo, đặt cookie phiên.
 * Khi có API thật: thay thân hàm bằng gọi endpoint; giữ nguyên chữ ký trả AuthSession.
 */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
    const session = await simulateLatency<AuthSession | null>(
        credentials.email === DEMO_CREDENTIALS.email && credentials.password === DEMO_CREDENTIALS.password
            ? { token: MOCK_SESSION_TOKEN, user: MOCK_USER_PROFILE }
            : null,
    );
    if (!session) {
        throw new Error("INVALID_CREDENTIALS");
    }
    setSessionToken(session.token);
    return session;
}

export async function logout(): Promise<void> {
    await simulateLatency(null);
    clearSessionToken();
}

/** Trả người dùng hiện tại nếu có cookie phiên, ngược lại null (react-query chấp nhận null). */
export function getCurrentUser(): Promise<UserProfile | null> {
    return simulateLatency(getSessionToken() ? MOCK_USER_PROFILE : null);
}
