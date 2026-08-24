# UI Updates — LMS Assessly FE

> Spec cập nhật / cải tiến UI **sau** phase triển khai WP cơ bản (extracted-portal).  
> Khác với `work-packages/` (implement lần đầu từ EP), thư mục này mô tả **thay đổi có chủ đích** khi UX review phát hiện block không gắn kết, layout cần tái cấu trúc, hoặc nội dung cần chuyển vị trí.

## Cách dùng

1. Mở spec trong thư mục này (file `SPEC-*.md`).
2. Prompt: _"Implement theo spec UI update này, tuân thủ `.cursor/rules/frontend.mdc` và persona STUDENT."_
3. Đối chiếu code hiện tại (`src/views/`, `src/components/ui/`) — **không** bắt buộc khớp 100% EP nếu spec ghi rõ là UX redesign.
4. Mock data → `src/mocks/`; text → `UI_TEXT`; type → `src/types/`.

## Quy tắc

| Quy tắc             | Ghi chú                                                                     |
| ------------------- | --------------------------------------------------------------------------- |
| Persona mặc định    | Sinh viên (`STUDENT`)                                                       |
| API                 | Spec ghi rõ phase mock vs API; mặc định mock trước                          |
| Phạm vi             | Chỉ sửa file liên quan spec; không refactor ngoài scope                     |
| EP preview          | Redesign có thể lệch EP — spec là nguồn chân lý cho update đó               |
| **Reposition-only** | Chỉ đổi vị trí grid/composition — **không** đổi markup/visual component gốc |

## Danh sách spec

| Spec                                                                 | Màn / khu vực                                                          | Trạng thái |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------- |
| [SPEC-home-dashboard-redesign.md](./SPEC-home-dashboard-redesign.md) | Trang chủ — layout tổng thể: đổi vị trí Nhân vật/BXH + hàng thành tích | Draft      |

## Liên quan

- WP gốc: `work-packages/WP-03-student-home.md`
- Spec tích hợp: `docs/spec/work-packages/SPEC-WP-03-student-home.md`
- BXH đầy đủ: route `/leaderboard` (giữ nguyên, không xóa)

> **Note:** `SPEC-home-achievement-section-redesign.md` đã được gộp vào `SPEC-home-dashboard-redesign.md`.
