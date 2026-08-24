# Thiết kế: Testing Infrastructure (Sub-project #4)

- **Ngày**: 2026-08-25
- **Trạng thái**: Approved (autonomous — user "tiếp tục #4") — chờ plan
- **Roadmap**: #4/6 (làm sau cùng theo yêu cầu). #1,#2,#3,#5,#6 ✅.

## Bối cảnh

Dự án hiện **KHÔNG có framework test nào** (không Jest/Vitest/Playwright, không file `*.test.*`). Có nhiều logic thuần dễ vỡ mà không được bảo vệ: services (auth validate, by-id trả `null`), utils (session cookie), component dùng chung (QueryStateBoundary). eslint governance rất chặt nhưng **chưa có override cho file test** (test cần hardcode string mô tả, inline type mock...).

## Mục tiêu

1. Dựng **framework test** chạy được, cấu hình đúng cho stack Next 16 + React 19 + TS + path alias `@/*`.
2. Viết **suite ban đầu có giá trị cao** chứng minh hạ tầng hoạt động: cover logic thuần quan trọng nhất (auth validate, by-id null-safety, session cookie) + 1 component test (RTL).
3. **eslint override** cho file test (không bị governance rule UI chặn).
4. Tích hợp **CI**: thêm bước chạy test vào `ci.yml`.

## Ngoài phạm vi

- Độ phủ toàn diện (coverage 100%) — đây là hạ tầng + suite mẫu, không phải test hết mọi thứ.
- E2E (Playwright/Cypress) — có thể là sub-project sau; lần này chỉ unit/component (Vitest + RTL).
- Refactor code sản phẩm để dễ test hơn (giữ tối thiểu; chỉ mock ở ranh giới).

## Quyết định thiết kế (rulings)

1. **Vitest** (không Jest): ESM/TS-native, nhanh, cấu hình tối thiểu với Next, hỗ trợ React 19. Jest cần nhiều config babel/transform hơn cho stack này.
2. **React Testing Library** (+ `@testing-library/jest-dom`, `@testing-library/user-event`) trên **jsdom** cho component test; **`@vitejs/plugin-react`** cho JSX; **`vite-tsconfig-paths`** để Vitest hiểu alias `@/*`.
3. **Mock ở ranh giới**: mock `@/services/mock-delay` (bỏ delay 400ms → test nhanh) và `js-cookie`/session utils khi test service. Không đổi code sản phẩm.
4. **Mô tả test bằng tiếng Anh** (tránh dính rule text tiếng Việt + quy ước phổ biến), NHƯNG vẫn thêm eslint override cho test file để không phụ thuộc rule UI.
5. **Vị trí test**: co-located `*.test.ts(x)` cạnh file nguồn (vd `src/services/auth.service.test.ts`). Setup file ở `src/test/setup.ts` (hoặc `vitest.setup.ts` gốc).
6. **CI**: thêm step `pnpm run test` (`vitest run`) vào `ci.yml` (sau type-check, trước/song song lint — đặt sau type-check).

## Thành phần

### 1. Dependencies (devDependencies)
`vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `vite-tsconfig-paths`. (Implementer pin phiên bản tương thích React 19 — `@testing-library/react` ≥16.)

### 2. Config
- **`vitest.config.ts`** (gốc): plugins `[react(), tsconfigPaths()]`; `test: { environment: "jsdom", globals: true, setupFiles: ["./src/test/setup.ts"], include: ["src/**/*.{test,spec}.{ts,tsx}"] }`.
- **`src/test/setup.ts`**: `import "@testing-library/jest-dom/vitest";` (đăng ký matcher).
- **tsconfig**: đảm bảo type cho vitest globals (`"types": ["vitest/globals", ...]` trong tsconfig hoặc file tsconfig riêng cho test). Nếu thêm `types` phá type-check hiện có thì dùng import tường minh trong test thay vì globals — ưu tiên không phá `type-check` production.

### 3. package.json scripts
- `"test": "vitest run"`, `"test:watch": "vitest"`. (Optional `"test:coverage": "vitest run --coverage"` — chỉ nếu cài `@vitest/coverage-v8`; không bắt buộc.)

### 4. ESLint override (`eslint.config.mjs`)
Thêm 1 block cuối cho `**/*.{test,spec}.{ts,tsx}` và `src/test/**`: tắt `no-restricted-syntax` (tests hardcode string/inline type hợp lệ), tắt `@typescript-eslint/no-explicit-any` nếu cần cho mock. Đảm bảo không phá `lint:check` cho test files.

### 5. Suite ban đầu
- **`src/utils/session.test.ts`** — `setSessionToken`/`getSessionToken`/`clearSessionToken` (mock `js-cookie`, assert gọi đúng tham số + tên cookie).
- **`src/services/auth.service.test.ts`** — `login` (đúng demo creds → trả session + gọi setSessionToken; sai → throw); `getCurrentUser` (có cookie → MOCK_USER_PROFILE; không → `null`). Mock `@/utils/session` + `@/services/mock-delay`.
- **`src/services/practice.service.test.ts`** — `getPracticeById("practice-01")` trả đúng item; `getPracticeById("khong-ton-tai")` trả **`null`** (bảo vệ đúng fix react-query-safety của #2); `getPracticeList()` trả nguyên list. Mock mock-delay.
- **`src/components/shared/query-state.test.tsx`** — RTL: `isLoading` → hiện `UI_TEXT.common.loading`; `isError` → hiện `UI_TEXT.common.genericError` + nút retry gọi `onRetry`; ngược lại → render children.

## Xác minh

- `pnpm run test` → tất cả test PASS.
- `pnpm run type-check`, `lint:check`, `build` vẫn sạch (không bị test config/deps phá).
- CI: `ci.yml` có step test; xác nhận cú pháp YAML đúng.
- Chứng minh test THẬT (không mock rỗng): cố tình làm 1 assertion sai → test đỏ (rồi sửa lại) để chắc suite bắt lỗi.

## Rủi ro

- **Tương thích React 19 / Next 16**: pin `@testing-library/react` ≥16, `vitest` bản mới. Nếu `@vitejs/plugin-react` xung đột, dùng `@vitejs/plugin-react-swc`.
- **Alias `@/*`**: nếu `vite-tsconfig-paths` không resolve, cấu hình `resolve.alias` thủ công trong vitest.config.
- **type-check nuốt test files**: tsconfig `include: ["**/*.ts(x)"]` nên `tsc --noEmit` sẽ check test → cần vitest types khả dụng lúc type-check (types trong tsconfig hoặc import tường minh). Tránh phá type-check production.
- **eslint suppressions**: test files là file MỚI, phải sạch dưới override; không đụng `eslint-suppressions.json`.
- **Mock delay**: `simulateLatency` dùng `setTimeout` — mock module `@/services/mock-delay` để resolve ngay, tránh test chờ 400ms (hoặc `vi.useFakeTimers`).
