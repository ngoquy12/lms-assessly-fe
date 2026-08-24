# Thiết kế: Data/Network Layer (Sub-project #2)

- **Ngày**: 2026-08-24
- **Trạng thái**: Approved — chờ implementation plan
- **Roadmap**: sub-project #2/6 của "Refactor & tối ưu quy trình phát triển". Sub-project #1 (git workflow) đã hoàn tất.

## Bối cảnh

`lms-assessly-fe` hiện là UI prototype: 12 view import trực tiếp mock array từ `src/mocks/*.mock.ts` và dùng đồng bộ (ví dụ `const practices = MOCK_PRACTICE_LIST` hoặc `MOCK_PRACTICE_LIST.find(...)`). `@tanstack/react-query` đã cài trong `package.json` nhưng **chưa dùng ở đâu** (không có `QueryClientProvider`, không `useQuery`). `src/lib` chỉ có `cn()`. Chưa có `src/services`, `src/hooks`, `src/config` (dù eslint boundaries đã khai sẵn 3 thư mục này).

**Ràng buộc cứng của người dùng:** chưa có API thật, nên **giữ nguyên mock data trong file riêng** (`src/mocks/*.mock.ts`) để app chạy được. Chỉ bọc một lớp data-fetching quanh mock, sao cho khi có API thật chỉ cần đổi thân service mà không sửa hook/view.

## Mục tiêu

1. Dựng luồng dữ liệu 4 lớp `views → hooks (TanStack Query) → services → mocks`, đúng layering mà `eslint.config.mjs` boundaries đã định sẵn.
2. `services` là điểm nối (seam) duy nhất tới nguồn dữ liệu — đổi API sau này chỉ sửa service.
3. Migrate toàn bộ 12 view sang tiêu thụ hook thay vì import mock trực tiếp; mỗi view có loading/error/empty state nhất quán.
4. Không xoá, không sửa nội dung `src/mocks/*` (services import từ đó).

## Ngoài phạm vi

- Gọi API thật, biến môi trường API URL, interceptor auth (→ sub-project #3). Service hôm nay chỉ đọc mock.
- Mutation/ghi dữ liệu (submit bài thi...) — hiện chưa có luồng ghi; chỉ làm read (`useQuery`). Nếu sau này cần `useMutation` sẽ mở rộng theo cùng pattern.
- Test tự động (→ sub-project #4). Services viết dạng hàm thuần để sau unit-test được.
- Các deferred từ #1 (build-arg mismatch, README) — không thuộc đợt này.

## Kiến trúc

```
views/components  →  hooks (useQuery)  →  services (async, đọc mock qua simulateLatency)  →  mocks
                                                    └─(sub-project #3)→ httpClient → API thật
```

### Bản đồ dữ liệu hiện có (9 mock export / 4 domain)

| Domain | Mock export | Kiểu | View tiêu thụ |
|---|---|---|---|
| practice | `MOCK_PRACTICE_LIST` | `PracticeItem[]` | practice-list, practice-detail(by id) |
| practice | `MOCK_TOPICS_LIST` | `TopicItem[]` | topics, topic-detail(by id) |
| exam | `MOCK_EXAM_SESSION` | `ExamSessionInfo` | exam-taking, verify-ticket |
| exam | `MOCK_EXAM_QUESTIONS` | `QuestionItem[]` | exam-taking, practice-exam-public |
| exam | `MOCK_EXAM_RESULT` | `ExamResultSummary` | exam-result-detail |
| interview | `MOCK_INTERVIEW_POSITIONS` | `InterviewPosition[]` | interview-list |
| interview | `MOCK_INTERVIEW_RESULT` | `InterviewEvaluationResult` | interview-result |
| user | `MOCK_USER_PROFILE` | `UserProfile` | profile, verify-ticket |
| user | `MOCK_LEADERBOARD` | `LeaderboardRankItem[]` | ranking |

## Thành phần

### 1. Hạ tầng

- **`src/config/query-client.ts`** — factory `makeQueryClient()` trả `QueryClient` với default options: `staleTime` hợp lý (vd 60_000), `retry: 1`, `refetchOnWindowFocus: false`. Không hardcode magic number rải rác — đặt các giá trị này thành hằng số có tên trong file config.
- **`src/config/query-keys.ts`** — query-key factory tập trung, ví dụ `queryKeys.practice.list`, `queryKeys.practice.detail(id)`, `queryKeys.exam.session`, v.v. Key là identifier tiếng Anh (không dính rule cấm text tiếng Việt).
- **`src/app/providers.tsx`** — `"use client"` component tạo `QueryClient` qua `useState(() => makeQueryClient())` (pattern chuẩn Next App Router, tránh share client giữa request), bọc `<QueryClientProvider>`, kèm `<ReactQueryDevtools initialIsOpen={false} />` (chỉ load ở dev). Root `src/app/layout.tsx` render `<Providers>{children}</Providers>` bao quanh `{children}` (giữ `<Toaster />` như cũ).
- **`src/services/mock-delay.ts`** — helper `simulateLatency<T>(data: T): Promise<T>` resolve sau một delay nhỏ, có tên hằng số tập trung (`MOCK_LATENCY_MS = 400`). Đây là chỗ duy nhất tạo độ trễ giả; khi có API thật thì service không dùng helper này nữa.

### 2. Services (4 file, `src/services/*.service.ts`)

Mỗi hàm async trả dữ liệu domain qua `simulateLatency`. Chữ ký:

- **`practice.service.ts`**: `getPracticeList()`, `getPracticeById(id: string)` (trả `PracticeItem | undefined` — encapsulate `.find`), `getTopicsList()`, `getTopicById(id: string)` (`TopicItem | undefined`).
- **`exam.service.ts`**: `getExamSession()`, `getExamQuestions()`, `getExamResult()`.
- **`interview.service.ts`**: `getInterviewPositions()`, `getInterviewResult()`.
- **`user.service.ts`**: `getUserProfile()`, `getLeaderboard()`.

Kiểu trả về tái dùng type sẵn có trong `src/types/*` — không định nghĩa type mới ngoài `src/types` (tuân rule eslint).

### 3. Hooks (`src/hooks/queries/use-*.ts`)

Mỗi hook bọc `useQuery` với `queryKey` từ factory và `queryFn` là service tương ứng:
- practice: `usePracticeList`, `usePracticeDetail(id)`, `useTopicsList`, `useTopicDetail(id)`.
- exam: `useExamSession`, `useExamQuestions`, `useExamResult`.
- interview: `useInterviewPositions`, `useInterviewResult`.
- user: `useUserProfile`, `useLeaderboard`.

Hook by-id (`usePracticeDetail`, `useTopicDetail`) nhận `id`, đưa vào query key và service.

### 4. Component loading/error dùng chung

- **`src/components/shared/query-state.tsx`** (hoặc vị trí phù hợp trong `src/components`): một cách nhất quán để render loading (spinner/skeleton nhẹ) và error (thông báo + nút "Thử lại" gọi `refetch`). Text tiếng Việt phải qua `UI_TEXT` (rule eslint) — thêm khoá mới vào `src/constants/ui-text.constants.ts` nếu cần (vd `UI_TEXT.common.loading`, `UI_TEXT.common.errorRetry`).

### 5. Migrate 12 view

Thay `import { MOCK_... }` + dùng trực tiếp bằng: gọi hook tương ứng, lấy `{ data, isLoading, isError, refetch }`, render loading/error qua component chung, dùng `data` cho phần chính. Giữ nguyên toàn bộ JSX/UI hiện có (rule vùng đóng băng: không redesign).

## Quyết định thiết kế (rulings)

1. **Delay giả lập 400ms**, hằng số tập trung `MOCK_LATENCY_MS` trong `mock-delay.ts`.
2. **View by-id trả not-found thay vì fallback item[0]**: hiện `practice-detail`/`topic-detail` làm `list.find(...) || list[0]!` (nếu không thấy thì hiện phần tử đầu — hành vi hack). Chuyển sang: service trả `undefined` khi không thấy, view render empty/not-found state. Đây là hành vi đúng mà API thật sẽ có. Chấp nhận thay đổi nhỏ về hành vi edge-case này.
3. **Chỉ read (`useQuery`)**, chưa có mutation.
4. **Không xoá mock**; services là consumer của mock.
5. **httpClient chưa dựng đợt này** (YAGNI) — service là seam đủ rõ; http client + base URL thuộc sub-project #3 khi nối API thật.

## Xác minh (chưa có test framework)

- `pnpm run type-check`, `pnpm run lint:check`, `pnpm run build` đều sạch.
- Chạy `pnpm run dev` và kiểm tra trình duyệt vài view đại diện (practice-list, practice-detail, ranking, profile): loading hiện ra ~400ms rồi ra data; by-id với id sai hiện not-found.
- Không còn `import ... from "@/mocks"` trong `src/views` (chuyển hết về services): `grep -rn "@/mocks" src/views` → rỗng.

## Rủi ro

- **Eslint rules nghiêm** (cấm magic string, cấm type ngoài `src/types`, cấm text tiếng Việt ngoài `UI_TEXT`): chạy `lint:check` liên tục; đặt số/chuỗi thành hằng số có tên, text qua `UI_TEXT`.
- **Boundaries**: đảm bảo hướng import đúng (`views→hooks→services→mocks`); không để service import ngược hook/view.
- **Next App Router + QueryClient**: dùng đúng pattern `useState(() => makeQueryClient())` trong client component, không tạo client ở module scope (tránh rò rỉ state giữa request khi SSR).
