# Kiến trúc — LMS Assessly FE

Tài liệu này mô tả kiến trúc **thực tế đang có** của frontend (không phải roadmap dự kiến — phần đó ở `docs/ui-implementation/`). Cập nhật sau các đợt refactor #1–#5 (2026-08).

## Nguyên tắc cốt lõi

Frontend hiện là **prototype chạy trên mock data**, nhưng được cấu trúc sẵn để nối backend thật với ít thay đổi nhất. Chìa khoá là **tầng service làm điểm nối (seam)**.

## Luồng dữ liệu 4 lớp

```
views / components
      │  gọi hook
      ▼
hooks (src/hooks/queries/*)      ← TanStack Query (useQuery / useMutation)
      │  gọi service
      ▼
services (src/services/*)        ← ĐIỂM NỐI: hôm nay đọc mock qua simulateLatency,
      │                             sau này đổi thân hàm sang gọi API thật
      ▼
mocks (src/mocks/*)              ← dữ liệu tĩnh, KHÔNG xoá/sửa khi làm UI
```

- **Views không import mock trực tiếp** — chỉ tiêu thụ hook (`{ data, isLoading, isError, refetch }`) và bọc phần phụ thuộc dữ liệu trong `<QueryStateBoundary>` (loading/error/empty dùng chung).
- `eslint-plugin-boundaries` **ép đúng hướng import** này: `views → hooks → services → mocks`.
- `QueryClientProvider` đặt trong `src/app/providers.tsx` (`"use client"`, `useState(() => makeQueryClient())` — chuẩn App Router), wire vào `src/app/layout.tsx`.

### Khi nối API thật (carry-forward)
Chỉ sửa **thân các hàm trong `src/services/*.service.ts`** (từ `simulateLatency(MOCK_...)` → gọi `httpClient` + endpoint). Hooks, views, proxy **không đổi**. Lưu ý: service by-id phải trả `null` (không phải `undefined`) khi không tìm thấy — TanStack Query từ chối `undefined` (đã mã hoá trong kiểu trả `... | null`).

## Auth + Route Protection (mock)

```
login-modal ──useLogin()──► auth.service.login() ──validate──► set cookie assessly_session
src/proxy.ts ──đọc cookie server-side──► cho qua / redirect /login?redirect=...
useCurrentUser() ──► auth.service.getCurrentUser() (cookie → user | null)
useLogout() ──► clear cookie
```

- **`src/proxy.ts`** (Next 16 dùng `proxy.ts`, KHÔNG phải `middleware.ts` — đã deprecated) bảo vệ route theo `PROTECTED_PATH_PREFIXES`. Route "làm bài thi + dữ liệu cá nhân" cần đăng nhập; duyệt catalog thì công khai. Tiền tố có dấu `/` cuối để bảo vệ `/toeic/[id]` nhưng vẫn để `/toeic` (list) công khai.
- Cookie hiện **non-httpOnly, client-set** (js-cookie) vì chưa có server endpoint.
- `?redirect` sau đăng nhập được validate chỉ nhận path nội bộ (chống open-redirect).

### Carry-forward khi có API thật
Đổi thân `auth.service` sang gọi API + **cookie httpOnly server-set**; bỏ đọc cookie client-side trong `getCurrentUser`. Hooks/proxy/views không đổi. Role-based authz, refresh token, OTP/Google (SRS-06) là việc sau.

## Performance

3 thư viện nặng **lazy-load** qua `next/dynamic({ ssr: false })` (chỉ tải khi component render): **Monaco** (câu hỏi code), **Tiptap** (câu hỏi tự luận), **Chart.js** (radar năng lực + biểu đồ lịch sử — biểu đồ inline đã tách ra `src/components/charts/result-history-chart.tsx`).

`next.config.ts` có security headers an toàn (nosniff, X-Frame SAMEORIGIN, Referrer-Policy, Permissions-Policy — cam/mic để `(self)` cho ai-interview WebRTC). **CSP đầy đủ chưa làm** (dễ vỡ Monaco worker/fonts/ảnh — là sub-project riêng).

## Governance code (ESLint)

`eslint.config.mjs` rất chặt: kebab-case tên file, ma trận boundaries theo lớp, cấm text tiếng Việt ngoài `UI_TEXT`, cấm `type`/`interface` ngoài `src/types`, cấm magic string/số. Do codebase có sẵn ~1064 vi phạm cũ (UI đóng băng), dùng **`eslint-suppressions.json`** (ESLint bulk-suppressions) để grandfather nợ — `lint:check` xanh, nhưng **mọi vi phạm MỚI bị chặn**. Trả nợ dần bằng `pnpm exec eslint . --prune-suppressions` sau khi sửa.

## Điểm còn nợ (carry-forward tổng hợp)

- Nối API thật (thay thân service, httpOnly cookie) + xoá `src/mocks/*` khi không cần.
- Testing infrastructure (chưa có framework test) — sub-project #4 đang tạm hoãn.
- CSP đầy đủ.
- Dọn `eslint-suppressions.json` dần; xoá dead code `src/components/charts/result-bar-chart.tsx` (không consumer).
- `next.config.ts`/`cd.yml`: thống nhất tên build-arg API URL (`NEXT_PUBLIC_ASSESSLY_API_URL` vs `NEXT_PUBLIC_LMS_API_URL`) khi wire data thật.
- Thêm `engines` field vào package.json (Node ≥ 20.9).
