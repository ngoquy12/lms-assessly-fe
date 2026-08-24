# Testing Infrastructure Implementation Plan (Sub-project #4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use `- [ ]` checkboxes.

**Goal:** Dựng Vitest + React Testing Library cho stack Next 16/React 19/TS, viết suite ban đầu có giá trị cao (services/utils/component), và tích hợp CI.

**Architecture:** Vitest (jsdom) + `@vitejs/plugin-react` + `vite-tsconfig-paths` (alias `@/*`). Test co-located `*.test.ts(x)`. Mock ở ranh giới (`mock-delay`, `js-cookie`/session). eslint override cho test files.

**Tech Stack:** Vitest, @testing-library/react (≥16, React 19), @testing-library/jest-dom, @testing-library/user-event, jsdom, @vitejs/plugin-react, vite-tsconfig-paths.

**Spec:** [docs/superpowers/specs/2026-08-25-testing-infra-design.md](../specs/2026-08-25-testing-infra-design.md)

## Global Constraints

- **Không đổi code sản phẩm** — chỉ thêm test/config. Mock ở ranh giới.
- Test files là file MỚI → phải sạch dưới eslint override; **KHÔNG đụng `eslint-suppressions.json`**.
- Mô tả test **tiếng Anh** (tránh rule text tiếng Việt ngay cả trước khi override có hiệu lực; và là quy ước).
- Tests dùng **import tường minh từ `vitest`** (`import { describe, it, expect, vi, beforeEach } from "vitest"`) để `tsc` resolve được (tsconfig include cả test files, không có `types` array — không thêm để tránh phá type-check production). `globals: true` vẫn bật để RTL auto-cleanup hoạt động.
- Commit Conventional Commits tiếng Việt; husky commit-msg active; never `--no-verify`.
- pnpm: `export PATH="$HOME/.pnpm-shim:$PATH"` trước mọi lệnh.
- Nhánh `develop`. Base: commit spec vừa tạo (`git rev-parse HEAD`).

---

### Task 1: Cài framework + config + smoke test

**Files:**
- Modify: `package.json` (devDeps qua `pnpm add -D` + scripts)
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `eslint.config.mjs` (thêm override block cuối cho test files)
- Create: `src/test/smoke.test.ts` (tạm, xoá ở Task 2)

**Interfaces:**
- Produces: `pnpm run test` chạy được; alias `@/*` resolve trong test; jest-dom matcher khả dụng.

- [ ] **Step 1: Cài devDependencies**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm add -D vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Expected: cài thành công. (pnpm sẽ chọn phiên bản mới nhất tương thích; `@testing-library/react` ≥16 hỗ trợ React 19. Nếu `@vitejs/plugin-react` báo xung đột peer với React 19, thử `@vitejs/plugin-react-swc` thay thế và điều chỉnh import trong vitest.config.)

- [ ] **Step 2: `vitest.config.ts`** (gốc dự án)
```ts
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/test/setup.ts"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
    },
});
```

- [ ] **Step 3: `src/test/setup.ts`**
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: package.json scripts** — thêm vào `"scripts"`:
```json
        "test": "vitest run",
        "test:watch": "vitest",
```

- [ ] **Step 5: ESLint override** — thêm block CUỐI CÙNG trong mảng config của `eslint.config.mjs` (ngay trước `)` đóng `tseslint.config(...)`), để last-wins tắt governance cho test files:
```js
    {
        files: ["**/*.{test,spec}.{ts,tsx}", "src/test/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-syntax": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-magic-numbers": "off",
        },
    },
```

- [ ] **Step 6: Smoke test `src/test/smoke.test.ts`**
```ts
import { describe, expect, it } from "vitest";

describe("smoke", () => {
    it("runs the test framework", () => {
        expect(1 + 1).toBe(2);
    });
});
```

- [ ] **Step 7: Verify**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run test && pnpm run type-check && pnpm run lint:check && pnpm run build
```
Expected: `pnpm run test` → 1 passed. type-check/lint:check/build exit 0. Nếu `next build` báo lỗi type ở test file (thiếu vitest types), KHÔNG thêm `types` array vào tsconfig (phá production); thay vào đó đảm bảo test dùng import tường minh từ `vitest` (Step 6 đã vậy). Nếu vẫn kẹt, báo BLOCKED với lỗi chính xác.

- [ ] **Step 8: Commit**
```bash
git add package.json pnpm-lock.yaml vitest.config.ts src/test/ eslint.config.mjs && git commit -m "test: dựng hạ tầng Vitest + React Testing Library"
```

---

### Task 2: Suite test ban đầu (services, utils, component)

**Files:**
- Create: `src/utils/session.test.ts`
- Create: `src/services/auth.service.test.ts`
- Create: `src/services/practice.service.test.ts`
- Create: `src/components/shared/query-state.test.tsx`
- Delete: `src/test/smoke.test.ts`

- [ ] **Step 1: `src/utils/session.test.ts`**
```ts
import Cookies from "js-cookie";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_DAYS } from "@/constants/auth.constants";
import { clearSessionToken, getSessionToken, setSessionToken } from "@/utils/session";

vi.mock("js-cookie", () => ({ default: { get: vi.fn(), set: vi.fn(), remove: vi.fn() } }));

describe("session utils", () => {
    beforeEach(() => vi.clearAllMocks());

    it("setSessionToken writes the cookie with the configured name and options", () => {
        setSessionToken("tok-123");
        expect(Cookies.set).toHaveBeenCalledWith(SESSION_COOKIE_NAME, "tok-123", { expires: SESSION_MAX_AGE_DAYS, sameSite: "lax", path: "/" });
    });

    it("getSessionToken reads the cookie by name", () => {
        (Cookies.get as unknown as ReturnType<typeof vi.fn>).mockReturnValue("abc");
        expect(getSessionToken()).toBe("abc");
        expect(Cookies.get).toHaveBeenCalledWith(SESSION_COOKIE_NAME);
    });

    it("clearSessionToken removes the cookie", () => {
        clearSessionToken();
        expect(Cookies.remove).toHaveBeenCalledWith(SESSION_COOKIE_NAME, { path: "/" });
    });
});
```

- [ ] **Step 2: `src/services/auth.service.test.ts`**
```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_CREDENTIALS } from "@/constants/auth.constants";
import { MOCK_USER_PROFILE } from "@/mocks/user.mock";
import { getCurrentUser, login, logout } from "@/services/auth.service";
import * as session from "@/utils/session";

vi.mock("@/services/mock-delay", () => ({ simulateLatency: (data: unknown) => Promise.resolve(data) }));
vi.mock("@/utils/session", () => ({ getSessionToken: vi.fn(), setSessionToken: vi.fn(), clearSessionToken: vi.fn() }));

describe("auth.service", () => {
    beforeEach(() => vi.clearAllMocks());

    it("login with valid demo credentials returns a session and stores the token", async () => {
        const result = await login({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
        expect(result.user).toBe(MOCK_USER_PROFILE);
        expect(session.setSessionToken).toHaveBeenCalledWith(result.token);
    });

    it("login with wrong credentials throws and does not store a token", async () => {
        await expect(login({ email: "wrong@example.com", password: "nope" })).rejects.toThrow();
        expect(session.setSessionToken).not.toHaveBeenCalled();
    });

    it("getCurrentUser returns the user when a session cookie exists", async () => {
        (session.getSessionToken as unknown as ReturnType<typeof vi.fn>).mockReturnValue("tok");
        await expect(getCurrentUser()).resolves.toBe(MOCK_USER_PROFILE);
    });

    it("getCurrentUser returns null when there is no session cookie", async () => {
        (session.getSessionToken as unknown as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
        await expect(getCurrentUser()).resolves.toBeNull();
    });

    it("logout clears the session token", async () => {
        await logout();
        expect(session.clearSessionToken).toHaveBeenCalled();
    });
});
```

- [ ] **Step 3: `src/services/practice.service.test.ts`**
```ts
import { describe, expect, it, vi } from "vitest";
import { MOCK_PRACTICE_LIST } from "@/mocks/practice.mock";
import { getPracticeById, getPracticeList } from "@/services/practice.service";

vi.mock("@/services/mock-delay", () => ({ simulateLatency: (data: unknown) => Promise.resolve(data) }));

describe("practice.service", () => {
    it("getPracticeList returns the full mock list", async () => {
        await expect(getPracticeList()).resolves.toBe(MOCK_PRACTICE_LIST);
    });

    it("getPracticeById returns the matching item", async () => {
        const first = MOCK_PRACTICE_LIST[0];
        await expect(getPracticeById(first.id)).resolves.toBe(first);
    });

    it("getPracticeById returns null (not undefined) for a missing id", async () => {
        await expect(getPracticeById("khong-ton-tai")).resolves.toBeNull();
    });
});
```
(Test cuối chốt bất biến quan trọng của #2: by-id trả `null` để react-query không lỗi.)

- [ ] **Step 4: `src/components/shared/query-state.test.tsx`**
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { UI_TEXT } from "@/constants/ui-text.constants";

describe("QueryStateBoundary", () => {
    it("shows the loading state when isLoading is true", () => {
        render(
            <QueryStateBoundary isLoading isError={false}>
                <span>content</span>
            </QueryStateBoundary>,
        );
        expect(screen.getByText(UI_TEXT.common.loading)).toBeInTheDocument();
        expect(screen.queryByText("content")).not.toBeInTheDocument();
    });

    it("shows the error state and calls onRetry when the retry button is clicked", async () => {
        const onRetry = vi.fn();
        render(
            <QueryStateBoundary isLoading={false} isError onRetry={onRetry}>
                <span>content</span>
            </QueryStateBoundary>,
        );
        expect(screen.getByText(UI_TEXT.common.genericError)).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: UI_TEXT.common.retry }));
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("renders children when not loading and not error", () => {
        render(
            <QueryStateBoundary isLoading={false} isError={false}>
                <span>content</span>
            </QueryStateBoundary>,
        );
        expect(screen.getByText("content")).toBeInTheDocument();
    });
});
```

- [ ] **Step 5: Xoá smoke test**
```bash
rm src/test/smoke.test.ts
```

- [ ] **Step 6: Verify**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run test && pnpm run type-check && pnpm run lint:check
```
Expected: `pnpm run test` → tất cả PASS (4 file test, nhiều case). type-check + lint:check exit 0. Nếu 1 test đỏ do assertion/mismatch thật (vd shape MOCK khác), sửa test cho khớp code THẬT (không đổi code sản phẩm). Nếu `getByRole("button", { name: UI_TEXT.common.retry })` không tìm thấy (retry chỉ hiện khi có `onRetry`), đảm bảo truyền `onRetry` — đã truyền.

- [ ] **Step 7: Commit**
```bash
git add src/utils/session.test.ts src/services/auth.service.test.ts src/services/practice.service.test.ts src/components/shared/query-state.test.tsx && git rm src/test/smoke.test.ts && git commit -m "test: thêm test cho auth/practice service, session utils và QueryStateBoundary"
```

---

### Task 3: Tích hợp CI

**Files (Modify):** `.github/workflows/ci.yml`

- [ ] **Step 1:** Thêm step `Test` vào job `build`, đặt SAU `Type check` và trước/sau `Lint` (đặt sau Type check):
```yaml
            - name: Type check
              run: pnpm run type-check

            - name: Test
              run: pnpm run test

            - name: Lint
              run: pnpm run lint:check
```
(Nếu bước Lint hiện là `pnpm run lint` thì giữ nguyên tên hiện có; chỉ CHÈN step `Test` sau `Type check`. Đọc file trước khi sửa để chèn đúng chỗ, giữ indentation 4-space.)

- [ ] **Step 2: Verify + commit**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && cat .github/workflows/ci.yml && pnpm run test
```
Xác nhận YAML đúng (step Test nằm trong job, đúng indentation), test vẫn pass local. Commit:
```bash
git add .github/workflows/ci.yml && git commit -m "ci: chạy test trong pipeline CI"
```

---

### Task 4: Xác minh cuối + red-test proof

**Files:** không sửa (trừ sửa-rồi-hoàn-tác tạm thời ở red-test).

- [ ] **Step 1: Full gate**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run test && pnpm run type-check && pnpm run lint:check && pnpm run build && echo "=== suppressions untouched? ===" && git diff --stat HEAD -- eslint-suppressions.json && echo "(empty=good)"
```
Expected: test PASS, 3 gate exit 0, `eslint-suppressions.json` không đổi.

- [ ] **Step 2: Red-test proof** (chứng minh suite BẮT lỗi thật, không phải test rỗng): tạm sửa 1 assertion cho SAI (vd trong `practice.service.test.ts` đổi `toBeNull()` thành `toBe("x")`), chạy `pnpm run test` → phải THẤY test đó FAIL. Rồi HOÀN TÁC (`git checkout src/services/practice.service.test.ts`), chạy lại → PASS. Ghi kết quả vào report.

- [ ] **Step 3: Ghi report** — số test/case pass, kết quả red-test, gate status.

## Ghi chú carry-forward
- Mở rộng coverage dần (exam scoring/timer logic, các service/hook còn lại, view chính).
- E2E (Playwright) cho luồng auth/exam — sub-project sau nếu cần.
- `test:coverage` (`@vitest/coverage-v8`) khi muốn đo độ phủ.
