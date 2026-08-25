# Design Token Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use `- [ ]` checkboxes.

**Goal:** Đưa toàn bộ page/component về design token (màu/size), thống nhất font (giữ Roboto), dọn config, bật giám sát — theo 2 pha: Pha 1 pixel-identical (0 đổi visual), Pha 2 snap token gần nhất (đổi visual nhẹ, browser-check từng nhóm).

**Architecture:** Thay hardcode → token bằng biến đổi có kiểm soát (sed cho khớp-chính-xác; mapping table + browser-check cho snap). Prune `eslint-suppressions.json` sau mỗi nhóm để baseline co lại. Thêm ESLint rule chặn arbitrary size mới.

**Tech Stack:** Tailwind v4 (@theme tokens), ESLint governance + bulk-suppressions, Next 16 dev server để browser-verify.

**Spec:** [docs/superpowers/specs/2026-08-25-design-token-normalization-design.md](../specs/2026-08-25-design-token-normalization-design.md)

## Global Constraints

- **KHÔNG redesign layout**. Chỉ đổi giá trị màu/size/font sang token.
- **Pha 1 = 0 đổi visual** (giá trị == token, đã verified: `bg-brand-500`=`#ab1f24`, `text-brand-600`=`#90171b`). **Pha 2 = đổi visual nhẹ, BẮT BUỘC browser spot-check** trang đại diện trước khi commit mỗi nhóm.
- **Prune sau mỗi nhóm**: sửa file có suppression làm giảm vi phạm → `pnpm run lint:check` báo exit 2 "unused suppressions" → chạy `pnpm exec eslint . --prune-suppressions` và `git add eslint-suppressions.json` cùng commit nhóm đó.
- Message commit Conventional Commits tiếng Việt; husky active; never `--no-verify`.
- pnpm: `export PATH="$HOME/.pnpm-shim:$PATH"` trước mọi lệnh.
- Nhánh `develop`. Base: commit spec vừa tạo (`git rev-parse HEAD`).
- Dev server localhost:3000 để browser-verify; đăng nhập demo `hocvien@rikkei.edu.vn`/`Rikkei@123` cho các trang protected (exam/toeic/competency/profile).
- Làm theo nhóm nhỏ, mỗi nhóm 1 commit + verify → dễ revert.

---

## PHA 1 — An toàn tuyệt đối (0 đổi giao diện)

### Task 1: Màu khớp-chính-xác — họ đỏ brand

**Files:** mọi `src/**/*.tsx` chứa `[#ab1f24]` / `[#90171b]` (21+ file).

- [ ] **Step 1: Chốt phạm vi thay thế**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && grep -rn "\[#ab1f24\]\|\[#AB1F24\]\|\[#90171b\]\|\[#90171B\]" src --include="*.tsx" | wc -l
```
Ghi lại số (kỳ vọng ~190).

- [ ] **Step 2: Thay `[#ab1f24]`→`brand-500`, `[#90171b]`→`brand-600`** (giữ prefix + modifier + opacity /NN). Vì `[#ab1f24]` chỉ xuất hiện dưới dạng arbitrary COLOR, thay chuỗi trong ngoặc là an toàn:
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && find src -name "*.tsx" -exec sed -i 's/\[#ab1f24\]/brand-500/g; s/\[#AB1F24\]/brand-500/g; s/\[#90171b\]/brand-600/g; s/\[#90171B\]/brand-600/g' {} +
```

- [ ] **Step 3: Xác minh không còn 2 hex đó + không lẫn**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && grep -rn "#ab1f24\|#90171b" src --include="*.tsx"; echo "grep exit (1=hết): $?"
```
Expected: không còn (exit 1). Kiểm 1-2 file (vd home-view) mắt thường: `bg-brand-500`, `text-brand-500`, `focus:border-brand-500`, `hover:bg-brand-600` đúng hình dạng.

- [ ] **Step 4: Verify pixel-identical**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check; echo "lint exit: $?"
```
Nếu lint:check exit 2 (unused suppressions do vi phạm màu giảm) → `pnpm exec eslint . --prune-suppressions`, rồi `pnpm run lint:check` phải exit 0. Rồi `pnpm run build`.
Browser: mở `/practice`, `/` (home), `/toeic` — màu đỏ brand phải **y hệt** (đã chứng minh token = hex). Inject check: `getComputedStyle(document.querySelector('.bg-brand-500')||document.body)` hoặc so sánh ảnh trước/sau nếu có.

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "refactor(ui): thay mã màu đỏ thương hiệu hardcode bằng token brand-500/600"
```
(`git add -A` để gồm eslint-suppressions.json nếu đã prune.)

---

### Task 2: Font cleanup (comment + xoá dead assets)

**Files:** `src/styles/theme.css` (comment), xoá `src/fonts/be-vietnam-pro/`, `src/fonts/sf-pro-display/`.

- [ ] **Step 1: Xác nhận font files KHÔNG được import (an toàn để xoá)**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && grep -rn "be-vietnam-pro\|sf-pro-display\|Be Vietnam Pro\|SF Pro" src --include="*.ts" --include="*.tsx" --include="*.css" | grep -v "theme.css"; echo "grep exit (1=không dùng): $?"
```
Expected: exit 1 (không nơi nào import). Nếu CÓ import → DỪNG, báo lại (không xoá).

- [ ] **Step 2: Sửa comment theme.css** — đổi dòng comment "EP prototype uses Be Vietnam Pro for all UI" thành phản ánh thực tế (Roboto via next/font, biến `--font-sans-primary`). Chỉ sửa comment, KHÔNG đổi giá trị `--font-sans`/`--font-body` (chúng trỏ `var(--font-sans-primary, "Be Vietnam Pro")` — fallback "Be Vietnam Pro" vô hại vì next/font luôn set biến; có thể đổi fallback thành `"Roboto"` cho nhất quán).

- [ ] **Step 3: Xoá dead font dirs**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && git rm -r src/fonts/be-vietnam-pro src/fonts/sf-pro-display
```

- [ ] **Step 4: Verify + commit**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run build
```
Expected: build sạch (font không đổi → app render y nguyên). Commit:
```bash
git add -A && git commit -m "chore(ui): dọn font dead (be-vietnam-pro, sf-pro-display) và sửa comment theme.css cho khớp Roboto"
```

---

## PHA 2 — Snap token gần nhất (đổi visual nhẹ, browser-check)

**Phương pháp chung mỗi task:** (1) dựng bảng mapping (đo value → token gần nhất), (2) áp dụng bằng sed theo bảng, (3) type-check+lint:check (prune nếu cần)+build, (4) **browser spot-check** trang đại diện, (5) commit.

### Task 3: `slate-*` → `gray-*` (nhóm lớn nhất ~455)

**Files:** mọi `src/**/*.tsx` dùng `slate-*`.

- [ ] **Step 1: Dựng bảng map theo VALUE** (scale lệch: gray dự án dùng value của slate nhưng nhãn số khác). Trích value gray token + so với value slate Tailwind, lập map `slate-N → gray-M` gần nhất. Ghi bảng vào report. (Vd cần xác định: gray-100=rgb(226 232 240)=slate-200 → nên `slate-200`→`gray-100`; suy tương tự các bậc. Với bậc slate không có gray tương ứng gần → chọn gray gần nhất và ghi rõ.)

- [ ] **Step 2: Áp dụng** — sed theo bảng cho các prefix (bg|text|border|ring|divide|from|to|via|placeholder|outline)-slate-N → -gray-M, giữ modifier + opacity.

- [ ] **Step 3: Verify** — type-check+lint:check (prune)+build.

- [ ] **Step 4: Browser spot-check** — mở 3-4 trang nhiều xám (home, exam-taking, profile, ranking): tông xám không lệch rõ, không vỡ contrast. Ghi nhận.

- [ ] **Step 5: Commit** `refactor(ui): thống nhất thang xám slate-* về token gray-*`.

### Task 4: Màu hardcode còn lại → token gần nhất / token mới

**Files:** các `bg-[#hex]`/`bg-[rgba()]` còn lại sau Task 1/3.

- [ ] **Step 1: Liệt kê màu hardcode còn lại + tần suất** (`grep -rhoE "(bg|text|border|...)-\[(#..|rgba..)\]"`), nhóm theo họ: đỏ lệch, xám/đen, tint đỏ, xanh.
- [ ] **Step 2: Dựng mapping → token gần nhất**: đỏ lệch→brand-*, xám/đen→gray-*, tint đỏ→brand-25/50. **Xanh** (`#007aff`, `#1b2f4b`, `#1f3f63`): quyết định — nếu 1 màu dùng ≥5 lần mà không có token gần → THÊM token mới vào `theme.css` (`--color-blue-500` v.v. đã có vài bậc; bổ sung bậc cần) thay vì map lệch; ghi rõ quyết định trong report.
- [ ] **Step 3: Áp dụng + Step 4 verify + Step 5 browser-check + Step 6 commit** `refactor(ui): chuẩn hoá màu hardcode còn lại về design token`.

### Task 5: Size `text-[Npx]` → scale (line-height-aware, ~146)

**Files:** `src/**/*.tsx` dùng `text-[Npx]`.

- [ ] **Step 1: Bảng map px → token**: đo value token (`text-xs`~12, `text-sm`~14, `text-md`~16, `text-lg`~18, `text-xl`~20, `text-display-*`). Khớp value: 16→text-md, 14→text-sm, 18→text-lg… Số lẻ (15,17,11,13,32,38,26,28): snap bậc gần nhất (ghi rõ mỗi số → token nào).
- [ ] **Step 2: LƯU Ý line-height** — token size bundle line-height. Trước khi thay hàng loạt, kiểm mẫu vài chỗ: nếu element có `leading-*` riêng → swap an toàn; nếu không → line-height sẽ theo token. Áp dụng rồi **browser-check kỹ vertical rhythm** (heading, card title, body).
- [ ] **Step 3: Áp dụng (sed theo bảng) + Step 4 verify + Step 5 browser-check nhiều trang + Step 6 commit** `refactor(ui): đưa cỡ chữ hardcode về scale token`.

---

## PHA 3 — Config + phòng ngừa

### Task 6: Dọn config Tailwind

**Files:** `tailwind.config.ts`.

- [ ] **Step 1:** Xác nhận `@theme` (theme.css) phủ đủ mọi màu mà `tailwind.config.ts` khai (brand/gray/success/warning/error/blue/indigo) — so danh sách. `@theme --color-X` tự sinh utility; block `colors` trong config map `var(--brand-*)` (biến CHẾT) là redundant.
- [ ] **Step 2:** Bỏ block `colors` dead trong config (hoặc trỏ đúng `var(--color-*)`). **Verify không mất token nào**: build + browser check vài class (`bg-brand-500`, `bg-success-500`, `text-error-600`, `text-indigo-400`) vẫn render đúng màu (inject computed-color check). Nếu bỏ config làm mất 1 token (màu chỉ có ở config, không ở @theme) → GIỮ token đó (thêm vào @theme) trước khi bỏ.
- [ ] **Step 3: Commit** `refactor(config): bỏ mapping màu chết trong tailwind.config, thống nhất nguồn token về @theme`.

### Task 7: ESLint chặn arbitrary size mới

**Files:** `eslint.config.mjs`.

- [ ] **Step 1:** Thêm vào `STRICT_VALUE_CHECKS` (hoặc block phù hợp áp cho views/components) 1 selector `no-restricted-syntax` bắt `className` chứa `text-[\d+px]` (và tuỳ chọn `(p|m|gap|h|w|size)-\[\d+px\]`), message hướng dùng scale token. Đảm bảo KHÔNG áp cho test files (override đã có).
- [ ] **Step 2:** Sau Task 5 các size đã vào scale → chạy `pnpm run lint:check`; nếu còn sót arbitrary size chưa xử → hoặc sửa nốt hoặc prune (nhưng mục tiêu là 0). Verify exit 0.
- [ ] **Step 3: Commit** `feat(lint): chặn cỡ chữ arbitrary text-[Npx] để giữ đồng bộ scale`.

---

### Task 8: Xác minh cuối + đo lại

- [ ] **Step 1: Full gate** — `pnpm run test && pnpm run type-check && pnpm run lint:check && pnpm run build` đều pass.
- [ ] **Step 2: Đo lại vi phạm** (bypass suppressions như audit): kỳ vọng color_arbitrary ~0, slate ~0, size vào scale. Ghi số trước/sau.
- [ ] **Step 3: Baseline co lại** — `git diff` `eslint-suppressions.json` cho thấy giảm đáng kể (màu ~318→~0, text vẫn còn ~648 vì đó là text tiếng Việt, ngoài phạm vi đợt này).
- [ ] **Step 4: Browser toàn cảnh** — lướt các trang chính (home, practice, topics, ranking, profile, exam-taking, toeic, competency-result) xác nhận không vỡ, đồng bộ hơn. Ghi report.
- [ ] **Step 5: Regression** — suite test #4 vẫn 14/14 pass.

## Ghi chú carry-forward
- 648 vi phạm text tiếng Việt hardcode (đưa vào UI_TEXT) là đợt riêng — KHÔNG thuộc plan này (chỉ màu/font/size).
- Sau đợt này baseline suppressions còn chủ yếu là text → có thể lên đợt "i18n/UI_TEXT normalization".
