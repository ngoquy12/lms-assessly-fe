# Thiết kế: Performance — lazy-load lib nặng + security headers (Sub-project #5)

- **Ngày**: 2026-08-25
- **Trạng thái**: Approved (autonomous — user ủy quyền "tự động theo kế hoạch, không hỏi lại") — chờ plan
- **Roadmap**: #5/6. #1,#2,#3 ✅. (#4 Testing tạm hoãn theo yêu cầu user.)

## Bối cảnh

3 thư viện nặng đang import TĨNH (vào bundle ngay cả khi user không mở trang dùng chúng), không có `next/dynamic` ở đâu trong `src`:
- **Monaco** (`@monaco-editor/react`): `src/components/editor/code-editor.tsx` → dùng bởi `src/components/exam/questions/coding-question.tsx` (câu hỏi lập trình).
- **Tiptap** (`@tiptap/*`): `src/components/editor/essay-editor.tsx` → dùng bởi `src/components/exam/questions/essay-question.tsx` (câu hỏi tự luận).
- **Chart.js** (`chart.js` + `react-chartjs-2`):
  - `src/components/charts/assessment-radar-chart.tsx` → dùng bởi `src/views/competency/competency-result-view.tsx`.
  - `src/views/exam-result/exam-result-history-view.tsx` — import + `ChartJS.register(...)` ở module scope + `<Chart type="bar">` inline (không qua component riêng).
  - `src/components/charts/result-bar-chart.tsx` — **KHÔNG có consumer** (dead code; không được import nên không vào bundle → không ảnh hưởng perf).

`next.config.ts` chỉ có `poweredByHeader: false` — KHÔNG có security headers.

## Mục tiêu

1. Lazy-load 3 lib nặng qua `next/dynamic` (chỉ tải khi component thực sự render), giảm bundle trang không dùng tới chúng.
2. Thêm bộ security headers an toàn vào `next.config.ts`.
3. Không đổi UI/hành vi (vùng đóng băng) — chỉ đổi cách tải + thêm loading fallback.

## Ngoài phạm vi

- **Content-Security-Policy đầy đủ**: hoãn. CSP chặt cần allowlist cẩn thận (Monaco web-workers, Google Fonts, ảnh cloudinary/S3/firebase, GA, blob:) — sai một nguồn là vỡ app; là một sub-project riêng. Chỉ thêm headers không rủi ro lần này.
- Xoá dead code `result-bar-chart.tsx`: ghi nhận, để cleanup pass (không ảnh hưởng perf vì không được bundle).
- Tối ưu khác (memo, image sizing...) — ngoài phạm vi.

## Thiết kế

### 1. Lazy-load qua `next/dynamic` (`ssr: false` + loading fallback)
Cả 4 consumer đều là `"use client"` (đã kiểm) → `dynamic(..., { ssr: false })` hợp lệ. `ssr: false` vì Monaco/Tiptap/Chart.js là client-only (cần DOM). Mỗi chỗ có fallback nhẹ (spinner/skeleton) khi lib đang tải.

- **`coding-question.tsx`**: đổi `import { CodeEditor } from "@/components/editor/code-editor"` → `const CodeEditor = dynamic(() => import("@/components/editor/code-editor").then((m) => m.CodeEditor), { ssr: false, loading: () => <fallback> })`. Giữ nguyên chỗ dùng `<CodeEditor ... />`.
- **`essay-question.tsx`**: tương tự với `EssayEditor`.
- **`competency-result-view.tsx`**: tương tự với `AssessmentRadarChart`.
- **`exam-result-history-view.tsx`**: chart.js đang inline (register module-scope + `<Chart>`). **Tách** phần chart (register + `<Chart type="bar" data options>`) ra component mới `src/components/charts/result-history-chart.tsx` (nhận `data`, `options` qua props — hoặc tự dựng data từ props tối thiểu), rồi `dynamic`-import component đó trong view với `ssr: false` + fallback. View giữ nguyên layout; chỉ phần canvas chart được lazy.

Fallback: dùng loading tối giản nhất quán — có thể tái dùng spinner kiểu `QueryStateBoundary` (Loader2 + text) hoặc một skeleton `<div>` giữ chỗ đúng kích thước để tránh layout shift. Text (nếu có) qua `UI_TEXT.common.loading`.

### 2. Security headers (`next.config.ts` — thêm `async headers()`)
Bộ an toàn, không phá app:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN` (chống clickjacking; app không nhúng iframe cross-origin — nhưng có nhúng youtube/figma qua ảnh, không phải iframe app nên OK)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` — **lưu ý**: có route `ai-interview` (WebRTC?) có thể cần camera/mic; kiểm tra khi implement — nếu ai-interview dùng getUserMedia thì KHÔNG chặn camera/microphone (đặt `camera=(self)` hoặc bỏ khỏi Permissions-Policy). Ưu tiên không phá tính năng.
Áp cho mọi route (`source: "/:path*"`).

## Xác minh

- `pnpm run type-check`, `lint:check`, `build` sạch.
- **Bundle**: sau build, xác nhận Monaco/Tiptap/Chart.js KHÔNG còn trong first-load JS của các trang không dùng (so sánh build output route sizes trước/sau, hoặc kiểm tra chunk tách riêng). Ít nhất xác nhận build tạo chunk động cho các lib này.
- **Browser**: mở trang có editor/chart (exam coding question, competency result, exam-result history) → fallback hiện thoáng rồi editor/chart render đúng; không lỗi console; UI không đổi.
- Headers: `curl -I` hoặc devtools Network → thấy các header mới trên response.

## Rủi ro

- `ssr: false` chỉ hợp lệ trong Client Component — cả 4 consumer đã `"use client"` (đã xác nhận). Nếu tách component chart mới, đảm bảo nó `"use client"`.
- `Permissions-Policy` chặn camera/mic có thể phá `ai-interview` (WebRTC) — kiểm tra trước khi chặn.
- Tách chart trong exam-result-history-view phải giữ nguyên `data`/`options`/layout — không đổi hình.
- Next 16 `next/dynamic`: API giống 14/15 nhưng xác nhận không có breaking (đọc docs nếu build cảnh báo).
