# SPEC — Home Dashboard Redesign (Layout + Achievement Row)

|                       |                                                              |
| --------------------- | ------------------------------------------------------------ |
| **ID**                | UI-UPD-01                                                    |
| **Status**            | Draft                                                        |
| **Persona**           | Sinh viên                                                    |
| **Route**             | `/` (dashboard / trang chủ)                                  |
| **WP gốc**            | WP-03 — Student Home                                         |
| **Implement doc gốc** | `docs/ui-implementation/work-packages/WP-03-student-home.md` |
| **Ngày**              | 2026-07-26                                                   |

---

## 0. Tóm tắt thay đổi

| #   | Thay đổi                                                         | Component                                            | Đổi thiết kế?                   |
| --- | ---------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------- |
| A   | **Nhân vật** đưa lên cùng hàng 2 thẻ tin phụ (Workshop + Học vụ) | `HomeCharacterCard`                                  | **Không** — chỉ đổi vị trí grid |
| B   | **Bảng xếp hạng mini** thay **vị trí cũ của Nhân vật**           | `HomeMiniLeaderboard`                                | **Không** — chỉ đổi vị trí grid |
| C   | **Gỡ** Môn đang học · Dự báo điểm khỏi home                      | `HomeCourseProgress`                                 | Gỡ khỏi composition             |
| D   | **Thay** 2 khối cuối bằng Sắp mở khóa + Vừa đạt được             | `HomeNearUnlockPanel`, `HomeRecentAchievementsPanel` | **Mới** (design mới theo §5)    |

**Nguyên tắc bắt buộc:** Mọi component reposition (A, B) — **tuyệt đối không** sửa className, markup nội bộ, token kích thước, màu, typography bên trong file component gốc. Chỉ được sửa **composition** (`home-view.tsx`, wrapper grid, `col-span`).

---

## 1. Bối cảnh & vấn đề

### 1.1. Hiện trạng layout

Thứ tự grid hiện tại (`home-view.tsx`):

| #   | Component             | `col-span` | Ghi chú                                    |
| --- | --------------------- | ---------- | ------------------------------------------ |
| 1   | `HomeHero`            | 2          | Header XP / streak                         |
| 2   | `HomePinnedNews`      | 2          | Ghim + 2 thẻ tin phụ **bên trong** section |
| 3   | `HomeWeekStrip`       | 2          | Lịch tuần                                  |
| 4   | `HomeCharacterCard`   | 1          | Nhân vật                                   |
| 5   | `HomeBadgeGrid`       | 1          | Tủ huy hiệu                                |
| 6   | `HomeMiniLeaderboard` | 1          | BXH mini                                   |
| 7   | `HomeCourseProgress`  | 1          | Môn + dự báo điểm                          |

**Vấn đề UX:**

1. **Hàng thành tích** (5–7): Tủ huy hiệu | BXH | Môn học — không cùng chủ đề.
2. **Nhân vật** tách rời khu thông báo dù có thể đặt cạnh 2 thẻ tin phụ.
3. **BXH mini** nằm hàng thành tích thay vì vị trí nổi bật hơn (chỗ Nhân vật cũ).

### 1.2. Mục tiêu

1. Cụm **thông báo + nhân vật** gắn kết hơn trên desktop.
2. **BXH mini** lên vị trí Nhân vật cũ — design giữ nguyên.
3. **Hàng thành tích** thống nhất: Tủ huy hiệu | Sắp mở khóa | Vừa đạt được.

---

## 2. Layout mục tiêu (desktop)

### 2.1. Wireframe tổng thể

```
┌─ HERO (full width) ─────────────────────────────────────────────┐
│ LV12 · Chào buổi sáng · XP · Hạng · Streak · Xem hướng dẫn      │
└─────────────────────────────────────────────────────────────────┘

┌─ THÔNG BÁO QUAN TRỌNG (col-span-2) ─────────────────────────────┐
│ [Pinned — Học bổng Rikkei Talent — full width]                   │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐  │
│ │ Workshop     │ │ Hướng dẫn    │ │ NHÂN VẬT CỦA BẠN        │  │
│ │ Sự kiện      │ │ Học vụ       │ │ (HomeCharacterCard)      │  │
│ │ 28/06        │ │ 27/06        │ │ design Y NGUYÊN          │  │
│ └──────────────┘ └──────────────┘ └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─ LỊCH TUẦN (full width) ────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────┘

┌─ BẢNG XẾP HẠNG MINI ────┐  (vị trí cũ của Nhân vật — 1 cột grid)
│ HomeMiniLeaderboard      │
│ design Y NGUYÊN          │
└──────────────────────────┘

┌─ TỦ HUY HIỆU ─┐ ┌─ SẮP MỞ KHÓA ─┐ ┌─ VỪA ĐẠT ĐƯỢC ─┐
│ (giữ)         │ │ (mới)          │ │ (mới)           │
└───────────────┘ └────────────────┘ └─────────────────┘
```

### 2.2. Quy tắc vị trí Nhân vật (§A)

| Rule | Mô tả                                                                                                                                                      |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1   | Nhân vật **cùng hàng** với 2 thẻ tin phụ (announcement cards) trong `HomePinnedNews`.                                                                      |
| L2   | **Chiều cao hàng:** Nhân vật **stretch** (`items-stretch` / `h-full`) để **cao bằng** hàng 2 thẻ tin — tức bằng chiều cao của 2 khối Workshop + Hướng dẫn. |
| L3   | **Chiều ngang card:** Giữ **width nội dung** y như `HomeCharacterCard` hiện tại — **không** scale font, avatar 88px, padding 22px, gradient, CTA.          |
| L4   | **Không** sửa file `home-character-card.tsx` — wrapper bên ngoài xử lý grid placement.                                                                     |
| L5   | Desktop: sub-grid 3 cột — `[tin 1][tin 2][nhân vật]` tỷ lệ `1fr 1fr minmax(280px, 320px)` (hoặc tương đương giữ card ~300px min).                          |
| L6   | Mobile (`max-[660px]`): stack dọc — ghim → tin 1 → tin 2 → nhân vật (full width).                                                                          |

### 2.3. Quy tắc vị trí BXH mini (§B)

| Rule | Mô tả                                                                                                                                     |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| L7   | `HomeMiniLeaderboard` đặt **sau** `HomeWeekStrip`, **trước** hàng thành tích — đúng **slot grid** mà `HomeCharacterCard` chiếm trước đây. |
| L8   | **Không** sửa file `home-mini-leaderboard.tsx`.                                                                                           |
| L9   | Giữ link **Xem đầy đủ →** `/leaderboard`.                                                                                                 |

### 2.4. Hàng thành tích (§C + §D)

- **Gỡ** `HomeCourseProgress` khỏi `home-view.tsx` (file component giữ lại).
- **Gỡ** `HomeMiniLeaderboard` khỏi hàng thành tích (đã chuyển §B).
- **Thêm** `HomeNearUnlockPanel` + `HomeRecentAchievementsPanel` cạnh `HomeBadgeGrid`.

---

## 3. Composition grid (`home-view.tsx`)

### 3.1. Thứ tự DOM sau redesign

| #   | Component                        | Grid                                     |
| --- | -------------------------------- | ---------------------------------------- |
| 1   | `HomeHero`                       | `col-span-2`                             |
| 2   | `HomePinnedNews` + slot Nhân vật | `col-span-2` (refactor wrapper — xem §4) |
| 3   | `HomeWeekStrip`                  | `col-span-2`                             |
| 4   | `HomeMiniLeaderboard`            | 1 cột (auto-fit)                         |
| 5   | `HomeBadgeGrid`                  | 1 cột                                    |
| 6   | `HomeNearUnlockPanel`            | 1 cột                                    |
| 7   | `HomeRecentAchievementsPanel`    | 1 cột                                    |

### 3.2. Grid container

Giữ `HOME_DASHBOARD.GRID_GAP_PX` và `GRID_MIN_COL_PX` như hiện tại trừ khi cần constant mới cho sub-grid thông báo.

---

## 4. Refactor khu vực Thông báo (§A — implement)

### 4.1. Cách tiếp cận (ưu tiên)

**Option 1 (khuyến nghị):** Tách wrapper `HomeAnnouncementsRow` hoặc mở rộng `HomePinnedNews`:

```tsx
// home-view.tsx (pseudo)
<HomePinnedNews
  newCount={...}
  pinned={...}
  announcements={...}
  characterSlot={<HomeCharacterCard character={data.character} />}
/>
```

- `HomePinnedNews`: phần header + pinned **giữ nguyên**.
- Hàng dưới: `grid grid-cols-1 md:grid-cols-[1fr_1fr_minmax(280px,320px)] gap-2.5 items-stretch`
    - Cột 1–2: map `announcements` (logic hiện tại, **không đổi** class từng thẻ).
    - Cột 3: `{characterSlot}` — render `HomeCharacterCard` **không wrapper style thêm** (chỉ `h-full` trên slot nếu cần stretch).

**Option 2:** Grid explicit trên `home-view` với subgrid — chỉ dùng nếu Option 1 khó; vẫn không sửa `HomeCharacterCard`.

### 4.2. Out of scope refactor

- Không đổi copy, icon, màu thẻ tin phụ.
- Không đổi pinned block.
- Không merge Nhân vật vào gradient card khác.

---

## 5. Khối mới — Sắp mở khóa & Vừa đạt được

_(Giữ nguyên spec chi tiết từ phiên bản trước)_

### 5.1. `HomeNearUnlockPanel`

- Tiêu đề: **Sắp mở khóa**
- Tối đa 3 huy hiệu locked gần đạt: icon, tên, hint, progress bar, `current/target`, CTA **Làm ngay →**
- Shell card trắng giống `HomeBadgeGrid`
- Empty state khi không có item

### 5.2. `HomeRecentAchievementsPanel`

- Tiêu đề: **Vừa đạt được**
- Tối đa 5 item timeline: kind icon, title, subtitle optional, timeAgo
- Empty state + CTA **Đi học ngay →** → `/courses`

### 5.3. Data model

```typescript
export interface HomeNearUnlockBadge {
    id: string;
    name: string;
    icon: string;
    hint: string;
    current: number;
    target: number;
    progressPercent: number;
    actionLabel: string;
    actionHref: string;
}

export interface HomeRecentAchievement {
    id: string;
    kind: "badge_unlock" | "xp_gain" | "streak" | "lesson_complete" | "quiz_pass";
    title: string;
    subtitle?: string;
    timeAgo: string;
    href?: string;
}
```

Mock seed: xem `src/mocks/home.mock.ts` — thêm `nearUnlock`, `recentAchievements` (ví dụ Streak 30 ngày, Speaking 8.0+, activity gần đây).

### 5.4. UI_TEXT keys mới

| Key                            | Giá trị                                                   |
| ------------------------------ | --------------------------------------------------------- |
| `nearUnlockTitle`              | `Sắp mở khóa`                                             |
| `nearUnlockViewAll`            | `Xem tất cả huy hiệu →`                                   |
| `nearUnlockActionDefault`      | `Làm ngay →`                                              |
| `nearUnlockEmptyTitle`         | `Bạn đã gần hoàn thành mọi huy hiệu hiện có!`             |
| `nearUnlockEmptyBody`          | `Tiếp tục học để mở thêm huy hiệu mới trong các mùa tới.` |
| `recentAchievementsTitle`      | `Vừa đạt được`                                            |
| `recentAchievementsEmptyTitle` | `Chưa có hoạt động gần đây`                               |
| `recentAchievementsEmptyBody`  | `Bắt đầu một bài học để ghi nhận thành tích!`             |
| `recentAchievementsEmptyCta`   | `Đi học ngay →`                                           |

---

## 6. User flows

### F1 — Desktop home

1. Hero → Thông báo (ghim + 3 cột: 2 tin + nhân vật) → Lịch tuần → BXH mini → 3 khối thành tích.

### F2 — BXH

| Hành động               | Đích           |
| ----------------------- | -------------- |
| Xem đầy đủ (mini board) | `/leaderboard` |
| Sidebar Xếp hạng        | `/leaderboard` |

### F3 — Nhân vật

| Hành động          | Đích                              |
| ------------------ | --------------------------------- |
| Khu nhân vật / CTA | `/avatar` (giữ như component gốc) |

### F4 — Thành tích

| Hành động                  | Đích              |
| -------------------------- | ----------------- |
| Làm ngay (near unlock)     | mock `actionHref` |
| Đi học ngay (empty recent) | `/courses`        |

### F5 — Môn học / dự báo (đã gỡ khỏi home)

| Nhu cầu     | Điều hướng                    |
| ----------- | ----------------------------- |
| Tiến độ môn | Sidebar → Khóa học / Lộ trình |

---

## 7. File thay đổi

| File                                                        | Hành động                                     |
| ----------------------------------------------------------- | --------------------------------------------- |
| `src/views/home-view.tsx`                                   | Composition mới §3                            |
| `src/components/ui/home/home-pinned-news.tsx`               | Thêm `characterSlot` prop + sub-grid hàng tin |
| `src/components/ui/home/home-character-card.tsx`            | **Không sửa**                                 |
| `src/components/ui/home/home-mini-leaderboard.tsx`          | **Không sửa**                                 |
| `src/components/ui/home/home-course-progress.tsx`           | **Không xóa** — gỡ khỏi home                  |
| `src/components/ui/home/home-near-unlock-panel.tsx`         | **Tạo mới**                                   |
| `src/components/ui/home/home-recent-achievements-panel.tsx` | **Tạo mới**                                   |
| `src/types/home.types.ts`                                   | Props `characterSlot`, types §5.3             |
| `src/mocks/home.mock.ts`                                    | `nearUnlock`, `recentAchievements`            |
| `src/hooks/use-home-dashboard.ts`                           | Pass-through                                  |
| `src/constants/home.constants.ts`                           | Sub-grid tokens nếu cần                       |
| `src/constants/ui-text.constants.ts`                        | Keys §5.4                                     |

---

## 8. Business rules

| ID  | Rule                                                                                                      |
| --- | --------------------------------------------------------------------------------------------------------- |
| R1  | Phase 1: mock only                                                                                        |
| R2  | **Reposition components:** không diff visual trong `home-character-card.tsx`, `home-mini-leaderboard.tsx` |
| R3  | Nhân vật `h-full` trên slot wrapper được phép; **không** đổi padding/radius/gradient bên trong card       |
| R4  | `nearUnlock` max 3, sort `progressPercent` desc                                                           |
| R5  | `recentAchievements` max 5                                                                                |
| R6  | `UI_TEXT` + `ROUTES` — không hardcode                                                                     |

---

## 9. Acceptance criteria

### Layout reposition

- [ ] Nhân vật nằm **cùng hàng** 2 thẻ tin phụ (desktop), cao bằng hàng đó.
- [ ] **Không** có thay đổi markup/style trong `home-character-card.tsx`.
- [ ] BXH mini ở **vị trí cũ của Nhân vật** (sau lịch tuần).
- [ ] **Không** có thay đổi markup/style trong `home-mini-leaderboard.tsx`.
- [ ] `HomeCourseProgress` **không** render trên home.

### Achievement row

- [ ] Hàng 3 khối: Tủ huy hiệu | Sắp mở khóa | Vừa đạt được.
- [ ] Near unlock + recent achievements có mock + empty states.

### Responsive

- [ ] Mobile: thông báo stack; nhân vật full width dưới 2 tin.
- [ ] Không vỡ layout grid.

### Quality

- [ ] `/leaderboard` vẫn hoạt động.
- [ ] type-check + lint pass.

---

## 10. Backlog

| ID    | Đề xuất                                        |
| ----- | ---------------------------------------------- |
| BL-01 | Widget tiến độ môn ở trang Khóa học / Lộ trình |
| BL-02 | API achievements + activity feed               |
| BL-03 | Trang `/badges` chi tiết                       |

---

## 11. Prompt implement

> Implement **UI-UPD-01** theo `docs/ui-implementation/ui-updates/SPEC-home-dashboard-redesign.md`.  
> (1) Đưa `HomeCharacterCard` lên hàng 2 thẻ tin trong `HomePinnedNews` qua slot — **không sửa** design card.  
> (2) `HomeMiniLeaderboard` thay slot Nhân vật cũ — **không sửa** design BXH.  
> (3) Gỡ `HomeCourseProgress`.  
> (4) Thêm `HomeNearUnlockPanel` + `HomeRecentAchievementsPanel`. Mock-only.

---

## 12. Tham chiếu

- Screenshot thông báo: ghim + 2 thẻ Workshop/Học vụ (2026-07-26).
- UX review: Phương án A hàng thành tích + reposition Nhân vật/BXH.
- Code: `src/views/home-view.tsx`, `src/components/ui/home/home-pinned-news.tsx`.
