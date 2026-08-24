# Performance Implementation Plan (Sub-project #5)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement task-by-task. Steps use `- [ ]` checkboxes.

**Goal:** Lazy-load 3 lib nặng (Monaco, Tiptap, Chart.js) qua `next/dynamic` để cắt khỏi bundle các trang không dùng, và thêm security headers an toàn.

**Architecture:** Đổi import tĩnh của các consumer thành `next/dynamic(..., { ssr: false, loading })`. Với chart inline trong exam-result-history-view thì tách ra component riêng rồi dynamic-import. Thêm `async headers()` vào next.config.ts.

**Tech Stack:** Next.js 16.3.2 (`next/dynamic`), React 19, @monaco-editor/react, @tiptap/*, chart.js + react-chartjs-2.

**Spec:** [docs/superpowers/specs/2026-08-25-performance-design.md](../specs/2026-08-25-performance-design.md)

## Global Constraints

- **Không đổi UI/hành vi** (vùng đóng băng): chỉ đổi cách tải + thêm loading fallback. Giữ nguyên props truyền vào editor/chart, layout, className.
- **ESLint đã enforce** (fix last-wins): file MỚI phải sạch (không suppression). KHÔNG định nghĩa `interface`/`type` (TSInterfaceDeclaration/TSTypeAliasDeclaration) trong components/views ngoài `src/types` — dùng **inline param type** thay thế (vd `function C({ data }: { data: ChartData<"bar"> })` — type literal inline KHÔNG bị rule cấm). Text tiếng Việt mới qua `UI_TEXT`. Chạy `lint:check` (`--max-warnings=0`); nếu sửa file có suppression làm giảm vi phạm → `pnpm exec eslint . --prune-suppressions` + commit baseline.
- **`ssr: false` chỉ hợp lệ trong Client Component** — cả 4 consumer đã `"use client"` (đã xác nhận). Component chart tách mới cũng phải `"use client"`.
- Message commit Conventional Commits tiếng Việt; husky commit-msg active; never `--no-verify`.
- pnpm: `export PATH="$HOME/.pnpm-shim:$PATH"` trước mọi lệnh.
- Nhánh `develop`. Base: commit spec vừa tạo (chạy `git rev-parse HEAD` để lấy).

---

### Task 1: Lazy-load Monaco, Tiptap, radar chart (3 consumer, cùng pattern)

**Files (Modify):**
- `src/components/exam/questions/coding-question.tsx` — CodeEditor (Monaco)
- `src/components/exam/questions/essay-question.tsx` — EssayEditor (Tiptap)
- `src/views/competency/competency-result-view.tsx` — AssessmentRadarChart

**Pattern cho mỗi file:** xóa `import { X } from "@/components/..."`, thêm `import dynamic from "next/dynamic";`, và khai báo:
```tsx
const X = dynamic(() => import("@/components/.../file").then((m) => m.X), {
    ssr: false,
    loading: () => <div className="flex h-full min-h-[120px] w-full items-center justify-center text-slate-400"><Loader2 className="h-5 w-5 animate-spin" /></div>,
});
```
(Import `Loader2` từ `lucide-react` nếu file chưa có. Fallback tối giản, giữ chỗ để tránh layout shift — chỉnh min-height cho hợp component. Giữ nguyên mọi chỗ dùng `<X ... />`.)

- [ ] **Step 1: `coding-question.tsx`** — thay `import { CodeEditor } from "@/components/editor/code-editor"` (dòng 5) bằng dynamic như trên (`.then((m) => m.CodeEditor)`). Giữ `<CodeEditor .../>` ở chỗ cũ.
- [ ] **Step 2: `essay-question.tsx`** — tương tự với `EssayEditor` (`@/components/editor/essay-editor`).
- [ ] **Step 3: `competency-result-view.tsx`** — tương tự với `AssessmentRadarChart` (`@/components/charts/assessment-radar-chart`), fallback cao ~ kích thước chart (vd `min-h-[300px]`).

- [ ] **Step 4: Verify + commit**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check && pnpm run build
```
Expected: 3 lệnh exit 0. Build output: các trang này giảm first-load JS / có chunk động cho monaco/tiptap/chartjs. Nếu lint:check exit 2 (unused suppressions từ file đã sửa) → `pnpm exec eslint . --prune-suppressions` rồi lint:check lại. Commit:
```bash
git add src/components/exam/questions/coding-question.tsx src/components/exam/questions/essay-question.tsx src/views/competency/competency-result-view.tsx eslint-suppressions.json && git commit -m "perf: lazy-load Monaco, Tiptap và radar chart bằng next/dynamic"
```
(Chỉ add `eslint-suppressions.json` nếu nó thực sự thay đổi.)

---

### Task 2: Tách + lazy-load chart trong exam-result-history-view

**Files:**
- Create: `src/components/charts/result-history-chart.tsx`
- Modify: `src/views/exam-result/exam-result-history-view.tsx`

**Bối cảnh hiện tại:** `exam-result-history-view.tsx` import `chart.js` + `react-chartjs-2` (dòng 4-6), gọi `ChartJS.register(...)` ở module scope (dòng 8), và render `<Chart type="bar" data={chartData} options={chartOptions} />` (dòng ~343) trong `<div className="h-[360px] w-full pt-2">`. `chartData`/`chartOptions` được tính trong component.

- [ ] **Step 1: Tạo `src/components/charts/result-history-chart.tsx`** (`"use client"`), chứa toàn bộ phần chart.js:
```tsx
"use client";

import { BarController, BarElement, CategoryScale, Chart as ChartJS, Legend, LineController, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, BarController, LineController);

export function ResultHistoryChart({ data, options }: { data: ChartData<"bar">; options: ChartOptions<"bar"> }) {
    return <Chart type="bar" data={data} options={options} />;
}
```
(Dùng inline param type `{ data: ChartData<"bar">; options: ChartOptions<"bar"> }` — KHÔNG khai interface/type alias, tránh rule eslint. Nếu type `chartData`/`chartOptions` ở view không khớp `ChartData<"bar">`/`ChartOptions<"bar">` gây type-check lỗi, dùng `ComponentProps<typeof Chart>` để lấy đúng kiểu, hoặc điều chỉnh generic cho khớp cách view đang tạo data.)

- [ ] **Step 2: Sửa `exam-result-history-view.tsx`**:
  - Xóa 2 import chart.js/react-chartjs-2 (dòng 4 và 6) và lệnh `ChartJS.register(...)` (dòng 8).
  - Thêm `import dynamic from "next/dynamic";` và:
    ```tsx
    const ResultHistoryChart = dynamic(() => import("@/components/charts/result-history-chart").then((m) => m.ResultHistoryChart), {
        ssr: false,
        loading: () => <div className="flex h-[360px] w-full items-center justify-center text-slate-400"><Loader2 className="h-5 w-5 animate-spin" /></div>,
    });
    ```
    (Import `Loader2` nếu chưa có.)
  - Thay `<Chart type="bar" data={chartData} options={chartOptions} />` bằng `<ResultHistoryChart data={chartData} options={chartOptions} />`. Giữ nguyên `<div className="h-[360px] w-full pt-2">` bao ngoài và mọi thứ khác.

- [ ] **Step 3: Verify + commit**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check && pnpm run build
```
Expected: exit 0; chart.js không còn trong first-load JS của route exam-result. Prune suppressions nếu cần (view có thể có suppression; nếu số vi phạm giảm do bỏ import → prune + add baseline). Commit:
```bash
git add src/components/charts/result-history-chart.tsx src/views/exam-result/exam-result-history-view.tsx eslint-suppressions.json && git commit -m "perf: tách và lazy-load biểu đồ lịch sử kết quả (chart.js)"
```

---

### Task 3: Security headers trong next.config.ts

**Files (Modify):** `next.config.ts`

- [ ] **Step 1: Thêm `async headers()`** vào object `nextConfig` (cạnh `images`, `poweredByHeader`...). Áp cho mọi route:
```ts
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=()" },
                ],
            },
        ];
    },
```
**Ruling — Permissions-Policy**: KHÔNG chặn camera/microphone (đặt `=(self)`), vì `ai-interview` (check-device, voice-interview) là tính năng dự kiến dùng WebRTC; chỉ chặn `geolocation` (không dùng). KHÔNG thêm CSP lần này (spec: hoãn — dễ vỡ Monaco worker/fonts/ảnh).

- [ ] **Step 2: Verify + commit**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check && pnpm run build
```
Expected: exit 0 (next.config.ts được eslint bỏ qua no-restricted-syntax — block 282). Commit:
```bash
git add next.config.ts && git commit -m "feat(security): thêm security headers an toàn (nosniff, frame-options, referrer, permissions)"
```

---

### Task 4: Xác minh cuối (bundle + browser + headers)

**Files:** không sửa.

- [ ] **Step 1: Static + bundle**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check && pnpm run build 2>&1 | tail -40
```
Xác nhận build sạch. Ghi lại route sizes; kỳ vọng các trang có editor/chart KHÔNG còn nhồi monaco/tiptap/chart.js vào first-load (tách chunk động). Xác nhận `grep -rn "next/dynamic" src` giờ có 4 chỗ.

- [ ] **Step 2: Browser** (dev server localhost:3000): mở trang competency result (có radar), exam coding question (Monaco), exam-result history (bar chart). Xác nhận: fallback spinner hiện thoáng → editor/chart render đúng, UI không đổi, không lỗi console. Ghi kết quả.

- [ ] **Step 3: Headers**: `curl -sI http://localhost:3000/ | grep -iE "x-content-type|x-frame|referrer-policy|permissions-policy"` (hoặc devtools Network) — thấy 4 header mới. Ghi kết quả.

## Ghi chú carry-forward
- CSP đầy đủ: sub-project riêng (cần allowlist Monaco worker `blob:`/`worker-src`, Google Fonts, ảnh cloudinary/S3/firebase/youtube, GA).
- `result-bar-chart.tsx` là dead code (không consumer) — xoá ở cleanup pass; không ảnh hưởng bundle (không được import).
