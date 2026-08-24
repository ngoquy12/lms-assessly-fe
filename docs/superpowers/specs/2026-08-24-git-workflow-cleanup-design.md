# Thiết kế: Vệ sinh Git & Quy trình phát triển (Sub-project #1)

- **Ngày**: 2026-08-24
- **Trạng thái**: Approved — chờ implementation plan
- **Phạm vi rộng hơn**: đây là sub-project #1 trong roadmap "Refactor & tối ưu quy trình phát triển hệ thống" gồm 6 tiểu dự án (git & quy trình, data/network layer, auth + route protection, testing infrastructure, performance, đồng bộ docs). Các sub-project còn lại sẽ có spec riêng, brainstorm sau khi sub-project này hoàn tất.

## Bối cảnh

Repo hiện chỉ có 1 commit (`d923010 "Initial commit from Create Next App"`, nhánh `master`). Toàn bộ code thật (~127 file trong `src/`, `docs/`, `.github/workflows/`, `.husky/`, `Dockerfile`, `components.json`, `.cursor/`, `.agents/`...) đang **untracked**, các file scaffold gốc (`package.json`, `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `package-lock.json`) đang ở trạng thái **modified nhưng chưa stage**. Không có remote nào được cấu hình.

`.github/workflows/cd.yml` đã được viết sẵn cho hạ tầng thật: build/push Docker image lên GHCR, deploy qua SSH tới VPS, dùng GitHub Environments `dev` (trigger nhánh `develop`) và `prod` (trigger nhánh `main`). Nhưng nhánh local hiện tại tên là `master` — không khớp `main`/`develop` mà workflow trigger, nên kể cả khi push lên remote, CD sẽ không bao giờ chạy.

## Mục tiêu

1. Đưa toàn bộ code hiện có vào version control an toàn (không lộ secret).
2. Đặt tên nhánh khớp với CI/CD đã có sẵn, không cần sửa lại `cd.yml`.
3. Thiết lập quy trình PR bắt buộc review — vì tới đây có nhiều người cùng code.
4. Chuẩn hóa commit message để lịch sử git có ý nghĩa, dễ tra cứu.
5. Cải thiện nhẹ CI để fail nhanh hơn khi có lỗi type.

## Ngoài phạm vi

- Quyết định remote GitHub cụ thể (org nào, ai tạo repo) — người dùng chọn để sau, cần quyết định sớm vì mọi bước "áp dụng trên GitHub" (branch protection, PR review thật) đều phụ thuộc vào nó.
- Thêm test vào CI (thuộc sub-project #4 — Testing infrastructure).
- CODEOWNERS, quy trình release chi tiết hơn Conventional Commits.
- Sửa nội dung `cd.yml`/`ci.yml` về mặt logic build — chỉ thêm 1 bước `type-check`, không đổi gì khác.

## Thiết kế

### 1. Mô hình nhánh

Giữ mô hình mà `cd.yml` đã ngầm định (ít thay đổi nhất, tận dụng CI/CD có sẵn):

- Đổi `master` → `main`.
- Tạo `develop` từ `main`, đặt làm nhánh mặc định nhận PR tính năng.
- `develop` auto-deploy VPS dev, `main` auto-deploy VPS prod (đúng như `cd.yml` đã viết).
- Lên prod bằng PR riêng `develop → main` (release PR), không merge thẳng lên `main` từ nhánh tính năng.

### 2. Commit "bắt kịp" hiện trạng

- Gộp toàn bộ working tree hiện tại (~127 file) thành **1 commit duy nhất** (quyết định của người dùng — ưu tiên tốc độ hơn lịch sử chi tiết cho lần dọn này).
- Đã rà soát không có secret: `.env*` không tồn tại trên đĩa, `git ls-files`/grep pattern secret (API key, private key, AKIA...) trên toàn bộ working tree = 0 kết quả, `.cursor/mcp.json` chỉ chứa URL Sentry MCP public, `.agents/` là các skill package công khai từ `vercel-labs/agent-skills` (có `skills-lock.json` với hash để xác minh nguồn).
- Message theo Conventional Commits tiếng Việt, khớp phong cách project `Learning-Material` cùng team (`feat:`, `fix:`, `chore:`...) — ví dụ: `chore: đưa toàn bộ mã nguồn hiện có vào version control`.
- File spec này (`docs/superpowers/specs/2026-08-24-git-workflow-cleanup-design.md`) được commit riêng, trước commit "bắt kịp", theo quy trình brainstorming.

### 3. Branch protection

Áp dụng trên GitHub sau khi có remote (điều kiện tiên quyết — ghi rõ trong plan là bước có thể bị block):

- `main` và `develop`: cấm push thẳng, bắt buộc PR + ≥1 approval + CI (`ci.yml`) pass trước khi merge.
- Bật "Require branches to be up to date before merging".

### 4. PR template

Thêm `.github/PULL_REQUEST_TEMPLATE.md` gồm: mô tả thay đổi, checklist (lint/type-check/build pass, ảnh chụp UI nếu có thay đổi giao diện, docs cập nhật nếu cần).

### 5. Commit message convention

- Áp dụng Conventional Commits tiếng Việt.
- Thêm `commitlint` (`@commitlint/cli` + `@commitlint/config-conventional`) và hook `commit-msg` trong `.husky/` (hiện chỉ có `pre-commit`, chưa có `commit-msg`) để enforce tự động — cần thiết vì tới đây có nhiều người cùng code.

### 6. CI cải tiến nhỏ

- Thêm bước `pnpm run type-check` riêng vào `.github/workflows/ci.yml`, đặt trước bước `build` — hiện tại CI chỉ có `lint` + `build`; `type-check` hiện chỉ chạy local qua husky pre-commit. Tách riêng giúp fail nhanh hơn và log lỗi type rõ ràng hơn thay vì lẫn trong log build của Next.js.

## Xác minh khi hoàn tất

- `pnpm run lint:check`, `pnpm run type-check`, `pnpm run build` chạy sạch trên nhánh `main` mới sau khi đổi tên + commit.
- Thử 1 commit test với message sai format (không theo Conventional Commits) để xác nhận hook `commit-msg` chặn đúng, rồi xoá/sửa lại commit test đó.
- Xác nhận `develop` được set làm default branch trên remote (khi remote đã có).

## Rủi ro & lưu ý

- Đổi tên nhánh local từ `master` sang `main` là thao tác cục bộ, an toàn (chưa có remote để lệch).
- Nếu remote quyết định trễ, các bước phụ thuộc remote (branch protection, PR review thật) sẽ tạm hoãn — nhưng phần local (đổi tên nhánh, commit, PR template, commitlint, CI type-check) vẫn thực hiện được ngay và không cần làm lại khi có remote.
