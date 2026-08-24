# LMS Assessly — Frontend

Ứng dụng web **LMS / khảo thí trực tuyến** (luyện tập, thi trắc nghiệm, đánh giá năng lực, phỏng vấn) xây trên **Next.js 16 (App Router) + React 19 + TypeScript**.

> **Trạng thái hiện tại:** frontend prototype chạy trên **dữ liệu mock** (chưa nối backend). Toàn bộ dữ liệu đến từ `src/mocks/*` qua một tầng service đóng vai trò "điểm nối" (seam) để sau này thay bằng API thật mà không phải sửa lại UI. Auth cũng là mock nhưng đã có **route protection thật** ở tầng server. Xem [ARCHITECTURE.md](ARCHITECTURE.md).

## Yêu cầu môi trường

- **Node.js ≥ 20.9** (CI và Docker dùng Node 20).
- **pnpm 10.12.1** — dự án ghim qua trường `packageManager`. Bật bằng Corepack (đi kèm Node):
  ```bash
  corepack enable
  ```
  (Không cài pnpm global thủ công — Corepack sẽ tự dùng đúng phiên bản đã ghim.)

## Chạy dự án

```bash
pnpm install
pnpm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

**Đăng nhập demo** (auth mock — chưa có backend): `hocvien@rikkei.edu.vn` / `Rikkei@123` (đã điền sẵn trong form đăng nhập).

## Scripts

| Lệnh | Mô tả |
|---|---|
| `pnpm run dev` | Dev server (Turbopack) |
| `pnpm run build` | Build production (`output: standalone`) |
| `pnpm run start` | Chạy bản build |
| `pnpm run type-check` | `tsc --noEmit` |
| `pnpm run lint` | ESLint có `--fix` |
| `pnpm run lint:check` | ESLint `--max-warnings=0` (cổng CI) |
| `pnpm run format` | Prettier |
| `pnpm run duplication-check` | Phát hiện code trùng lặp (jscpd) |

## Kiến trúc (tóm tắt)

Luồng dữ liệu 4 lớp — chi tiết trong [ARCHITECTURE.md](ARCHITECTURE.md):

```
views/components  →  hooks (TanStack Query)  →  services  →  mocks
                                                    └─(sau)→ API thật
```

- **`src/app`** — App Router (route group `(main)` cho layout công khai; các route "phòng thi" full-screen nằm ngoài).
- **`src/views`** — mỗi `page.tsx` chỉ set metadata rồi render 1 view; view chứa logic UI.
- **`src/components`** — UI thuần (`ui/` là primitives shadcn/Radix; `shared/`, `charts/`, `editor/`, `exam/`, `layout/`, `auth/`).
- **`src/services`** — tầng lấy dữ liệu (hôm nay đọc mock qua `simulateLatency`); **điểm nối duy nhất** để đổi sang API.
- **`src/hooks/queries`** — hook TanStack Query bọc service.
- **`src/proxy.ts`** — bảo vệ route (Next 16: `proxy.ts` thay cho `middleware.ts` đã deprecated).
- **`src/mocks`** — nguồn dữ liệu mock (KHÔNG xoá/sửa khi làm UI).
- **`src/types`** / **`src/constants`** / **`src/config`** / **`src/utils`** — kiểu, hằng số (gồm `UI_TEXT` cho toàn bộ text tiếng Việt), config (query client, query keys), tiện ích.

## Quy ước phát triển

- **Nhánh:** `main` (production) và `develop` (nhánh làm việc mặc định). Làm việc trên nhánh tính năng → PR vào `develop`; release qua PR `develop → main`. CI/CD deploy `develop`→VPS dev, `main`→VPS prod.
- **Commit:** [Conventional Commits](https://www.conventionalcommits.org/) (mô tả tiếng Việt), enforce tự động qua **commitlint** (husky `commit-msg`). Ví dụ: `feat(auth): ...`, `fix(exam): ...`, `perf: ...`, `docs: ...`.
- **Pre-commit (husky):** chạy `type-check` + `lint-staged` (eslint `--fix` + prettier) trên file staged.
- **ESLint governance:** cấu hình rất chặt (`eslint.config.mjs`) — kebab-case tên file; ma trận import theo lớp (`eslint-plugin-boundaries`); cấm text tiếng Việt hardcode (dùng `UI_TEXT`); cấm `type`/`interface` ngoài `src/types`; cấm hằng số/magic string rải rác. Vi phạm CŨ được "grandfather" trong `eslint-suppressions.json` (baseline nợ kỹ thuật); vi phạm MỚI bị `lint:check` chặn. Trả nợ dần: sửa vi phạm rồi `pnpm exec eslint . --prune-suppressions`.
- **Không hardcode giá trị đặc thù môn/khoá học** trong code/prompt (LMS phục vụ nhiều môn).

## Tài liệu

- [ARCHITECTURE.md](ARCHITECTURE.md) — kiến trúc chi tiết + các điểm carry-forward khi nối API thật.
- `docs/superpowers/specs/` & `docs/superpowers/plans/` — spec & plan của các đợt refactor đã thực hiện (git workflow, data layer, auth, performance).
- `docs/ui-implementation/` — **tài liệu roadmap/thiết kế UI dự kiến** (LMS gamified rộng hơn scope hiện tại). Xem note đầu file để phân biệt phần đã làm vs dự kiến.

## Triển khai

Docker (`Dockerfile`, multi-stage, pnpm) + GitHub Actions (`.github/workflows/`): CI chạy type-check + lint + build trên PR; CD build & push image lên GHCR rồi deploy qua SSH tới VPS dev/prod theo nhánh.
