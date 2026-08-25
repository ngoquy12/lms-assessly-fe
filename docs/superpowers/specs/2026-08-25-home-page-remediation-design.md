# Thiết kế: Khắc phục 6 vấn đề trang Home (Cao → Thấp)

- **Ngày**: 2026-08-25
- **Trạng thái**: Approved (user: "xử lý luôn 6 vấn đề theo mức độ từ cao xuống thấp")
- **Nguồn**: audit UI/UX trang Home (phiên trước). 6 vấn đề, ưu tiên Cao→Thấp.

## Bối cảnh & vấn đề #1+#2 gộp (Cao) — cùng 1 gốc rễ

Điều tra sâu hơn phát hiện **vấn đề #1 (bug "4 đề ra cùng câu hỏi") và #2 (kiến trúc dữ liệu hardcode) là MỘT gốc rễ**:

`home-view.tsx` tự định nghĩa `CURATED_EXAMS` (4 item, id giả `exam-1..4`) và `TOPIC_TABS` (topicId giả `java/frontend/database/embedded`) — một catalog song song, không qua `usePracticeList()`/`practice.service` đã dựng ở sub-project #2. 4 card này trỏ `/practice-public/exam-1..4`, nhưng `practice-exam-public-view.tsx` **không dùng `practiceId`** — nó gọi `useExamQuestions()` chung (dùng bởi CẢ `exam-taking-view.tsx`), luôn trả `MOCK_EXAM_QUESTIONS` — một bộ câu hỏi generic duy nhất. Đây là **giới hạn có sẵn của toàn route `/practice-public/[id]`** (áp dụng cho mọi id, kể cả id thật `practice-01/02/03` từ `/practice`), **không phải lỗi riêng của Home**.

**Ruling — không mở rộng nội dung mock** (viết thêm bộ câu hỏi riêng cho từng đề là việc content-authoring lớn, ngoài phạm vi "refactor Home"; và sẽ đụng `useExamQuestions`/`practice-exam-public-view` dùng chung bởi `exam-taking-view` — rủi ro lan rộng không cần thiết). **Fix đúng chỗ**: bỏ catalog giả `CURATED_EXAMS`/`TOPIC_TABS`, thay bằng dữ liệu THẬT từ `usePracticeList()` (đã có, seam đã dựng ở #2). Điều này:
- Xoá bug quảng cáo sai (Home không còn giả vờ có 4 đề chuyên biệt Java/React/SQL/C++ với nội dung riêng — hiện thị đúng 3 đề luyện tập thật đang có, với category/difficulty/duration thật).
- Sửa vi phạm kiến trúc (không còn hardcode data trong view).
- KHÔNG đụng `useExamQuestions`/`practice-exam-public-view`/`exam-taking-view` (ngoài phạm vi, dùng chung nơi khác).
- Route `/practice-public/[id]` đã hoạt động đúng cho id thật (`practice-01` v.v.) — Home giờ chỉ trỏ tới id thật, dùng lại đúng luồng có sẵn.

**Bộ lọc chủ đề**: `MOCK_PRACTICE_LIST` không có `topicId` khớp `/topics`, nhưng CÓ trường `category` thật (3 giá trị phân biệt: "Khoa học Máy tính", "Tiếng Anh Chuyên ngành", "Lập trình Web"). Thay vì xoá hẳn bộ lọc, **derive tab filter từ `category` thật** (không hardcode danh sách giả) — giữ trải nghiệm lọc nhưng dữ liệu thật 100%.

## Vấn đề #3 (đã có mức độ, xử lý trong đợt này) — Chuẩn hoá màu/size trong `home-view.tsx`

Phạm vi: CHỈ `home-view.tsx` (không đụng header/footer/toàn dự án — đó thuộc plan chuẩn hoá token toàn cục đã có sẵn, sub-project riêng). Bảng mapping đã đo chính xác:

| Hardcode | Token | Khoảng cách RGB | Loại |
|---|---|---|---|
| `#ab1f24` | `brand-500` | 0 (khớp tuyệt đối) | An toàn tuyệt đối |
| `#ffffff` | `white` (Tailwind builtin) | 0 (khớp tuyệt đối) | An toàn tuyệt đối |
| `#374151` | `gray-600` | 5.7 (gần như khớp) | An toàn |
| `#f3f4f6` | `gray-50` | 7.3 | An toàn |
| `#6b7280` | `gray-400` | 13.2 | Snap, browser-check |
| `#1e2328` | `gray-800` | 19.3 | Snap, browser-check |
| `#000000` | `gray-900` | 23.9 | Snap, browser-check |
| `#10b981` | `success-600` | 56.5 (lệch rõ) | **Snap có đổi tông màu — browser-check kỹ, đây là badge "Công khai"** |

Size: `text-[56px]`, `text-[42px]`, `text-[32px]` → không khớp scale hiện có (`text-display-md`=36px, `text-display-lg`=48px theo spacing scale) — snap về bậc gần nhất, browser-check dòng chữ hero không vỡ.

(Không đụng `shadow-[...]` rgba — đây là art-directed shadow riêng, không phải token màu, ESLint cũng không coi là vi phạm.)

## Vấn đề #4 (Trung bình) — CTA primary rõ ràng trong hero

Thêm 1 nút CTA **primary (filled, brand-500)** cạnh nút outline "Xem hướng dẫn" hiện có, dẫn tới `/practice` (catalog luyện tập thật — nơi người dùng thực sự "bắt đầu thi"). KHÔNG xoá/redesign nút cũ, chỉ thêm 1 nút mới.

## Vấn đề #5 (Nhỏ) — Cảnh báo `next/image` aspect-ratio

2 chỗ: `src/views/home/home-view.tsx` (`peoplecontact.png`) và `src/components/layout/main-footer.tsx` (`image.png` — component dùng chung mọi trang, nhưng cảnh báo được phát hiện khi audit Home nên xử lý cùng đợt, fix 1 dòng an toàn). Thêm `style={{ height: "auto" }}` (hoặc `width: "auto"` tuỳ chiều bị cố định) theo đúng khuyến nghị Next.js.

## Vấn đề #6 (Nhỏ) — `aria-label` tiếng Việt

`src/components/layout/main-header.tsx`: `aria-label="Toggle menu"` → tiếng Việt (`"Mở/đóng menu"` hoặc theo `UI_TEXT` nếu có khoá phù hợp — nếu chưa có, thêm khoá mới vào `UI_TEXT.common` hoặc namespace layout).

## Thứ tự thực thi (Cao → Thấp)

1. Kiến trúc dữ liệu Home (bug + hardcode) — gộp #1+#2
2. Màu/size trong home-view.tsx — #3
3. CTA primary — #4
4. next/image warnings — #5
5. aria-label — #6

## Xác minh

- Mỗi task: `type-check`+`lint:check`(prune nếu cần)+`build` sạch.
- Task 1: browser xác nhận 3 card thật hiện đúng (title/category/duration từ mock thật), bấm vào dẫn tới `/practice-public/practice-0X` hoạt động, lọc theo category hoạt động.
- Task 2: browser so màu trước/sau (đặc biệt badge "Công khai" — biết trước sẽ đổi tông), chữ hero không vỡ dòng.
- Task 3: browser thấy 2 CTA rõ phân cấp.
- Task 4/5: browser xác nhận hết console warning, menu button có label tiếng Việt.
- Cuối: full gate + browser lướt toàn trang Home.

## Rủi ro

- Đổi từ 4 card giả → 3 card thật là **thay đổi nội dung hiển thị** (không chỉ code) — cần xác nhận với user nếu muốn giữ đúng 4 card (có thể lặp 1 item hoặc chờ mock có thêm dữ liệu) — **ruling: chấp nhận 3 card thật, trung thực hơn là 4 card giả**.
- Badge "Công khai" đổi tông xanh (`#10b981`→`success-600`) — lệch rõ nhất trong bảng, browser-check kỹ, có thể cần user duyệt nếu quá khác biệt.
