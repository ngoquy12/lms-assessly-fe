# Thiết kế: Chuẩn hoá Design Token — màu / font / size (Refactor đồng bộ UI)

- **Ngày**: 2026-08-25
- **Trạng thái**: Design (chờ user duyệt plan trước khi execute — đây là refactor ĐỔI VISUAL ở Pha 2)
- **Bối cảnh**: từ audit design-consistency. Quyết định user: **Hybrid theo pha** + **giữ Roboto**.

## Vấn đề (từ audit, số liệu thực đo)

Design system có định nghĩa đầy đủ (token màu semantic, scale size, radius/shadow) + ESLint rule ép — nhưng tuân thủ kém, bị che bởi lỗi eslint last-wins (đã fix, nợ nằm trong `eslint-suppressions.json`):
- **Màu**: 318 chỗ hardcode arbitrary (`bg-[#hex]`/rgba); trong đó `#ab1f24` (=brand-500) hardcode 181 lần; 3-4 sắc đỏ gần trùng; xám phân mảnh (`#1e2328`, `#2d2c2c`, `#374151`…); `slate-*` (455, KHÔNG phải token dự án) chạy song song với `gray-*` (206).
- **Font**: áp dụng nhất quán (Roboto qua `--font-sans-primary`, không hardcode trong tsx) NHƯNG theme.css ghi nhầm "Be Vietnam Pro" + 23 file font dead (`be-vietnam-pro`, `sf-pro-display` không import).
- **Size**: 146 chỗ `text-[Npx]` tuỳ ý ngoài scale (`text-sm/md/lg`); ESLint KHÔNG bắt arbitrary size.
- **Config**: `tailwind.config.ts` map `brand.500 → var(--brand-500)` (biến CHẾT, không định nghĩa); `theme.css @theme` định nghĩa `--color-brand-500` → cái này thắng nên token vẫn chạy, nhưng block color trong config là dead/redundant.

## Kiểm chứng (đã đo)

- `bg-brand-500` render `rgb(171,31,36)` = `#ab1f24` ✅; `text-brand-600` = `#90171b` ✅ (verified browser). → thay hex↔token họ đỏ là **pixel-identical**.
- Khớp-chính-xác hex↔token CHỈ có: `#ab1f24`=brand-500, `#90171b`=brand-600. Mọi hardcode khác (xám/đen/xanh/tint) KHÔNG có token trùng khít.
- Token `text-md`/`text-sm` **bundle line-height** → swap `text-[16px]`→`text-md` có thể đổi line-height → KHÔNG blind-safe.

## Mục tiêu

Đưa toàn bộ page/component về dùng design token (màu/size), thống nhất font, dọn config, và **bật giám sát** để không tái phát — theo 2 pha: Pha 1 an toàn tuyệt đối (0 đổi visual), Pha 2 snap token gần nhất (đổi visual nhẹ, có browser-check).

## Ngoài phạm vi

- Không redesign layout/bố cục. Chỉ đổi giá trị màu/size/font sang token.
- Không đổi font thực tế (giữ Roboto).
- Không tạo lại palette; nếu 1 màu dùng nhiều mà không có token phù hợp (vd iOS blue `#007aff`) → cân nhắc thêm token mới (quyết trong Pha 2), không đổi bừa.

## Thiết kế theo pha

### PHA 1 — An toàn tuyệt đối (0 đổi giao diện)

**1a. Màu khớp-chính-xác** (verified pixel-identical):
- `<prefix>-[#ab1f24]` → `<prefix>-brand-500` (giữ nguyên prefix bg/text/border/ring/from/to + mọi modifier hover:/focus:/sm:…). ~181 chỗ.
- `<prefix>-[#90171b]` → `<prefix>-brand-600`. ~9 chỗ.
- (Nếu tìm thêm hex nào == token value trong lúc build map → thêm vào Pha 1.)

**1b. Font cleanup** (0 đổi visual — chỉ sửa docs + xoá dead assets):
- Sửa comment `theme.css` "Be Vietnam Pro" → "Roboto (via next/font, --font-sans-primary)".
- Xoá `src/fonts/be-vietnam-pro/` + `src/fonts/sf-pro-display/` (23 file, không được import — xác nhận grep trước khi xoá).

**Verify Pha 1**: build sạch + browser spot-check vài trang hotspot (home/exam/toeic) phải **giống hệt** trước/sau (chụp so sánh hoặc computed-color check `bg-brand-500`==`#ab1f24`) + `pnpm exec eslint . --prune-suppressions` để baseline co lại (số suppression giảm ~190).

### PHA 2 — Snap token gần nhất (đổi visual nhẹ, có review)

Mỗi nhóm: (1) build bảng mapping, (2) áp dụng, (3) build + **browser spot-check** trang đại diện, (4) prune suppressions.

**2a. `slate-*` → `gray-*`** (455 chỗ, lớn nhất): dựng bảng map slate-N → gray-M dựa trên giá trị gần nhất (LƯU Ý scale lệch: `gray-100` dự án = `slate-200` Tailwind về value; nên map theo VALUE gần nhất, không theo số). Browser-check để chắc xám không lệch rõ.

**2b. Màu hardcode còn lại → token gần nhất / token mới**: 
- Đỏ lệch (`#9c1b20`, `#8b1a1f`) → `brand-500/600` gần nhất.
- Xám/đen (`#1e2328`, `#2d2c2c`, `#374151`, `#4a4a4a`, `#848484`, `#6b7280`, `#000000`) → `gray-*` gần nhất.
- Tint đỏ (`#fff6f7`, `#f8e9ea`) → `brand-25/50` gần nhất (badge nền đỏ nhạt).
- Xanh (`#007aff` iOS, `#1b2f4b`, `#1f3f63`): quyết định thêm token (`blue-*`/`indigo-*` đã có vài bậc) hay map gần nhất — ghi rõ trong task.

**2c. Size `text-[Npx]` → scale** (146 chỗ, line-height-aware):
- Khớp value: `text-[16px]`→`text-md`, `text-[14px]`→`text-sm`, `text-[18px]`→`text-lg`… NHƯNG kiểm line-height: nếu chỗ đó có `leading-*` riêng thì swap an toàn; nếu không, browser-check rhythm sau swap.
- Số lẻ (`text-[15px]`, `text-[17px]`, `text-[11px]`, `text-[13px]`): snap về bậc gần nhất (`text-sm`/`text-md`/`text-xs`), chấp nhận lệch 1-2px, browser-check.

### PHA 3 — Config + phòng ngừa

**3a. Dọn config**: rà `tailwind.config.ts` — block `colors` map `var(--brand-*)` (chết) trong khi `@theme` mới là nguồn thật. Xác nhận `@theme` phủ đủ mọi màu config đang khai (brand/gray/success/warning/error/blue/indigo), rồi bỏ block redundant/dead trong config (hoặc trỏ đúng `var(--color-*)`). Verify không mất token nào.

**3b. ESLint chặn arbitrary size mới**: thêm rule vào governance (`no-restricted-syntax`) bắt `text-\[\d+px\]` (và tuỳ chọn spacing `[p|m|gap|h|w]-\[\d+px\]`) trong className, để code MỚI không thêm size hardcode. Vi phạm cũ đã xử ở 2c → baseline sạch phần này.

## Xác minh tổng

- Sau mỗi pha: `type-check` + `lint:check` + `build` sạch; `eslint-suppressions.json` co lại đúng phần đã xử.
- Pha 1: browser phải **giống hệt**. Pha 2: browser **chấp nhận được** (không vỡ layout, màu/size lệch nhỏ).
- Cuối: đo lại số vi phạm màu/size (kỳ vọng gần 0 hardcode màu; slate→gray xong; size vào scale).
- Regression: chạy suite test (#4) sau refactor.

## Rủi ro

- **Line-height bundling** ở size token → 2c phải browser-check, không blind.
- **slate→gray** đổi tông xám nhẹ toàn app → nhóm lớn nhất, review kỹ.
- **Prune suppressions** phải chạy sau mỗi nhóm để lint:check không đỏ vì "unused suppressions".
- **Không nuốt file đang sửa của người khác** (session eslint-fix cũ) — kiểm git status trước.
- Refactor diện rộng → làm theo nhóm/commit nhỏ, mỗi nhóm 1 commit + verify, dễ revert.
