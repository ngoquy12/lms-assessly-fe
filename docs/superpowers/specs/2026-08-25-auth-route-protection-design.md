# Thiết kế: Auth + Route Protection (Sub-project #3)

- **Ngày**: 2026-08-25
- **Trạng thái**: Approved (autonomous — người dùng ủy quyền "tự động theo kế hoạch, không hỏi lại") — chờ implementation plan
- **Roadmap**: sub-project #3/6. #1 (git workflow) ✅, #2 (data layer) ✅.

## Bối cảnh

Auth hiện là giả lập hoàn toàn: `src/components/auth/login-modal.tsx` dùng `setTimeout(700ms)` luôn thành công rồi `router.push("/page-exam")`. Không có `middleware.ts` → không route nào được bảo vệ. `js-cookie` đã cài nhưng chưa dùng ở đâu. `src/store/use-auth-modal.ts` chỉ quản trạng thái mở/đóng modal, không có auth state. Chưa có backend/API auth thật.

Sub-project #2 vừa dựng luồng `views → hooks (TanStack Query) → services → mocks` với **services là seam** để sau đổi sang API. Sub-project #3 tận dụng đúng pattern đó cho auth.

## Mục tiêu

1. Thay login giả lập bằng **luồng auth qua service + mutation** (mock, chưa có API), giữ seam để sau nối API thật.
2. Lưu **session bằng cookie** (js-cookie) để `middleware.ts` đọc được ở server-side.
3. Thêm `middleware.ts` **bảo vệ route thật sự**: truy cập route cần đăng nhập khi chưa có session → redirect về `/login?redirect=<path>`.
4. Có `useAuth`/`useLogin`/`useLogout`, logout hoạt động, redirect sau login về đúng trang trước đó.
5. Không phá vỡ UI hiện có (vùng đóng băng thiết kế).

## Ngoài phạm vi

- Backend/API auth thật, OTP, Google OAuth (docs SRS-06 nhắc tới — để sau). Service hôm nay validate mock.
- httpOnly cookie set từ server (cần endpoint thật) — hôm nay dùng cookie client-set; **carry-forward: khi có API, chuyển sang httpOnly server-set cookie**.
- Refresh token, phân quyền (role-based) chi tiết — chỉ làm authenticated/không.
- Test tự động (→ sub-project #4).

## Kiến trúc

```
login-modal ──useLogin(mutation)──► auth.service.login() ──(mock, validate)──► set cookie assessly_session
middleware.ts ──đọc cookie──► cho qua / redirect /login?redirect=...
protected view ──useCurrentUser()──► auth.service.getCurrentUser() (đọc cookie → MOCK_USER_PROFILE | null)
logout ──useLogout──► auth.service.logout() (clear cookie) ──► về trang công khai
```

Cookie là nguồn sự thật cho "đã đăng nhập". Service là seam: khi có API, đổi thân `login/getCurrentUser/logout` sang gọi API + httpOnly cookie, middleware/hook/view không đổi.

## Thành phần

### 1. Hằng số + cấu hình route bảo vệ
- **`src/constants/auth.constants.ts`** (mới): `SESSION_COOKIE_NAME = "assessly_session"`, `SESSION_MAX_AGE_DAYS`, demo credential (nếu cần), và **`PROTECTED_PATH_PREFIXES`** — danh sách prefix route cần đăng nhập. (Đặt ở constants theo rule dự án, không magic string trong middleware.)
- Ruling — **route bảo vệ** (làm bài thi + dữ liệu cá nhân) vs công khai (duyệt catalog):
  - **Bảo vệ**: `/page-exam`, `/profile`, `/exam-result`, `/exam/`, `/competency-assessment/[id]` (làm bài), `/toeic/[id]` (làm bài), `/interview/result/`, `/ai-interview/`, `/verify-ticket`, `/practice-public/*/result`, `/*/result`.
  - **Công khai**: `/` , `/practice`, `/practice/[id]`, `/topics`, `/topics/[id]`, `/ranking`, `/huong-dan`, `/competency-assessment` (list), `/toeic` (list), `/interview` (list), `/practice-public/[id]` (tự tên là public), `/login`.
  - Cơ chế: middleware bảo vệ theo `PROTECTED_PATH_PREFIXES`; dễ chỉnh 1 chỗ.

### 2. Session cookie utils
- **`src/lib/session.ts`** (hoặc `src/utils/session.ts` theo boundaries — utils được phép): `getSessionToken()`, `setSessionToken(token)`, `clearSessionToken()` bọc js-cookie + tên cookie từ constants. (Client-side. Middleware đọc cookie qua `request.cookies` của Next, không dùng js-cookie.)

### 3. Auth service (seam)
- **`src/services/auth.service.ts`**: `login(credentials): Promise<AuthSession>` — mock: validate credentials (khớp demo user → trả `{ token, user }`; sai → throw để mutation vào onError); `logout(): Promise<void>` — clear; `getCurrentUser(): Promise<UserProfile | null>` — đọc cookie, có → trả `MOCK_USER_PROFILE`, không → `null`. Dùng `simulateLatency`. Type `AuthSession`, `LoginCredentials` khai trong `src/types/auth.types.ts` (rule: type ở src/types).

### 4. Auth hooks
- **`src/hooks/queries/use-auth.ts`**: `useCurrentUser()` (useQuery, key `queryKeys.auth.currentUser`), `useLogin()` (useMutation → onSuccess set cookie + invalidate currentUser + redirect), `useLogout()` (useMutation → clear cookie + invalidate + về trang công khai). Thêm `auth` namespace vào `query-keys.ts`.

### 5. Proxy (Next 16 middleware)
- **Next 16 đã đổi `middleware.ts` → `proxy.ts`** (middleware deprecated). File đặt tại **`src/proxy.ts`** (cùng cấp `src/app`), export `export function proxy(request: NextRequest)` từ `next/server`, kèm `export const config = { matcher: [...] }`.
- Logic: đọc `request.cookies.get(SESSION_COOKIE_NAME)`. Nếu `pathname` khớp `PROTECTED_PATH_PREFIXES` và không có cookie → `NextResponse.redirect(new URL("/login?redirect=<pathname>", request.url))`. `matcher` loại trừ `_next`, static assets, favicon. (KHÔNG import js-cookie — chạy server/edge; dùng `request.cookies`.)
- Docs Next: proxy dùng cho "optimistic check" (redirect theo cookie) — đúng use-case; không dùng làm session management đầy đủ.

### 6. Wire login-modal + logout + redirect
- Thay `setTimeout` trong `login-modal.tsx` bằng `useLogin().mutate(data, { onSuccess: → đọc `?redirect` hoặc mặc định `/page-exam`, toast, closeModal })`, xử lý `onError` (toast lỗi). Giữ nguyên toàn bộ JSX form.
- Thêm nút **Đăng xuất** ở nơi hợp lý (header/profile) gọi `useLogout` — nếu header hiện chưa có chỗ, thêm tối giản, không redesign. (Xác định lúc implement.)
- Đổi default credentials trong form từ giá trị "trông giống thật" (`baohoang01@gmail.com`) sang giá trị demo rõ ràng (theo finding sub-project #1) hoặc bỏ default.

## Quyết định thiết kế (rulings)

1. **Cookie client-set (không httpOnly)** cho mock — httpOnly cần server endpoint chưa có. Carry-forward: chuyển httpOnly khi có API. Rủi ro chấp nhận được vì đây là prototype, chưa có dữ liệu thật.
2. **Nguồn sự thật = cookie**; `getCurrentUser` suy ra user từ cookie + MOCK_USER_PROFILE.
3. **Validate mock**: chấp nhận 1 bộ demo credential (đặt trong constants), sai → lỗi. Không phải "luôn thành công" như hiện tại.
4. **Route protection qua middleware** (server-side, không bypass được) thay vì guard client-side.
5. **Redirect sau login** về `?redirect` nếu có, không thì `/page-exam` (giữ hành vi hiện tại làm mặc định).
6. Text tiếng Việt mới → `UI_TEXT` (rule eslint giờ đã enforce sau fix #eslint); type mới → `src/types`; hằng số → `src/constants`.

## Xác minh (chưa có test framework)

- `type-check`, `lint:check`, `build` sạch.
- Browser (dev server): (a) truy cập `/profile` khi chưa login → redirect `/login?redirect=/profile`; (b) login bằng demo credential → set cookie, về `/profile` (redirect target); (c) sai credential → toast lỗi, không vào; (d) logout → clear cookie, truy cập lại `/profile` → redirect login; (e) route công khai (`/practice`) luôn vào được.
- `grep` xác nhận không còn `setTimeout` giả lập trong login-modal.

## Rủi ro

- **Bảo mật (mock)**: cookie non-httpOnly đọc được bằng JS — chấp nhận cho prototype, phải đổi khi có API. Ghi rõ carry-forward.
- **Middleware matcher**: sai matcher có thể chặn nhầm static/asset — test kỹ, loại trừ `_next`, ảnh, favicon.
- **Next 16 middleware**: kiểm tra vị trí file (`src/middleware.ts` vs root) và API `NextRequest`/`NextResponse` đúng phiên bản (đọc `node_modules/next/dist/docs` nếu cần, theo AGENTS.md).
- **SSR/redirect loop**: đảm bảo `/login` KHÔNG nằm trong protected prefixes (tránh vòng lặp redirect).
