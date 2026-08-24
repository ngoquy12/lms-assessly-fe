# Vệ Sinh Git & Quy Trình Phát Triển Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đưa toàn bộ code hiện có của `lms-assessly-fe` vào version control với lịch sử sạch, đặt tên nhánh khớp CI/CD sẵn có, và dựng quy trình commit/PR chuẩn cho nhiều người cùng code.

**Architecture:** Thao tác trực tiếp trên git local (không cần remote): đổi tên `master` → `main`, gộp toàn bộ working tree hiện tại thành 1 commit, tạo `develop` từ `main` làm nhánh làm việc mặc định, rồi thêm 3 lớp phòng vệ quy trình (PR template, commitlint + husky hook, CI type-check) trên `develop`.

**Tech Stack:** Git, GitHub Actions (`.github/workflows/ci.yml`), Husky v9, commitlint, pnpm.

**Spec:** [docs/superpowers/specs/2026-08-24-git-workflow-cleanup-design.md](../specs/2026-08-24-git-workflow-cleanup-design.md)

## Global Constraints

- Toàn bộ code hiện tại gộp thành **1 commit duy nhất** (quyết định của người dùng), không tách theo nhóm tính năng.
- Message commit theo **Conventional Commits, mô tả bằng tiếng Việt** (ví dụ `chore: ...`, `ci: ...`).
- Không được commit bất kỳ file `.env*` hay secret nào — rà soát lại bằng grep trước khi `git add -A`.
- Nhánh đích cuối cùng phải là `main` (production) và `develop` (mặc định làm việc) — khớp trigger sẵn có trong `.github/workflows/cd.yml`.
- Không sửa logic build/deploy trong `cd.yml`/`ci.yml`, chỉ thêm 1 step `type-check` vào `ci.yml`.
- Branch protection trên GitHub và quyết định remote **không nằm trong plan này** (spec đánh dấu ngoài phạm vi, người dùng để quyết định sau) — plan này chỉ chuẩn bị phần local để áp dụng ngay khi có remote.
- Môi trường dev hiện tại chưa có `pnpm` global trong PATH, chỉ dùng được qua `corepack pnpm`. Mọi lệnh `pnpm ...` trong plan này (kể cả lệnh chạy ngầm bên trong husky hook khi `git commit`) cần PATH trỏ tới shim tạo ở Task 0: `/c/Users/Admin/.pnpm-shim` (chứa file `pnpm` gọi `exec corepack pnpm "$@"`). Nếu môi trường thực thi plan này có sẵn `pnpm` thật trong PATH, bỏ qua Task 0 và mọi bước `export PATH=...` phía sau.

---

### Task 0: Chuẩn bị shim `pnpm` (chỉ cần nếu `pnpm` chưa có sẵn trong PATH)

**Files:** không có file dự án nào bị thay đổi — tạo 1 file thực thi ngoài repo tại `~/.pnpm-shim/pnpm`.

**Interfaces:**
- Consumes: `corepack` (đi kèm Node.js, đã xác nhận hoạt động: `corepack pnpm --version` → `10.12.1`).
- Produces: lệnh `pnpm` khả dụng trong PATH sau khi `export PATH="/c/Users/Admin/.pnpm-shim:$PATH"` — mọi task từ Task 2 trở đi (chạy `pnpm`, hoặc `git commit` kích hoạt husky gọi `pnpm`) cần export PATH này trước.

- [ ] **Step 1: Kiểm tra `pnpm` đã có sẵn chưa**

Run: `which pnpm`

Nếu có output (đường dẫn tới `pnpm` thật) → bỏ qua toàn bộ Task 0, dùng `pnpm` trực tiếp ở các task sau. Nếu báo `no pnpm in (...)` → tiếp tục Step 2.

- [ ] **Step 2: Xác nhận corepack chạy được pnpm**

Run: `corepack pnpm --version`

Expected: in ra phiên bản (ví dụ `10.12.1`), khớp `packageManager` khai báo trong `package.json`.

- [ ] **Step 3: Tạo shim**

Run:
```bash
mkdir -p "$HOME/.pnpm-shim" && cat > "$HOME/.pnpm-shim/pnpm" <<'EOF'
#!/bin/sh
exec corepack pnpm "$@"
EOF
chmod +x "$HOME/.pnpm-shim/pnpm"
```

- [ ] **Step 4: Xác minh shim hoạt động**

Run:
```bash
export PATH="$HOME/.pnpm-shim:$PATH" && which pnpm && pnpm --version
```

Expected: `which pnpm` trả về `/c/Users/Admin/.pnpm-shim/pnpm`, `pnpm --version` in ra `10.12.1`.

Lưu ý: biến `PATH` chỉ tồn tại trong phiên shell hiện tại — mỗi lệnh `pnpm`/`git commit` ở các task sau, nếu chạy trong shell mới, cần `export PATH="$HOME/.pnpm-shim:$PATH"` lại trước (hoặc gộp vào cùng 1 lệnh bằng `&&` như các step dưới đây).

---

### Task 1: Đổi tên nhánh `master` → `main`

**Files:** không có file nào bị thay đổi (thao tác git thuần).

**Interfaces:**
- Consumes: trạng thái repo hiện tại — 1 nhánh `master`, HEAD tại commit `4e27c7f` (spec đã commit ở bước brainstorming).
- Produces: nhánh `main` làm nhánh hiện tại, sẵn sàng cho Task 2 commit vào đó.

- [ ] **Step 1: Xác nhận trạng thái hiện tại**

Run: `git -C "D:/Rikkei Education/lms-assessly-fe" branch -a && git -C "D:/Rikkei Education/lms-assessly-fe" status --short`

Expected: chỉ có 1 nhánh `* master`; `status --short` liệt kê các file `??` (untracked) và `M`/`D` (modified/deleted) như đã ghi trong spec — không có gì bất ngờ so với lần khảo sát trước.

- [ ] **Step 2: Đổi tên nhánh**

Run: `git -C "D:/Rikkei Education/lms-assessly-fe" branch -m master main`

- [ ] **Step 3: Xác minh**

Run: `git -C "D:/Rikkei Education/lms-assessly-fe" branch -a`

Expected: output chỉ có `* main` (không còn `master`).

---

### Task 2: Commit toàn bộ mã nguồn hiện tại vào `main` (catch-up commit)

**Files:**
- Stage: toàn bộ working tree hiện tại (`git add -A`) — bao gồm `src/`, `docs/`, `.github/`, `.husky/`, `.cursor/`, `.agents/`, `public/`, `scripts/`, `Dockerfile`, `.dockerignore`, `.prettierrc`, `components.json`, `skills-lock.json`, các file scaffold đã sửa (`package.json`, `package-lock.json`, `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `postcss.config.mjs`) và việc xoá `app/favicon.ico`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx` (scaffold gốc ở root, đã được thay thế bởi `src/app/`).

**Interfaces:**
- Consumes: nhánh `main` từ Task 1.
- Produces: `main` chứa toàn bộ code hiện tại trong 1 commit mới, làm baseline cho Task 3.

- [ ] **Step 1: Rà soát lại secret trước khi add**

Run:
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && grep -rniE "AKIA[0-9A-Z]{16}|api[_-]?key\s*[:=]\s*['\"][a-zA-Z0-9]{16,}|secret\s*[:=]\s*['\"][a-zA-Z0-9]{16,}|BEGIN (RSA|PRIVATE) KEY" src .github .cursor .agents Dockerfile scripts 2>/dev/null
```

Expected: không có output (đã xác nhận sạch ở bước brainstorming; chạy lại để chắc chắn không có gì thay đổi từ đó tới giờ).

- [ ] **Step 2: Stage toàn bộ working tree**

Run: `cd "D:/Rikkei Education/lms-assessly-fe" && git add -A`

- [ ] **Step 3: Xác minh danh sách staged**

Run: `git -C "D:/Rikkei Education/lms-assessly-fe" status --short | grep -v '^[AMD]'`

Expected: không có output (nghĩa là mọi thay đổi đều đã ở trạng thái staged `A`/`M`/`D`, không còn gì untracked hoặc unstaged).

- [ ] **Step 4: Commit**

Run:
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && git commit -m "chore: đưa toàn bộ mã nguồn hiện có vào version control"
```

(Husky `pre-commit` sẽ tự chạy `type-check` + `lint-staged` — nếu `pnpm` không có trong PATH, thêm `export PATH="$HOME/.pnpm-shim:$PATH" && ` trước lệnh commit, ví dụ: `export PATH="$HOME/.pnpm-shim:$PATH" && git commit -m "..."`.)

Expected: commit thành công, husky hook pass (type-check không lỗi, lint-staged không tìm thấy vi phạm mới trên các file thay đổi).

- [ ] **Step 5: Xác minh lịch sử**

Run: `git -C "D:/Rikkei Education/lms-assessly-fe" log --oneline -5 && git -C "D:/Rikkei Education/lms-assessly-fe" status --short`

Expected: commit mới nằm trên cùng `git log`; `status --short` không còn output nào (working tree sạch, trừ các file bị `.gitignore` loại như `.next/`, `*.tsbuildinfo`).

---

### Task 3: Tạo nhánh `develop` từ `main`

**Files:** không có file nào bị thay đổi.

**Interfaces:**
- Consumes: `main` đã có đầy đủ code (từ Task 2).
- Produces: nhánh `develop`, là nhánh hiện tại cho Task 4-6.

- [ ] **Step 1: Tạo và chuyển sang `develop`**

Run: `cd "D:/Rikkei Education/lms-assessly-fe" && git checkout -b develop`

- [ ] **Step 2: Xác minh**

Run: `git -C "D:/Rikkei Education/lms-assessly-fe" branch -a`

Expected: `main` và `* develop`, cả hai cùng trỏ vào commit của Task 2.

---

### Task 4: Thêm PR template

**Files:**
- Create: `.github/PULL_REQUEST_TEMPLATE.md`

**Interfaces:**
- Consumes: đang ở nhánh `develop` (Task 3).
- Produces: file template, không ảnh hưởng task khác.

- [ ] **Step 1: Tạo file template**

Nội dung `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Mô tả thay đổi

<!-- Tóm tắt ngắn gọn PR này làm gì và tại sao -->

## Loại thay đổi

- [ ] Tính năng mới (feat)
- [ ] Sửa lỗi (fix)
- [ ] Refactor / dọn code
- [ ] Cập nhật tài liệu (docs)
- [ ] Khác: <!-- ghi rõ -->

## Checklist trước khi merge

- [ ] `pnpm run lint:check` chạy sạch
- [ ] `pnpm run type-check` chạy sạch
- [ ] `pnpm run build` chạy thành công
- [ ] Đã tự kiểm tra trên trình duyệt (nếu có thay đổi UI) — đính kèm ảnh chụp màn hình bên dưới
- [ ] Đã cập nhật tài liệu liên quan trong `docs/` (nếu có)

## Ảnh chụp màn hình (nếu có thay đổi UI)

<!-- Dán ảnh trước/sau vào đây -->

## Ghi chú cho reviewer

<!-- Có điểm nào cần reviewer chú ý đặc biệt không? -->
```

- [ ] **Step 2: Xác minh file**

Run: `cat "D:/Rikkei Education/lms-assessly-fe/.github/PULL_REQUEST_TEMPLATE.md"`

Expected: nội dung khớp như trên.

- [ ] **Step 3: Commit**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && git add .github/PULL_REQUEST_TEMPLATE.md && git commit -m "chore: thêm PR template chuẩn quy trình review"
```

---

### Task 5: Thêm commitlint + husky `commit-msg` hook

**Files:**
- Create: `commitlint.config.js`
- Create: `.husky/commit-msg`
- Modify: `package.json` (thêm 2 devDependencies qua `pnpm add -D`, tự động ghi lại `package-lock.json`)

**Interfaces:**
- Consumes: đang ở nhánh `develop`.
- Produces: mọi commit từ nay bị chặn nếu message không theo Conventional Commits — ảnh hưởng tới cách các task sau (Task 6, và mọi commit tương lai) phải viết message.

- [ ] **Step 1: Cài dependencies**

Run:
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm add -D @commitlint/cli @commitlint/config-conventional
```

Expected: `package.json` và `package-lock.json` được cập nhật, thêm 2 gói vào `devDependencies`.

- [ ] **Step 2: Tạo file cấu hình commitlint**

Nội dung `commitlint.config.js` (package.json không có `"type": "module"` nên dùng CommonJS):

```js
module.exports = {
    extends: ["@commitlint/config-conventional"],
};
```

- [ ] **Step 3: Tạo husky hook `commit-msg`**

Nội dung `.husky/commit-msg` (khớp phong cách husky v9 đã dùng ở `.husky/pre-commit` — không cần dòng `. "$(dirname ...)/_/husky.sh"`):

```
pnpm exec commitlint --edit "$1"
```

Sau khi tạo file, cấp quyền thực thi (bắt buộc để git hook chạy được):

```bash
chmod +x "D:/Rikkei Education/lms-assessly-fe/.husky/commit-msg"
```

- [ ] **Step 4: Test hook chặn message sai format**

Run:
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && git commit --allow-empty -m "sua loi linh tinh"
```

Expected: commit **thất bại**, output của commitlint báo lỗi kiểu `subject may not be empty` / `type may not be empty` (message không có prefix `feat:`/`fix:`/... hợp lệ theo Conventional Commits).

- [ ] **Step 5: Test hook chấp nhận message đúng format**

Run:
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && git commit --allow-empty -m "chore: test commit message hop le"
```

Expected: commit thành công. Sau đó xoá commit test rỗng này để không làm bẩn lịch sử:

```bash
git -C "D:/Rikkei Education/lms-assessly-fe" reset --soft HEAD~1
```

- [ ] **Step 6: Commit thật (deliverable của task này)**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && git add commitlint.config.js .husky/commit-msg package.json package-lock.json && git commit -m "chore: thêm commitlint và husky hook kiểm tra commit message"
```

Expected: hook `commit-msg` tự chạy trên chính message này và pass (vì `chore: ...` hợp lệ).

---

### Task 6: Thêm bước `type-check` riêng vào CI

**Files:**
- Modify: `.github/workflows/ci.yml:26-30`

**Interfaces:**
- Consumes: workflow CI hiện tại (job `build`, các step `Install pnpm` → `Use Node.js` → `Install dependencies` → `Lint` → `Build`).
- Produces: thêm 1 step `Type check` chạy `pnpm run type-check`, đặt trước `Lint` (khớp thứ tự đã dùng ở `.husky/pre-commit`: type-check trước, lint-staged sau).

- [ ] **Step 1: Sửa `.github/workflows/ci.yml`**

Thay đoạn:

```yaml
            - name: Install dependencies
              run: pnpm install --frozen-lockfile

            - name: Lint
              run: pnpm run lint

            - name: Build
              run: pnpm run build
              env:
                  NEXT_PUBLIC_GA_MEASUREMENT_ID: ${{ secrets.NEXT_PUBLIC_GA_MEASUREMENT_ID }}
```

thành:

```yaml
            - name: Install dependencies
              run: pnpm install --frozen-lockfile

            - name: Type check
              run: pnpm run type-check

            - name: Lint
              run: pnpm run lint

            - name: Build
              run: pnpm run build
              env:
                  NEXT_PUBLIC_GA_MEASUREMENT_ID: ${{ secrets.NEXT_PUBLIC_GA_MEASUREMENT_ID }}
```

- [ ] **Step 2: Xác minh lệnh `type-check` thật sự chạy sạch trên máy (proxy cho việc CI sẽ pass)**

Run:
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check
```

Expected: exit code 0, không có lỗi TypeScript nào in ra.

- [ ] **Step 3: Xác minh YAML không bị lỗi cú pháp**

Run: `cat "D:/Rikkei Education/lms-assessly-fe/.github/workflows/ci.yml"`

Expected: đọc lại toàn bộ file, xác nhận indentation nhất quán (4 space, khớp phần còn lại của file), step mới nằm đúng vị trí giữa `Install dependencies` và `Lint`.

- [ ] **Step 4: Commit**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && git add .github/workflows/ci.yml && git commit -m "ci: thêm bước type-check riêng biệt trước lint và build"
```

---

### Task 7: Xác minh cuối cùng trên `develop`

**Files:** không có file nào bị thay đổi — task xác minh thuần.

**Interfaces:**
- Consumes: toàn bộ deliverable Task 1-6.
- Produces: bằng chứng cho biết sub-project #1 hoàn tất, sẵn sàng chuyển sang sub-project #2.

- [ ] **Step 1: Chạy lint**

Run: `cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run lint:check`

Expected: exit code 0.

- [ ] **Step 2: Chạy type-check**

Run: `cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check`

Expected: exit code 0.

- [ ] **Step 3: Chạy build**

Run: `cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run build`

Expected: build thành công, không lỗi.

- [ ] **Step 4: Xác minh trạng thái git cuối cùng**

Run: `git -C "D:/Rikkei Education/lms-assessly-fe" log --oneline --all --graph && git -C "D:/Rikkei Education/lms-assessly-fe" branch -a && git -C "D:/Rikkei Education/lms-assessly-fe" status --short`

Expected:
- `main`: có 3 commit (`Initial commit from Create Next App` → spec doc → catch-up commit).
- `develop`: nhánh hiện tại, thêm 3 commit trên `main` (PR template, commitlint+hook, CI type-check).
- `status --short`: sạch, không có gì unstaged/untracked ngoài file bị `.gitignore`.

## Ghi chú cho các bước tiếp theo (không thuộc plan này)

- Khi đã quyết định remote GitHub: push cả `main` và `develop`, đặt `develop` làm default branch, mở PR `develop → main` để đưa 3 commit thiết lập quy trình (Task 4-6) vào `main`, rồi bật branch protection (PR + ≥1 approval + CI pass) cho cả hai nhánh như spec đã mô tả.
- Sub-project #2 (data/network layer) sẽ **giữ nguyên cách dùng mock data trong `src/mocks/*.mock.ts`** làm nguồn dữ liệu (chưa có API thật) — chỉ thêm lớp TanStack Query/hooks bọc quanh mock hiện có để sẵn sàng thay bằng API thật sau này mà không phải sửa lại component. Ghi chú này ghi lại yêu cầu người dùng nêu ra sau khi spec #1 được duyệt, sẽ đưa vào spec riêng của sub-project #2 khi brainstorm phần đó.
