# Data/Network Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dựng luồng dữ liệu `views → hooks (TanStack Query) → services → mocks` và migrate toàn bộ 12 view sang tiêu thụ hook, giữ nguyên mock trong file riêng làm nguồn dữ liệu.

**Architecture:** 4 lớp. `services` là seam duy nhất tới nguồn dữ liệu (hôm nay đọc mock qua helper delay giả lập, sau này đổi sang API). `hooks` bọc `useQuery` với query-key factory tập trung. Views lấy `{ data, isLoading, isError, refetch }` và render loading/error qua một component dùng chung. Không xoá/sửa mock.

**Tech Stack:** Next.js 16 App Router, React 19, @tanstack/react-query (đã cài, chưa dùng), @tanstack/react-query-devtools, TypeScript strict.

**Spec:** [docs/superpowers/specs/2026-08-24-data-layer-design.md](../specs/2026-08-24-data-layer-design.md)

## Global Constraints

- **Không xoá, không sửa nội dung** bất kỳ file nào trong `src/mocks/`. Services import từ đó.
- **Giữ nguyên toàn bộ JSX/UI** hiện có của mỗi view (vùng đóng băng thiết kế — chỉ đổi nguồn dữ liệu + thêm loading/error, KHÔNG redesign layout/style).
- Message commit theo **Conventional Commits, mô tả tiếng Việt**. Husky `commit-msg` (commitlint) đang active → message sai chuẩn bị chặn.
- `pnpm` không có global trong PATH: mọi lệnh `pnpm`/`git commit` cần `export PATH="$HOME/.pnpm-shim:$PATH"` trước (cwd trong project). Không dùng `git commit --no-verify`.
- **Eslint rules nghiêm** (`eslint.config.mjs`): cấm magic string/number (đặt hằng số có tên), cấm định nghĩa `type`/`interface`/`enum` ngoài `src/types`, cấm text tiếng Việt ngoài `UI_TEXT` (`src/constants/ui-text.constants.ts`), ép kebab-case tên file trong views/components/hooks/services. Chạy `pnpm run lint:check` trước mỗi commit; sửa cho sạch (`--max-warnings=0`).
- **Boundaries** (đã khai trong eslint): hướng import cho phép là `views→{hooks,services,...}`, `hooks→{services,...,mocks}`, `services→{mocks,constants,config,utils}`. KHÔNG để service import ngược hook/view; KHÔNG để view import trực tiếp `@/mocks` sau khi migrate.
- Types tái dùng từ `src/types/*.types.ts` (đã có: `PracticeItem`/`TopicItem` ← `practice.types`, `ExamSessionInfo`/`QuestionItem`/`ExamResultSummary` ← `exam.types`, `InterviewPosition`/`InterviewEvaluationResult` ← `interview.types`, `UserProfile`/`LeaderboardRankItem` ← `user.types`). Không tạo type mới ngoài `src/types`.
- Đang ở nhánh `develop` (nhánh làm việc). Base khi bắt đầu: commit `480c681` (spec doc).

---

### Task 1: Hạ tầng TanStack Query (config, keys, delay helper, provider, wire layout)

**Files:**
- Create: `src/services/mock-delay.ts`
- Create: `src/config/query-client.ts`
- Create: `src/config/query-keys.ts`
- Create: `src/app/providers.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `@tanstack/react-query`, `@tanstack/react-query-devtools` (đã trong package.json).
- Produces: `makeQueryClient()` (dùng bởi providers), `queryKeys` factory (dùng bởi mọi hook Task 3), `simulateLatency<T>(data)` (dùng bởi mọi service Task 2), `<Providers>` (bọc app).

- [ ] **Step 1: Tạo `src/services/mock-delay.ts`**

```ts
/**
 * Độ trễ giả lập cho tầng service khi chưa có API thật.
 * Đây là chỗ DUY NHẤT tạo độ trễ giả — khi nối API thật, service không dùng helper này nữa.
 */
const MOCK_LATENCY_MS = 400;

export function simulateLatency<T>(data: T): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), MOCK_LATENCY_MS);
    });
}
```

- [ ] **Step 2: Tạo `src/config/query-client.ts`**

```ts
import { QueryClient } from "@tanstack/react-query";

const DEFAULT_STALE_TIME_MS = 60_000;
const DEFAULT_QUERY_RETRY = 1;

export function makeQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: DEFAULT_STALE_TIME_MS,
                retry: DEFAULT_QUERY_RETRY,
                refetchOnWindowFocus: false,
            },
        },
    });
}
```

- [ ] **Step 3: Tạo `src/config/query-keys.ts`**

```ts
export const queryKeys = {
    practice: {
        list: ["practice", "list"] as const,
        detail: (id: string) => ["practice", "detail", id] as const,
    },
    topic: {
        list: ["topic", "list"] as const,
        detail: (id: string) => ["topic", "detail", id] as const,
    },
    exam: {
        session: ["exam", "session"] as const,
        questions: ["exam", "questions"] as const,
        result: ["exam", "result"] as const,
    },
    interview: {
        positions: ["interview", "positions"] as const,
        result: ["interview", "result"] as const,
    },
    user: {
        profile: ["user", "profile"] as const,
        leaderboard: ["user", "leaderboard"] as const,
    },
} as const;
```

- [ ] **Step 4: Tạo `src/app/providers.tsx`**

```tsx
"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { makeQueryClient } from "@/config/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => makeQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
```

- [ ] **Step 5: Wire `<Providers>` vào `src/app/layout.tsx`**

Trong `src/app/layout.tsx`, import `Providers` và bọc `{children}` (giữ nguyên `<Toaster />` và mọi thứ khác). Phần `<body>` đổi từ:

```tsx
            <body className={cx(primaryFont.variable, primaryFont.className, "min-h-screen bg-cream antialiased")}>
                {children}
                <Toaster />
            </body>
```

thành:

```tsx
            <body className={cx(primaryFont.variable, primaryFont.className, "min-h-screen bg-cream antialiased")}>
                <Providers>{children}</Providers>
                <Toaster />
            </body>
```

Thêm dòng import (theo thứ tự import mà prettier-plugin-sort-imports yêu cầu — third-party/`@/` trước relative): `import { Providers } from "./providers";`

- [ ] **Step 6: Verify build + lint + type-check**

Run: `cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check && pnpm run build`
Expected: cả 3 exit 0. `build` compile thành công (QueryClientProvider là client component nên không phá SSR).

- [ ] **Step 7: Commit**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && git add src/services/mock-delay.ts src/config/ src/app/providers.tsx src/app/layout.tsx && git commit -m "feat(data): dựng hạ tầng TanStack Query (provider, query client, query keys, mock delay)"
```

---

### Task 2: Services cho 4 domain

**Files:**
- Create: `src/services/practice.service.ts`
- Create: `src/services/exam.service.ts`
- Create: `src/services/interview.service.ts`
- Create: `src/services/user.service.ts`

**Interfaces:**
- Consumes: `simulateLatency` (Task 1), mock exports từ `src/mocks/*`, types từ `src/types/*`.
- Produces: các hàm async service dùng bởi hooks (Task 3): `getPracticeList/getPracticeById/getTopicsList/getTopicById`, `getExamSession/getExamQuestions/getExamResult`, `getInterviewPositions/getInterviewResult`, `getUserProfile/getLeaderboard`.

- [ ] **Step 1: Tạo `src/services/practice.service.ts`** (đây là mẫu chuẩn — 3 file còn lại theo đúng pattern này)

```ts
import { MOCK_PRACTICE_LIST, MOCK_TOPICS_LIST } from "@/mocks/practice.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { PracticeItem, TopicItem } from "@/types/practice.types";

export function getPracticeList(): Promise<PracticeItem[]> {
    return simulateLatency(MOCK_PRACTICE_LIST);
}

export function getPracticeById(id: string): Promise<PracticeItem | undefined> {
    return simulateLatency(MOCK_PRACTICE_LIST.find((item) => item.id === id));
}

export function getTopicsList(): Promise<TopicItem[]> {
    return simulateLatency(MOCK_TOPICS_LIST);
}

export function getTopicById(id: string): Promise<TopicItem | undefined> {
    return simulateLatency(MOCK_TOPICS_LIST.find((item) => item.id === id));
}
```

- [ ] **Step 2: Tạo `src/services/exam.service.ts`**

```ts
import { MOCK_EXAM_QUESTIONS, MOCK_EXAM_RESULT, MOCK_EXAM_SESSION } from "@/mocks/exam.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { ExamResultSummary, ExamSessionInfo, QuestionItem } from "@/types/exam.types";

export function getExamSession(): Promise<ExamSessionInfo> {
    return simulateLatency(MOCK_EXAM_SESSION);
}

export function getExamQuestions(): Promise<QuestionItem[]> {
    return simulateLatency(MOCK_EXAM_QUESTIONS);
}

export function getExamResult(): Promise<ExamResultSummary> {
    return simulateLatency(MOCK_EXAM_RESULT);
}
```

- [ ] **Step 3: Tạo `src/services/interview.service.ts`**

```ts
import { MOCK_INTERVIEW_POSITIONS, MOCK_INTERVIEW_RESULT } from "@/mocks/interview.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { InterviewEvaluationResult, InterviewPosition } from "@/types/interview.types";

export function getInterviewPositions(): Promise<InterviewPosition[]> {
    return simulateLatency(MOCK_INTERVIEW_POSITIONS);
}

export function getInterviewResult(): Promise<InterviewEvaluationResult> {
    return simulateLatency(MOCK_INTERVIEW_RESULT);
}
```

- [ ] **Step 4: Tạo `src/services/user.service.ts`**

```ts
import { MOCK_LEADERBOARD, MOCK_USER_PROFILE } from "@/mocks/user.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { LeaderboardRankItem, UserProfile } from "@/types/user.types";

export function getUserProfile(): Promise<UserProfile> {
    return simulateLatency(MOCK_USER_PROFILE);
}

export function getLeaderboard(): Promise<LeaderboardRankItem[]> {
    return simulateLatency(MOCK_LEADERBOARD);
}
```

- [ ] **Step 5: Verify + commit**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check
```
Expected: exit 0 (nếu eslint báo magic-string/type ở service, sửa cho hợp rule trước khi commit). Rồi:
```bash
git add src/services/practice.service.ts src/services/exam.service.ts src/services/interview.service.ts src/services/user.service.ts && git commit -m "feat(data): thêm service đọc mock cho practice, exam, interview, user"
```

---

### Task 3: Hooks TanStack Query cho 4 domain

**Files:**
- Create: `src/hooks/queries/use-practice.ts`
- Create: `src/hooks/queries/use-exam.ts`
- Create: `src/hooks/queries/use-interview.ts`
- Create: `src/hooks/queries/use-user.ts`

**Interfaces:**
- Consumes: services (Task 2), `queryKeys` (Task 1), `useQuery`.
- Produces: hooks dùng bởi views (Task 5-7): `usePracticeList/usePracticeDetail(id)/useTopicsList/useTopicDetail(id)`, `useExamSession/useExamQuestions/useExamResult`, `useInterviewPositions/useInterviewResult`, `useUserProfile/useLeaderboard`.

- [ ] **Step 1: Tạo `src/hooks/queries/use-practice.ts`** (mẫu chuẩn — các file còn lại theo pattern này)

```ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getPracticeById, getPracticeList, getTopicById, getTopicsList } from "@/services/practice.service";

export function usePracticeList() {
    return useQuery({ queryKey: queryKeys.practice.list, queryFn: getPracticeList });
}

export function usePracticeDetail(id: string) {
    return useQuery({ queryKey: queryKeys.practice.detail(id), queryFn: () => getPracticeById(id) });
}

export function useTopicsList() {
    return useQuery({ queryKey: queryKeys.topic.list, queryFn: getTopicsList });
}

export function useTopicDetail(id: string) {
    return useQuery({ queryKey: queryKeys.topic.detail(id), queryFn: () => getTopicById(id) });
}
```

- [ ] **Step 2: Tạo `src/hooks/queries/use-exam.ts`**

```ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getExamQuestions, getExamResult, getExamSession } from "@/services/exam.service";

export function useExamSession() {
    return useQuery({ queryKey: queryKeys.exam.session, queryFn: getExamSession });
}

export function useExamQuestions() {
    return useQuery({ queryKey: queryKeys.exam.questions, queryFn: getExamQuestions });
}

export function useExamResult() {
    return useQuery({ queryKey: queryKeys.exam.result, queryFn: getExamResult });
}
```

- [ ] **Step 3: Tạo `src/hooks/queries/use-interview.ts`**

```ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getInterviewPositions, getInterviewResult } from "@/services/interview.service";

export function useInterviewPositions() {
    return useQuery({ queryKey: queryKeys.interview.positions, queryFn: getInterviewPositions });
}

export function useInterviewResult() {
    return useQuery({ queryKey: queryKeys.interview.result, queryFn: getInterviewResult });
}
```

- [ ] **Step 4: Tạo `src/hooks/queries/use-user.ts`**

```ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getLeaderboard, getUserProfile } from "@/services/user.service";

export function useUserProfile() {
    return useQuery({ queryKey: queryKeys.user.profile, queryFn: getUserProfile });
}

export function useLeaderboard() {
    return useQuery({ queryKey: queryKeys.user.leaderboard, queryFn: getLeaderboard });
}
```

- [ ] **Step 5: Verify + commit**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check
```
Expected: exit 0. Rồi:
```bash
git add src/hooks/queries/ && git commit -m "feat(data): thêm hook useQuery cho practice, exam, interview, user"
```

---

### Task 4: Component loading/error dùng chung

**Files:**
- Create: `src/components/shared/query-state.tsx`
- Modify (nếu cần khoá text mới): `src/constants/ui-text.constants.ts`

**Interfaces:**
- Consumes: `UI_TEXT` (đã có `common.loading`, `common.genericError`, `common.noData`).
- Produces: một component/helper để views (Task 5-7) render loading + error nhất quán, ví dụ `<QueryStateBoundary isLoading isError onRetry>...`.

- [ ] **Step 1: Xem khoá UI_TEXT sẵn có**

`src/constants/ui-text.constants.ts` `common` đã có: `loading: "Đang tải..."`, `genericError: "Đã xảy ra lỗi. Vui lòng thử lại."`, `noData: "Không có dữ liệu"`. Nếu cần nhãn nút "Thử lại" riêng, thêm khoá `retry: "Thử lại"` vào `common` (đặt cạnh `close`/`noData`). KHÔNG hardcode text tiếng Việt trong component.

- [ ] **Step 2: Tạo `src/components/shared/query-state.tsx`**

Một component nhận `isLoading`, `isError`, `onRetry?`, `children` và render:
- khi `isLoading`: một khối loading nhẹ (spinner dùng `Loader2` từ `lucide-react` với `animate-spin`, kèm `UI_TEXT.common.loading`).
- khi `isError`: `UI_TEXT.common.genericError` + nút "Thử lại" (dùng `Button` từ `@/components/ui/button`) gọi `onRetry`.
- ngược lại: `children`.

Ví dụ khung (implementer hoàn thiện, giữ style tối giản, dùng token màu/lớp Tailwind theo pattern hiện có trong `src/components/ui`):

```tsx
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/constants/ui-text.constants";

interface QueryStateBoundaryProps {
    isLoading: boolean;
    isError: boolean;
    onRetry?: () => void;
    children: React.ReactNode;
}

export function QueryStateBoundary({ isLoading, isError, onRetry, children }: QueryStateBoundaryProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{UI_TEXT.common.loading}</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-600">
                <p>{UI_TEXT.common.genericError}</p>
                {onRetry ? (
                    <Button variant="outline" size="sm" onClick={onRetry}>
                        {UI_TEXT.common.retry}
                    </Button>
                ) : null}
            </div>
        );
    }

    return <>{children}</>;
}
```

(Lưu ý: `interface QueryStateBoundaryProps` là props cục bộ của component — eslint dự án cấm định nghĩa type NGOÀI `src/types` khi ở views/components. Nếu `lint:check` báo lỗi, chuyển interface props này sang `src/types` — ví dụ thêm vào một file type phù hợp — hoặc kiểm tra rule cho phép props inline. Ưu tiên tuân rule: nếu bị chặn, khai type ở `src/types` rồi import vào.)

- [ ] **Step 3: Verify + commit**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check
```
Expected: exit 0. Rồi:
```bash
git add src/components/shared/ src/constants/ui-text.constants.ts && git commit -m "feat(data): thêm component loading/error dùng chung cho query"
```

---

### Task 5: Migrate view domain practice/topics (4 view)

**Files (Modify):**
- `src/views/practice/practice-list-view.tsx` — dùng `usePracticeList`
- `src/views/practice/practice-detail-view.tsx` — dùng `usePracticeDetail(practiceId)`
- `src/views/topics/topics-view.tsx` — dùng `useTopicsList`
- `src/views/topics/topic-detail-view.tsx` — dùng `useTopicDetail(topicId)`

**Interfaces:**
- Consumes: hooks (Task 3), `QueryStateBoundary` (Task 4).
- Produces: 4 view không còn import `@/mocks`.

**Pattern áp dụng cho mỗi view (giữ NGUYÊN toàn bộ JSX/UI hiện có, chỉ đổi nguồn dữ liệu + bọc loading/error):**
1. Xóa dòng `import { MOCK_... } from "@/mocks/...";`, thêm import hook tương ứng + `QueryStateBoundary`.
2. Thay `const x = MOCK_...` (list view) bằng `const { data, isLoading, isError, refetch } = useXxx();` rồi dùng `data ?? []` (list) cho phần render hiện tại.
3. View by-id (`practice-detail`, `topic-detail`): thay `const item = MOCK_LIST.find(...) || MOCK_LIST[0]!` bằng `const { data: item, isLoading, isError, refetch } = useXxxDetail(id);`. Khi không loading/error mà `item` undefined → render not-found (dùng `UI_TEXT.common.noData`). BỎ hành vi fallback `|| list[0]` cũ (theo ruling spec #2).
4. Bọc phần thân chính (phần hiện dùng data) bằng `<QueryStateBoundary isLoading={isLoading} isError={isError} onRetry={refetch}>...</QueryStateBoundary>`. Phần header tĩnh (không phụ thuộc data) có thể để ngoài boundary để vẫn hiện khi loading — tùy view, giữ hợp lý.

- [ ] **Step 1: Đọc + migrate `practice-list-view.tsx`**

Hiện: `const practices = MOCK_PRACTICE_LIST;` rồi `practices.filter(...)`. Đổi thành `const { data, isLoading, isError, refetch } = usePracticeList();` và dùng `const practices = data ?? [];`. Bọc grid kết quả bằng `QueryStateBoundary`. Giữ nguyên ô search + toàn bộ JSX card.

- [ ] **Step 2: Đọc + migrate `practice-detail-view.tsx`**

Signature `PracticeDetailView({ practiceId }: { practiceId: string })`. Đổi `const practice = MOCK_PRACTICE_LIST.find(...) || MOCK_PRACTICE_LIST[0]!` thành `usePracticeDetail(practiceId)`. Xử lý `item` undefined → not-found. Bọc thân card bằng boundary.

- [ ] **Step 3: Đọc + migrate `topics-view.tsx`** — `useTopicsList`, `data ?? []`.

- [ ] **Step 4: Đọc + migrate `topic-detail-view.tsx`** — `TopicDetailView({ topicId })` → `useTopicDetail(topicId)`, not-found khi undefined.

- [ ] **Step 5: Verify không còn mock import + build**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && grep -rn "@/mocks" src/views/practice src/views/topics; echo "grep exit: $?"; pnpm run type-check && pnpm run lint:check && pnpm run build
```
Expected: grep KHÔNG in dòng nào (exit 1 = không tìm thấy = tốt); type-check/lint:check/build exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/views/practice/ src/views/topics/ && git commit -m "refactor(data): migrate view practice và topics sang dùng hook query"
```

---

### Task 6: Migrate view domain exam (4 view)

**Files (Modify):**
- `src/views/exam/exam-result-detail-view.tsx` — `useExamResult`
- `src/views/exam/exam-taking-view.tsx` — `useExamSession` + `useExamQuestions`
- `src/views/exam/verify-ticket-view.tsx` — `useExamSession` + `useUserProfile`
- `src/views/practice/practice-exam-public-view.tsx` — `useExamQuestions`

**Interfaces:**
- Consumes: hooks `useExamSession/useExamQuestions/useExamResult` (Task 3), `useUserProfile` (Task 3), `QueryStateBoundary` (Task 4).
- Produces: 4 view không còn import `@/mocks`.

Áp dụng đúng pattern ở Task 5 (giữ nguyên JSX/UI). View dùng nhiều hook (`exam-taking`, `verify-ticket`): gộp trạng thái — `isLoading = a.isLoading || b.isLoading`, `isError = a.isError || b.isError`, `onRetry` gọi cả hai `refetch`. Với các object đơn (session/result/profile) undefined khi chưa có data → để boundary che (không render thân khi loading).

- [ ] **Step 1: Đọc + migrate `exam-result-detail-view.tsx`** — `useExamResult`, bọc thân bằng boundary.
- [ ] **Step 2: Đọc + migrate `exam-taking-view.tsx`** — 2 hook (`useExamSession`, `useExamQuestions`); gộp loading/error; dùng `questions ?? []`.
- [ ] **Step 3: Đọc + migrate `verify-ticket-view.tsx`** — `useExamSession` + `useUserProfile`; gộp loading/error.
- [ ] **Step 4: Đọc + migrate `practice-exam-public-view.tsx`** — `useExamQuestions`, `data ?? []`.

- [ ] **Step 5: Verify + commit**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && grep -rn "@/mocks" src/views/exam src/views/practice/practice-exam-public-view.tsx; echo "grep exit: $?"; pnpm run type-check && pnpm run lint:check && pnpm run build
```
Expected: grep không in dòng nào; 3 lệnh còn lại exit 0. Rồi:
```bash
git add src/views/exam/ src/views/practice/practice-exam-public-view.tsx && git commit -m "refactor(data): migrate view exam sang dùng hook query"
```

---

### Task 7: Migrate view domain interview + user (4 view)

**Files (Modify):**
- `src/views/interview/interview-list-view.tsx` — `useInterviewPositions`
- `src/views/interview/interview-result-view.tsx` — `useInterviewResult`
- `src/views/profile/profile-view.tsx` — `useUserProfile`
- `src/views/ranking/ranking-view.tsx` — `useLeaderboard`

**Interfaces:**
- Consumes: hooks `useInterviewPositions/useInterviewResult/useUserProfile/useLeaderboard` (Task 3), `QueryStateBoundary` (Task 4).
- Produces: 4 view không còn import `@/mocks`. Sau task này, `grep -rn "@/mocks" src/views` toàn cục phải rỗng.

Áp dụng pattern Task 5.

- [ ] **Step 1: Đọc + migrate `interview-list-view.tsx`** — `useInterviewPositions`, `data ?? []`.
- [ ] **Step 2: Đọc + migrate `interview-result-view.tsx`** — `useInterviewResult`, boundary che khi loading.
- [ ] **Step 3: Đọc + migrate `profile-view.tsx`** — `useUserProfile`, boundary che khi loading.
- [ ] **Step 4: Đọc + migrate `ranking-view.tsx`** — `useLeaderboard`, `data ?? []`.

- [ ] **Step 5: Verify TOÀN CỤC + commit**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && grep -rn "@/mocks" src/views; echo "grep exit: $?"; pnpm run type-check && pnpm run lint:check && pnpm run build
```
Expected: grep KHÔNG in dòng nào trên TOÀN BỘ `src/views` (mọi view đã migrate); 3 lệnh exit 0. Rồi:
```bash
git add src/views/interview/ src/views/profile/ src/views/ranking/ && git commit -m "refactor(data): migrate view interview và user sang dùng hook query"
```

---

### Task 8: Xác minh cuối + kiểm tra trình duyệt

**Files:** không sửa file — task xác minh.

**Interfaces:**
- Consumes: toàn bộ deliverable Task 1-7.
- Produces: bằng chứng sub-project #2 hoàn tất.

- [ ] **Step 1: Xác minh tĩnh toàn cục**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && export PATH="$HOME/.pnpm-shim:$PATH" && pnpm run type-check && pnpm run lint:check && pnpm run build && echo "=== còn mock import trong views? ===" && grep -rn "@/mocks" src/views; echo "grep exit (1=sạch): $?"
```
Expected: type-check/lint:check/build exit 0; grep không in dòng nào (views không còn import mock trực tiếp). `src/mocks/*` vẫn còn nguyên (services import).

- [ ] **Step 2: Xác minh mock KHÔNG bị sửa**

```bash
cd "D:/Rikkei Education/lms-assessly-fe" && git diff --stat 480c681 HEAD -- src/mocks/
```
Expected: KHÔNG có output (không file mock nào thay đổi so với đầu sub-project #2).

- [ ] **Step 3: Kiểm tra trình duyệt (thủ công, dùng preview_start hoặc dev server)**

Chạy `pnpm run dev`, mở vài route đại diện và xác nhận:
- `/practice` — thoáng loading ~400ms rồi hiện danh sách; ô search vẫn lọc.
- `/practice/practice-01` — hiện chi tiết; thử id sai (vd `/practice/khong-ton-tai`) → hiện not-found (`UI_TEXT.common.noData`), KHÔNG hiện item đầu.
- `/ranking`, `/profile` — loading rồi ra data.
Ghi lại kết quả quan sát vào report (không cần screenshot bắt buộc, mô tả là đủ).

## Ghi chú carry-forward (không thuộc plan này)

- Khi nối API thật (sub-project #3): chỉ đổi thân các hàm trong `src/services/*.service.ts` từ `simulateLatency(MOCK_...)` sang gọi `httpClient` + endpoint; xóa `mock-delay.ts` và `src/mocks/*` nếu muốn. Hooks + views KHÔNG đổi.
- Mutation (submit bài thi...) sẽ thêm dạng `useMutation` theo cùng pattern khi có luồng ghi.
