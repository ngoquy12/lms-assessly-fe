# Shared Assessment Mock Seed

`assessment-seed.json` là **nguồn sự thật duy nhất (canonical)** cho dữ liệu mock
được chia sẻ giữa hai hệ thống:

- **LMS-AI-QLDT** (`src/mocks/shared/assessment-seed.json`) — phía admin khảo thí.
- **lms-assessly-fe** (`src/mocks/shared/assessment-seed.json`) — phía thí sinh.

Hai bản file này phải **giống hệt nhau (byte-for-byte)**. Mỗi repo đọc seed rồi
map sang type riêng ở tầng mock (`src/mocks/*.mock.ts`), nhờ đó dữ liệu hiển thị
ở hai app **khớp 100%** (cùng thí sinh, cùng đề/ca thi, cùng câu hỏi, cùng kết quả).

## Nội dung seed (kịch bản demo) — v2 bao phủ TOÀN BỘ module khảo thí

**Key gốc (top-level)** — dữ liệu dùng chung, khớp giữa 2 hệ thống:

- `candidates` — 5 thí sinh (demo login = `meta.demoCandidateId` = `cand-01`).
- `questions` — ngân hàng ~12 câu, đủ loại (SINGLE/MULTIPLE/FILL/MATCHING/ESSAY/
  CODING/ORDERING/EQ/IQ) + `criteriaId`, `tag`, đáp án đúng.
- `exam` + `session` — 1 đề + 1 ca thi (`code: 3021-8890`) gồm roster 5 thí sinh.
- `results` — kết quả từng thí sinh (điểm, tiêu chí, feedback) → admin dựng bảng
  điểm/tiêu chí, thí sinh xem trang kết quả.
- `criteria`, `toeic`, `interview`, `topics`, `leaderboard`.

**`admin.*`** — dữ liệu chỉ dùng phía LMS-AI-QLDT (`src/mocks/*.mock.ts` đọc qua
`seed.admin.<key>`): `questionBank`, `questionCriteria`, `questionGroups`,
`examFrameworks`, `examSets`, `generate*`, `evaluationCriteria`, `adminTopics`,
`adminExamSessions`, `origins` (IQ/EQ), `interviewSettings`, `toeic*`
(questions/exams/sessions/scorecard).

**`candidate.*`** — dữ liệu chỉ dùng phía lms-assessly-fe: `examList`,
`assignedExam`, `practiceList`, `practiceQuestions`, `notifications`,
`interviewResult`, `analytics` (heatmap/recentAttempts/topicGroups), `competency`,
`candidateToeic`, `candidateInterviewPractice`.

> Mọi `*.mock.ts` ở cả 2 repo đều đọc từ seed (`import seed from
> "@/mocks/shared/assessment-seed.json"` + `as unknown as <Type>`). Bên assessly,
> các mock từng nằm inline trong view đã tách thành seam
> views→hooks→services→mocks.

## Cách đồng bộ khi sửa seed

Sửa seed ở MỘT repo, rồi copy sang repo kia (PowerShell):

```powershell
Copy-Item "D:\Rikkei Education\LMS-AI-QLDT\src\mocks\shared\assessment-seed.json" `
          "D:\Rikkei Education\lms-assessly-fe\src\mocks\shared\assessment-seed.json" -Force
```

Hoặc bash:

```bash
cp "D:/Rikkei Education/LMS-AI-QLDT/src/mocks/shared/assessment-seed.json" \
   "D:/Rikkei Education/lms-assessly-fe/src/mocks/shared/assessment-seed.json"
```

Kiểm tra hai bản khớp nhau:

```bash
diff "D:/Rikkei Education/LMS-AI-QLDT/src/mocks/shared/assessment-seed.json" \
     "D:/Rikkei Education/lms-assessly-fe/src/mocks/shared/assessment-seed.json"
```

> Khi có API thật: thay thân các service đọc mock bằng call API; seed này chỉ dùng
> cho prototype/demo.
