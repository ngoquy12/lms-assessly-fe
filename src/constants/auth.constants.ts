/** Tên cookie lưu phiên đăng nhập (mock; khi có API thật nên chuyển httpOnly server-set). */
export const SESSION_COOKIE_NAME = "assessly_session";

/** Thời hạn cookie phiên (ngày). */
export const SESSION_MAX_AGE_DAYS = 7;

/** Thông tin đăng nhập demo cho môi trường mock (chưa có API). */
export const DEMO_CREDENTIALS = {
    email: "hocvien@rikkei.edu.vn",
    password: "Rikkei@123",
};

/** Token phiên giả lập trả về khi đăng nhập mock thành công (chưa có API). */
export const MOCK_SESSION_TOKEN = "mock-session-token";

/** Trang mặc định sau khi đăng nhập nếu không có ?redirect. */
export const DEFAULT_AUTH_REDIRECT = "/page-exam";

/**
 * Các tiền tố đường dẫn YÊU CẦU đăng nhập. Route không khớp = công khai.
 * Proxy (src/proxy.ts) chặn theo danh sách này.
 */
export const PROTECTED_PATH_PREFIXES = [
    "/page-exam",
    "/profile",
    "/exam-result",
    "/exam/",
    "/verify-ticket",
    "/ai-interview/",
    "/interview/result/",
    "/toeic/",
    "/competency-assessment/",
];
