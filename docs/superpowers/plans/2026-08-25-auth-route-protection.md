# Auth + Route Protection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thay login giả lập bằng luồng mock-auth qua service + TanStack Query mutation, lưu session bằng cookie, và thêm `proxy.ts` (Next 16 middleware) bảo vệ route thật sự.

**Architecture:** `login-modal → useLogin(mutation) → auth.service.login() (mock validate) → set cookie`. `proxy.ts` đọc cookie server-side, redirect route bảo vệ khi chưa đăng nhập. `auth.service` là seam để sau nối API thật. Giữ pattern data-layer của sub-project #2.

**Tech Stack:** Next.js 16 (proxy.ts, KHÔNG phải middleware.ts), React 19, @tanstack/react-query (useMutation/useQuery), js-cookie (đã cài), zod + react-hook-form (đã có trong login-modal).

**Spec:** [docs/superpowers/specs/2026-08-25-auth-route-protection-design.md](../specs/2026-08-25-auth-route-protection-design.md)

## Global Constraints

- **Next 16**: file bảo vệ route là **`src/proxy.ts`** (middleware đã deprecated → proxy). Export `export function proxy(request: NextRequest)` + `export const config = { matcher }`, import từ `next/server`.
- **Không xoá/sửa `src/mocks/*`**. `auth.service` đọc `MOCK_USER_PROFILE` từ `@/mocks/user.mock`.
- **Giữ nguyên JSX/UI** của `login-modal.tsx` (vùng đóng băng) — chỉ đổi logic auth (bỏ setTimeout) + xử lý redirect/error.
- **ESLint giờ đã enforce** (sau fix last-wins): text tiếng Việt MỚI phải qua `UI_TEXT` (`src/constants/ui-text.constants.ts`); type MỚI ở `src/types`; hằng số MỚI ở `src/constants`. Các file auth MỚI phải sạch hoàn toàn (không có suppression). Chạy `pnpm run lint:check` (`--max-warnings=0`) trước commit.
- **Suppressions baseline** (`eslint-suppressions.json`): nếu một task sửa file view/component đang có suppression và làm GIẢM số vi phạm (vd bỏ 1 chuỗi hardcode), `lint:check` sẽ báo lỗi exit 2 "suppressions left that do not occur anymore". Khi đó chạy `pnpm exec eslint . --prune-suppressions` và commit `eslint-suppressions.json` đã cập nhật cùng task. KHÔNG dùng `--fix` kèm prune (tránh auto-fix ngoài ý muốn) trừ khi cần.
- **Message commit**: Conventional Commits, tiếng Việt. Husky `commit-msg` (commitlint) active. Never `--no-verify`.
- **pnpm**: không có global PATH; `export PATH="$HOME/.pnpm-shim:$PATH"` trước mọi `pnpm`/`git commit`.
- Đang ở nhánh `develop`. Base khi bắt đầu: commit `ade2337` (spec đã cập nhật).
- Boundaries import: `services→{mocks,constants,utils,config}`, `hooks→{services,config,constants,utils}`, `utils→{constants,config}`, `app/components→{hooks,services,...}`. `src/proxy.ts` (root src) chỉ import từ `constants` + `next/server`.

---

### Task 1: Auth constants, types, query-key namespace

**Files:**
- Create: `src/constants/auth.constants.ts`
- Create: `src/types/auth.types.ts`
- Modify: `src/config/query-keys.ts` (thêm `auth` namespace)

**Interfaces:**
- Produces: `SESSION_COOKIE_NAME`, `SESSION_MAX_AGE_DAYS`, `DEMO_CREDENTIALS`, `PROTECTED_PATH_PREFIXES`, `DEFAULT_AUTH_REDIRECT` (constants); types `LoginCredentials`, `AuthSession` (types); `queryKeys.auth.currentUser`.

- [ ] **Step 1: `src/constants/auth.constants.ts`**

```ts
/** Tên cookie lưu phiên đăng nhập (mock; khi có API thật nên chuyển httpOnly server-set). */
export const SESSION_COOKIE_NAME = "assessly_session";

/** Thời hạn cookie phiên (ngày). */
export const SESSION_MAX_AGE_DAYS = 7;

/** Thông tin đăng nhập demo cho môi trường mock (chưa có API). */
export const DEMO_CREDENTIALS = {
    email: "hocvien@rikkei.edu.vn",
    password: "Rikkei@123",
};

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
];
```

- [ ] **Step 2: `src/types/auth.types.ts`**

```ts
import type { UserProfile } from "@/types/user.types";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthSession {
    token: string;
    user: UserProfile;
}
```

- [ ] **Step 3: Thêm `auth` vào `src/config/query-keys.ts`**

Trong object `queryKeys`, thêm namespace `auth` (đặt cạnh `user`):

```ts
    auth: {
        currentUser: ["auth", "current-user"] as const,
    },
```

- [ ] **Step 4: Verify + commit**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check
```
Expected: exit 0. Rồi:
```bash
git add src/constants/auth.constants.ts src/types/auth.types.ts src/config/query-keys.ts && git commit -m "feat(auth): thêm hằng số, type và query key cho auth"
```

---

### Task 2: Session cookie utilities

**Files:**
- Create: `src/utils/session.ts`

**Interfaces:**
- Consumes: `js-cookie`, `SESSION_COOKIE_NAME`, `SESSION_MAX_AGE_DAYS`.
- Produces: `getSessionToken()`, `setSessionToken(token)`, `clearSessionToken()` (client-side, dùng bởi auth.service Task 3).

- [ ] **Step 1: `src/utils/session.ts`**

```ts
import Cookies from "js-cookie";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_DAYS } from "@/constants/auth.constants";

export function getSessionToken(): string | undefined {
    return Cookies.get(SESSION_COOKIE_NAME);
}

export function setSessionToken(token: string): void {
    Cookies.set(SESSION_COOKIE_NAME, token, { expires: SESSION_MAX_AGE_DAYS, sameSite: "lax", path: "/" });
}

export function clearSessionToken(): void {
    Cookies.remove(SESSION_COOKIE_NAME, { path: "/" });
}
```

- [ ] **Step 2: Verify + commit**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check
```
Expected: exit 0. (Lưu ý: `js-cookie` có `@types/js-cookie` đã cài.) Rồi:
```bash
git add src/utils/session.ts && git commit -m "feat(auth): thêm tiện ích quản lý cookie phiên đăng nhập"
```

---

### Task 3: Auth service (mock seam)

**Files:**
- Create: `src/services/auth.service.ts`

**Interfaces:**
- Consumes: `simulateLatency`, `MOCK_USER_PROFILE`, session utils, `DEMO_CREDENTIALS`, types.
- Produces: `login(credentials)`, `logout()`, `getCurrentUser()` (dùng bởi hooks Task 4).

- [ ] **Step 1: `src/services/auth.service.ts`**

```ts
import { MOCK_USER_PROFILE } from "@/mocks/user.mock";
import { simulateLatency } from "@/services/mock-delay";
import { DEMO_CREDENTIALS } from "@/constants/auth.constants";
import type { AuthSession, LoginCredentials } from "@/types/auth.types";
import type { UserProfile } from "@/types/user.types";
import { clearSessionToken, getSessionToken, setSessionToken } from "@/utils/session";

const MOCK_SESSION_TOKEN = "mock-session-token";

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
```

- [ ] **Step 2: Verify + commit**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check
```
Expected: exit 0. (Nếu lint báo `MOCK_SESSION_TOKEN` UPPER_CASE trong service — rule cấm const UPPER_CASE trong services: chuyển `MOCK_SESSION_TOKEN` sang `src/constants/auth.constants.ts` và import, giống cách xử lý `MOCK_LATENCY_MS` ở sub-project #2.) Rồi:
```bash
git add src/services/auth.service.ts src/constants/auth.constants.ts && git commit -m "feat(auth): thêm service đăng nhập/đăng xuất mock (seam cho API)"
```

---

### Task 4: Auth hooks

**Files:**
- Create: `src/hooks/queries/use-auth.ts`

**Interfaces:**
- Consumes: auth.service, `queryKeys.auth`, `useQuery`/`useMutation`/`useQueryClient`.
- Produces: `useCurrentUser()`, `useLogin()`, `useLogout()` (dùng bởi login-modal Task 6 + logout Task 6).

- [ ] **Step 1: `src/hooks/queries/use-auth.ts`**

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getCurrentUser, login, logout } from "@/services/auth.service";

export function useCurrentUser() {
    return useQuery({ queryKey: queryKeys.auth.currentUser, queryFn: getCurrentUser });
}

export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
        },
    });
}
```

- [ ] **Step 2: Verify + commit**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check
```
Expected: exit 0. Rồi:
```bash
git add src/hooks/queries/use-auth.ts && git commit -m "feat(auth): thêm hook useCurrentUser, useLogin, useLogout"
```

---

### Task 5: Proxy (route protection)

**Files:**
- Create: `src/proxy.ts`

**Interfaces:**
- Consumes: `SESSION_COOKIE_NAME`, `PROTECTED_PATH_PREFIXES`, `next/server`.
- Produces: redirect route bảo vệ khi chưa đăng nhập.

- [ ] **Step 1: `src/proxy.ts`**

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, PROTECTED_PATH_PREFIXES } from "@/constants/auth.constants";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtected = PROTECTED_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));

    if (isProtected && !request.cookies.get(SESSION_COOKIE_NAME)) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)"],
};
```

- [ ] **Step 2: Verify build + lint + type-check**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check && pnpm run build
```
Expected: exit 0. Build phải nhận diện proxy (không cảnh báo "middleware deprecated" vì ta dùng proxy.ts đúng chuẩn). Nếu build cảnh báo về vị trí file, kiểm tra `src/proxy.ts` đúng cấp với `src/app`.

- [ ] **Step 3: Commit**

```bash
git add src/proxy.ts && git commit -m "feat(auth): thêm proxy bảo vệ route yêu cầu đăng nhập"
```

---

### Task 6: Wire login-modal + logout + redirect

**Files:**
- Modify: `src/components/auth/login-modal.tsx`
- (Có thể) Modify: một layout/header để thêm nút Đăng xuất — xác định khi implement.

**Interfaces:**
- Consumes: `useLogin` (Task 4), `useLogout`, `useSearchParams` (đọc `?redirect`), `DEFAULT_AUTH_REDIRECT`, `UI_TEXT`.
- Produces: login thật (mock) thay setTimeout; logout hoạt động.

**Suppression note:** `login-modal.tsx` đang có vi phạm được suppress (Zod schema inline, type inline). CHỈ đổi logic `onSubmit` + xử lý redirect/error, GIỮ NGUYÊN schema/type/JSX để số vi phạm không đổi. Nếu sau khi sửa `lint:check` báo "suppressions left that do not occur anymore" (exit 2) → chạy `pnpm exec eslint . --prune-suppressions` và `git add eslint-suppressions.json` cùng commit.

- [ ] **Step 1: Đọc toàn bộ `login-modal.tsx`** để biết cấu trúc `onSubmit`, `isLoading`, toast, reset, router.

- [ ] **Step 2: Thay logic auth**

Thay khối `onSubmit` hiện tại:
```tsx
    const onSubmit = async (_data: LoginFormData) => {
        setIsLoading(true);
        // Simulate authentication API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Đăng nhập thành công!");
            closeModal();
            reset();
            router.push("/page-exam");
        }, 700);
    };
```
bằng cách dùng `useLogin`:
```tsx
    const searchParams = useSearchParams();
    const { mutate: loginMutate, isPending: isLoading } = useLogin();

    const onSubmit = (data: LoginFormData) => {
        loginMutate(
            { email: data.email, password: data.password },
            {
                onSuccess: () => {
                    toast.success(UI_TEXT.auth.loginSuccess);
                    closeModal();
                    reset();
                    const redirect = searchParams.get("redirect");
                    router.push(redirect ?? DEFAULT_AUTH_REDIRECT);
                },
                onError: () => {
                    toast.error(UI_TEXT.auth.loginError);
                },
            },
        );
    };
```
- Bỏ `const [isLoading, setIsLoading] = useState(false);` (giờ dùng `isPending`).
- Thêm imports: `useSearchParams` từ `next/navigation`, `useLogin` từ `@/hooks/queries/use-auth`, `UI_TEXT` từ `@/constants/ui-text.constants`, `DEFAULT_AUTH_REDIRECT` từ `@/constants/auth.constants`.
- Thêm khoá UI_TEXT: mở `src/constants/ui-text.constants.ts`, thêm namespace `auth` (nếu chưa có): `auth: { loginSuccess: "Đăng nhập thành công!", loginError: "Email hoặc mật khẩu không đúng." }`.
- Đổi `defaultValues` email/password sang `DEMO_CREDENTIALS` (import) hoặc bỏ default (tránh giá trị "trông giống thật"). Ruling: set về `DEMO_CREDENTIALS.email`/`.password` để demo chạy được ngay và rõ ràng là demo.

- [ ] **Step 3: Thêm nút Đăng xuất**

Tìm nơi hiển thị trạng thái đăng nhập (header trong `src/components/layout/`). Nếu có chỗ user/avatar → thêm nút/menu "Đăng xuất" gọi `useLogout().mutate()` + `router.push("/")` on success + toast `UI_TEXT.auth.logoutSuccess`. Nếu chưa có chỗ hợp lý và việc thêm sẽ redesign đáng kể → ghi lại là chưa làm (DONE_WITH_CONCERNS) và để Task riêng; KHÔNG redesign header. (Thêm khoá `UI_TEXT.auth.logout`, `logoutSuccess` nếu dùng.)

- [ ] **Step 4: Verify**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && grep -n "setTimeout" src/components/auth/login-modal.tsx; echo "grep setTimeout exit (1=đã bỏ): $?"; pnpm run type-check && pnpm run lint:check
```
Expected: grep KHÔNG còn setTimeout; type-check + lint:check exit 0. Nếu lint:check exit 2 (unused suppressions) → `pnpm exec eslint . --prune-suppressions`, rồi lint:check lại phải exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/auth/login-modal.tsx src/constants/ui-text.constants.ts eslint-suppressions.json src/components/layout/ && git commit -m "feat(auth): nối login-modal với luồng đăng nhập thật (mock) và đăng xuất"
```
(Chỉ add `eslint-suppressions.json`/`layout/` nếu thực sự thay đổi.)

---

### Task 7: Xác minh cuối + browser check

**Files:** không sửa — task xác minh.

- [ ] **Step 1: Static gate**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check && pnpm run build && echo "=== mocks untouched? ===" && git diff --stat ade2337 HEAD -- src/mocks/ && echo "(empty=good)" && echo "=== setTimeout giả lập đã bỏ? ===" && grep -rn "setTimeout" src/components/auth/
```
Expected: 3 lệnh exit 0; mocks không đổi; không còn setTimeout giả lập trong auth.

- [ ] **Step 2: Browser check** (dev server localhost:3000; nếu chưa chạy: `pnpm run dev`)

Xác nhận từng kịch bản (ghi kết quả vào report):
- (a) Mở `/profile` khi CHƯA đăng nhập → tự redirect sang `/login?redirect=/profile`.
- (b) Login bằng demo credential (`hocvien@rikkei.edu.vn` / `Rikkei@123`) → toast thành công, cookie `assessly_session` được set (kiểm tra qua devtools/console `document.cookie`), điều hướng về `/profile` (redirect target).
- (c) Login SAI credential → toast lỗi, không vào.
- (d) Sau khi đăng nhập, mở `/profile` trực tiếp → vào được (không redirect).
- (e) Route công khai `/practice` → luôn vào được dù chưa/đã đăng nhập.
- (f) Đăng xuất (nếu Task 6 làm) → cookie bị xoá, mở lại `/profile` → redirect login.
- (g) KHÔNG có vòng lặp redirect ở `/login`.

- [ ] **Step 3: Ghi report** kết quả 7 kịch bản.

## Ghi chú carry-forward

- **Bảo mật**: cookie hiện non-httpOnly (mock). Khi có API thật (kế tiếp): chuyển sang httpOnly server-set cookie qua route handler/API; `auth.service` đổi thân sang gọi API; proxy đọc cùng cookie. Hook/view/proxy-config không đổi.
- Role-based authorization, refresh token, OTP/Google (SRS-06) — sub-project sau.
- Nếu chưa thêm được nút Đăng xuất gọn trong header (Task 6 Step 3), tạo task nhỏ riêng.
