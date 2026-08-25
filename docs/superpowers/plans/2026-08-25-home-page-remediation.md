# Home Page Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use `- [ ]` checkboxes.

**Goal:** Khắc phục 6 vấn đề trang Home theo thứ tự ưu tiên Cao→Thấp: (1) bug "4 đề ra cùng câu hỏi" + kiến trúc dữ liệu hardcode, (2) màu/size hardcode, (3) CTA thiếu phân cấp, (4) cảnh báo next/image, (5) aria-label tiếng Anh.

**Architecture:** Task 1 thay catalog giả `CURATED_EXAMS`/`TOPIC_TABS` bằng `usePracticeList()` thật (seam đã có từ #2). Task 2 snap màu/size sang design token theo bảng đã đo. Task 3-5 là fix nhỏ, độc lập.

**Tech Stack:** Next.js 16, React 19, TanStack Query (`usePracticeList`), Tailwind v4 tokens.

**Spec:** [docs/superpowers/specs/2026-08-25-home-page-remediation-design.md](../specs/2026-08-25-home-page-remediation-design.md)

## Global Constraints

- **Không đổi bố cục/section** của trang Home (giữ 5 section: Hero, Curated Exams, Banner, Stats, Features) — chỉ đổi nguồn dữ liệu, màu/size, và các fix nhỏ đã nêu.
- Task 1 đổi từ 4 card giả → 3 card thật (dữ liệu thật từ `MOCK_PRACTICE_LIST` chỉ có 3 item) — đây là thay đổi nội dung hiển thị đã được duyệt trong spec.
- ESLint đã enforce: text mới → `UI_TEXT`, không magic string.
- Suppressions: nếu sửa `home-view.tsx`/`main-header.tsx`/`main-footer.tsx` làm giảm vi phạm đã suppress → `pnpm exec eslint . --prune-suppressions`, commit `eslint-suppressions.json`.
- Commit Conventional Commits tiếng Việt; husky active; never `--no-verify`.
- pnpm: `export PATH="$HOME/.pnpm-shim:$PATH"` trước mọi lệnh.
- Nhánh `develop`. Base: commit spec vừa tạo (`git rev-parse HEAD`).
- Dev server localhost:3000 để browser-verify sau mỗi task.

---

### Task 1 (Cao): Thay catalog giả bằng dữ liệu thật từ `usePracticeList()`

**Files:** Modify `src/views/home/home-view.tsx`.

**Interfaces:**
- Consumes: `usePracticeList()` (`@/hooks/queries/use-practice`, trả `{ data, isLoading, isError, refetch }`, `data: PracticeItem[]`), `QueryStateBoundary` (`@/components/shared/query-state`), type `PracticeItem` (`@/types/practice.types`, có `id, title, category, description, totalQuestions, durationMinutes, difficulty`).
- Produces: section "Đề Thi Theo Chủ Đề" hiển thị dữ liệu thật, link `/practice-public/${item.id}` với id thật (`practice-01` v.v.).

- [ ] **Step 1: Đọc lại toàn bộ `home-view.tsx` hiện tại** để nắm chính xác JSX cần sửa (đã đọc ở bước audit — xác nhận không đổi từ lúc đó).

- [ ] **Step 2: Xoá `CURATED_EXAMS` và `TOPIC_TABS`** (2 hằng số module-scope ở đầu file).

- [ ] **Step 3: Sửa `export function HomeView()`**:
```tsx
export function HomeView() {
    const { data, isLoading, isError, refetch } = usePracticeList();
    const practices = data ?? [];
    const categories = Array.from(new Set(practices.map((p) => p.category)));
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredExams = selectedCategory ? practices.filter((p) => p.category === selectedCategory) : practices;

    return (
        // ... giữ nguyên toàn bộ JSX section 1 (Hero), section 3 (Banner), section 4 (Stats), section 5 (Features) KHÔNG ĐỔI
    );
}
```
(`useState` import đã có sẵn ở đầu file — chỉ đổi generic từ `string` sang `string | null`, giá trị khởi tạo từ `"all"` sang `null` nghĩa là "tất cả".)

- [ ] **Step 4: Sửa section 2 (Filter Tabs)** — thay vòng lặp `TOPIC_TABS.map` bằng vòng lặp `categories.map`, nút "Tất cả chủ đề" active khi `selectedCategory === null`:
```tsx
{/* Filter Tabs */}
<div className="mb-12 flex flex-wrap items-center justify-center gap-3">
    <button
        type="button"
        onClick={() => setSelectedCategory(null)}
        className={`cursor-pointer rounded-lg px-6 py-3 text-base font-medium transition-all ${
            selectedCategory === null ? "bg-brand-500 text-white shadow-xs" : "bg-white text-gray-800 hover:bg-brand-500 hover:text-white"
        }`}
    >
        Tất cả chủ đề
    </button>
    {categories.map((category) => (
        <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`cursor-pointer rounded-lg px-6 py-3 text-base font-medium transition-all ${
                selectedCategory === category ? "bg-brand-500 text-white shadow-xs" : "bg-white text-gray-800 hover:bg-brand-500 hover:text-white"
            }`}
        >
            {category}
        </button>
    ))}
    <Link href="/topics">
        <button
            type="button"
            className="cursor-pointer rounded-lg border border-dashed border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-800 transition-all hover:border-brand-500 hover:text-brand-500"
        >
            Xem thêm +
        </button>
    </Link>
</div>
```
(Lưu ý: bước này đã tiện thể áp token màu `bg-brand-500`/`text-gray-800`/`hover:text-brand-500` — trùng với Task 2, tránh sửa 2 lần trên cùng đoạn. `text-gray-800` là nearest-token của `#1e2328` theo bảng Task 2 — dùng luôn ở đây.)

- [ ] **Step 5: Sửa phần render card** — `PracticeItem` thật có field `tag` (KHÔNG có ảnh minh hoạ) và `difficulty`. Codebase ĐÃ có pattern card chuẩn cho đúng type này ở [`practice-list-view.tsx:57-93`](../../../src/views/practice/practice-list-view.tsx) (dùng component `Badge` từ `@/components/ui/badge`, icon `Clock`/`Layers` từ `lucide-react`, mapping difficulty→variant/label). **Tái dùng đúng pattern đó** (nhất quán, đã qua review ở #2) thay vì tự chế UI mới — chỉ bỏ ảnh (không có field) và bỏ `Users`/`participantsCount` (giữ đúng 2 stat "câu hỏi"+"phút" như thiết kế gốc của Home). Bọc bằng `QueryStateBoundary`:

```tsx
<QueryStateBoundary isLoading={isLoading} isError={isError} onRetry={refetch}>
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {filteredExams.map((practice) => (
            <Link key={practice.id} href={`/practice-public/${practice.id}`}>
                <div className="group flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1.5 hover:shadow-xl">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <Badge variant="primary" className="border-red-200 bg-brand-25 text-brand-600" size="sm">
                                {practice.category}
                            </Badge>
                            <Badge
                                variant={practice.difficulty === "HARD" ? "destructive" : practice.difficulty === "MEDIUM" ? "warning" : "success"}
                                size="sm"
                            >
                                {practice.difficulty === "HARD" ? "Nâng cao" : practice.difficulty === "MEDIUM" ? "Trung bình" : "Cơ bản"}
                            </Badge>
                        </div>
                        <h3 className="line-clamp-2 text-lg font-bold text-gray-800 transition-colors group-hover:text-brand-500">{practice.title}</h3>
                        <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">{practice.description}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs font-medium text-gray-400">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-brand-500" />
                            {practice.durationMinutes} phút
                        </span>
                        <span className="flex items-center gap-1">
                            <Layers className="h-3.5 w-3.5 text-brand-500" />
                            {practice.totalQuestions} câu hỏi
                        </span>
                    </div>
                </div>
            </Link>
        ))}
    </div>
</QueryStateBoundary>
```
Thêm import: `Badge` từ `@/components/ui/badge`, `Clock`/`Layers` bổ sung vào import `lucide-react` đã có (`BarChart3, Clock, Layers, Monitor, PlayCircle`). Bỏ import `Image` nếu không còn dùng nơi khác trong file (kiểm tra — vẫn còn dùng ở section 1 Hero và section 5 Features, GIỮ import).

(Đoạn code này đã dùng luôn token màu chuẩn của Task 2 — `bg-brand-25 text-brand-600`, `text-gray-800/400`, `bg-gray-50 border-gray-100`, `text-brand-500` — vì viết lại hoàn toàn, tránh sửa 2 lần trên cùng đoạn. Không cần snap `#10b981` nữa vì đã bỏ badge "Công khai" tự chế, dùng `difficulty` badge thật thay thế — badge xanh giả không còn tồn tại.)

- [ ] **Step 6: Verify**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check
```
Sửa lỗi type nếu field không khớp `PracticeItem` thật (đọc `src/types/practice.types.ts` nếu cần đối chiếu chính xác tên field). Prune suppressions nếu cần. Rồi `pnpm run build`.

- [ ] **Step 7: Browser-check** (dev server localhost:3000, mở `/`):
  - 3 card hiện đúng title/category/duration từ mock thật (không phải "Java/React/SQL/C++" giả nữa).
  - Bấm 1 card → vào đúng `/practice-public/practice-0X`, trang load được (không lỗi).
  - Bấm 1 tab category → lọc đúng card có category đó; bấm "Tất cả chủ đề" → hiện lại cả 3.
  - Loading state thoáng qua khi vào trang (`QueryStateBoundary` hoạt động).
  - Ghi lại nhận xét tông màu badge xanh mới vs cũ.

- [ ] **Step 8: Commit**
```bash
git add -A && git commit -m "fix(home): thay catalog đề thi giả bằng dữ liệu luyện tập thật, sửa bug cùng nội dung câu hỏi"
```

---

### Task 2 (Cao/Trung): Chuẩn hoá màu/size còn lại trong `home-view.tsx`

**Files:** Modify `src/views/home/home-view.tsx` (phần Hero/Banner/Stats/Features — section 2 đã xử ở Task 1).

**Bảng mapping** (đã đo, xem spec để tra cứu lý do):
| Hardcode | → Token |
|---|---|
| `[#ab1f24]` (mọi prefix: text/bg/border) | `brand-500` |
| `[#ffffff]` | `white` |
| `[#374151]` | `gray-600` |
| `[#f3f4f6]` | `gray-50` |
| `[#6b7280]` | `gray-400` |
| `[#1e2328]` | `gray-800` |
| `[#000000]` | `gray-900` |
| `text-[56px]` | `text-display-xl` |
| `text-[42px]` | `text-display-lg` |
| `text-[32px]` | `text-display-sm` |

(`shadow-[...]` rgba — GIỮ NGUYÊN, không phải token màu. `#10b981` đã bị loại bỏ hoàn toàn ở Task 1 cùng với badge "Công khai" giả — KHÔNG còn tồn tại trong file sau Task 1, bỏ khỏi bảng mapping.)

- [ ] **Step 1: Áp dụng theo bảng** cho Hero (section 1), Banner (section 3), Stats (section 4), Features (section 5) — giữ nguyên mọi prefix (bg-/text-/border-/from-/to-) và modifier (hover:/sm:/lg:), chỉ đổi phần trong ngoặc `[...]` sang tên token theo bảng.

- [ ] **Step 2: Verify**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && grep -nE "\[#[0-9a-fA-F]{6}\]|text-\[[0-9]+px\]" src/views/home/home-view.tsx; echo "grep exit (1=hết hardcode): $?"; pnpm run type-check && pnpm run lint:check
```
Prune suppressions nếu cần. Rồi `pnpm run build`.

- [ ] **Step 3: Browser-check kỹ** — so sánh trước/sau bằng screenshot: hero heading không vỡ dòng ở `text-display-xl`, h2 "Đề Thi Theo Chủ Đề"/"Đánh Giá Năng Lực..." ở `text-display-lg` không tràn, tông chữ xám (`gray-600/400/800/900`) đọc rõ tương đương bản cũ, nền `gray-50` không khác biệt rõ so với `#f3f4f6` cũ.

- [ ] **Step 4: Commit**
```bash
git add -A && git commit -m "refactor(ui): chuẩn hoá màu và cỡ chữ hardcode trong trang Home về design token"
```

---

### Task 3 (Trung bình): Thêm CTA primary trong Hero

**Files:** Modify `src/views/home/home-view.tsx` (section 1, khối nút CTA).

- [ ] **Step 1:** Thêm 1 `<Link href="/practice">` bọc nút primary filled, đặt TRƯỚC nút "Xem hướng dẫn" hiện có (giữ nguyên nút cũ, chỉ thêm mới):
```tsx
<div className="flex items-center gap-4 pt-2">
    <Link href="/practice">
        <button
            type="button"
            className="cursor-pointer rounded-full bg-brand-500 px-8 py-3.5 text-base font-medium text-white shadow-xs transition-all hover:bg-brand-600"
        >
            Bắt đầu luyện tập ngay
        </button>
    </Link>
    <Link href="/huong-dan">
        <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-brand-500 bg-white px-8 py-3.5 text-base font-medium text-brand-500 shadow-xs transition-all hover:bg-red-50/50"
        >
            <PlayCircle className="h-5 w-5 text-brand-500" />
            <span>Xem hướng dẫn</span>
        </button>
    </Link>
</div>
```
(Nút "Xem hướng dẫn" ở đây đã viết lại dùng token `brand-500`/`brand-600` thay `[#ab1f24]` — nếu Task 2 đã chạy trước và đổi đoạn này rồi thì chỉ cần thêm nút mới, không cần viết lại nút cũ.)

- [ ] **Step 2: Verify + Step 3: Browser-check** — 2 nút hiện cạnh nhau, nút primary nổi bật hơn (nền đỏ đặc), bấm vào `/practice` hoạt động. Responsive: trên mobile 2 nút không vỡ hàng (kiểm tra `flex-wrap` nếu cần — nếu vỡ, thêm `flex-wrap` vào container, ghi rõ trong report).

- [ ] **Step 4: Commit**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check && git add -A && git commit -m "feat(home): thêm CTA chính dẫn tới trang luyện tập, làm rõ phân cấp hành động"
```

---

### Task 4 (Nhỏ): Sửa cảnh báo `next/image` aspect-ratio

**Files:** Modify `src/views/home/home-view.tsx` (ảnh `peoplecontact.png`), `src/components/layout/main-footer.tsx` (ảnh `image.png`).

- [ ] **Step 1: `home-view.tsx`** — tìm `<Image src="/images/banner/peoplecontact.png" ... className="h-auto w-full object-contain drop-shadow-md" />`, thêm `style={{ height: "auto" }}`:
```tsx
<Image
    src="/images/banner/peoplecontact.png"
    alt="Hệ thống khảo thí trực tuyến Rikkei Education"
    width={480}
    height={380}
    className="h-auto w-full object-contain drop-shadow-md"
    style={{ height: "auto" }}
/>
```

- [ ] **Step 2: `main-footer.tsx`** — dòng có `<Image src="/images/footer/image.png" alt="Rikkei Edu" width={168} height={48} className="h-auto w-[168px] object-contain" priority />`, thêm `style={{ height: "auto" }}` tương tự.

- [ ] **Step 3: Verify + browser-check** — mở `/`, mở console, xác nhận KHÔNG còn 2 warning `next/image` aspect-ratio. Ảnh hiển thị không méo (so sánh trước/sau).
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check
```

- [ ] **Step 4: Commit**
```bash
git add -A && git commit -m "fix(ui): sửa cảnh báo tỉ lệ ảnh next/image ở trang chủ và footer"
```

---

### Task 5 (Nhỏ): `aria-label` tiếng Việt

**Files:** Modify `src/components/layout/main-header.tsx`.

- [ ] **Step 1:** Đổi `aria-label="Toggle menu"` → `aria-label={UI_TEXT.layout.openNavMenu}` (key đã có sẵn: `"Mở menu điều hướng"`, `UI_TEXT` đã import trong file).

- [ ] **Step 2: Verify + Step 3: Commit**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check && git add -A && git commit -m "chore(a11y): dùng UI_TEXT tiếng Việt cho aria-label nút menu di động"
```

---

### Task 6: Xác minh cuối

**Files:** không sửa.

- [ ] **Step 1: Full gate**
```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run test && pnpm run type-check && pnpm run lint:check && pnpm run build
```
- [ ] **Step 2: Đo lại vi phạm màu/size trong home-view.tsx** — kỳ vọng 0 (trừ shadow rgba).
- [ ] **Step 3: Browser toàn cảnh** — lướt lại trang Home từ đầu (desktop + mobile), xác nhận: đúng 3 đề thật, lọc hoạt động, 2 CTA rõ ràng, không console warning, không vỡ layout.
- [ ] **Step 4: Regression** — suite test #4 vẫn pass (không có test nào assert vào home-view nên không ảnh hưởng, nhưng chạy để chắc chắn không phá gì khác).
