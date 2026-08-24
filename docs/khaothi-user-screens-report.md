# BÁO CÁO TỔNG HỢP DANH SÁCH MÀN HÌNH DỰ ÁN KHAOTHI-USER

- **Tên dự án**: `khaothi-user` (Ứng dụng Khảo thí, Thi trực tuyến & Đánh giá năng lực thí sinh)
- **Framework**: React 18, Vite, React Router DOM v6, TailwindCSS, Ant Design, Zustand / Redux Toolkit, Socket.io Client.
- **Mục tiêu hệ thống**: Cung cấp môi trường thi trực tuyến bảo mật cao (Anti-cheat), thi chứng chỉ ngoại ngữ (IELTS/TOEIC), đánh giá năng lực (EQ/IQ), phỏng vấn AI và xem kết quả thi chi tiết.

---

## 📑 BẢNG TỔNG HỢP DANH SÁCH MÀN HÌNH (SCREEN INVENTORY)

|   STT    | Tên Màn Hình / Feature                                           | Đường Dẫn (Route Path)              | Layout Sử Dụng               | Mục Đích & Chức Năng Chính                                                                                                                        |
| :------: | :--------------------------------------------------------------- | :---------------------------------- | :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
|  **I**   | **NHÓM XÁC THỰC & TÀI KHOẢN (AUTH & PROFILE)**                   |                                     |                              |                                                                                                                                                   |
|    1     | **Đăng nhập Thí sinh (Login)**                                   | `/login` (hoặc Auth Modal)          | `AuthLayout` / Modal         | Đăng nhập tài khoản, Google SSO, xác thực reCAPTCHA, lấy Access Token.                                                                            |
|    2     | **Hồ sơ Cá nhân (Profile)**                                      | `/profile`                          | `MainLayout`                 | Xem/sửa thông tin thí sinh, đổi mật khẩu, xem danh sách chứng chỉ đạt được.                                                                       |
|    3     | **Bảng Xếp Hạng (Ranking / Leaderboard)**                        | `/ranking`                          | `MainLayout`                 | Bảng vinh danh top thí sinh có điểm cao theo tuần, tháng, kỳ thi.                                                                                 |
|  **II**  | **NHÓM TRANG CHỦ & HƯỚNG DẪN (HOME & GUIDE)**                    |                                     |                              |                                                                                                                                                   |
|    4     | **Trang Chủ Khảo Thí (Home Page V2)**                            | `/`                                 | `MainLayout`                 | Banner, danh sách ca thi sắp diễn ra, lịch thi cá nhân, quick links.                                                                              |
|    5     | **Quy Chế & Hướng Dẫn Thi (Exam Guide)**                         | `/huong-dan`                        | `MainLayout`                 | Hướng dẫn thao tác làm bài, quy chế thi, quy định chống gian lận (Anti-cheat).                                                                    |
| **III**  | **NHÓM THI CHÍNH THỨC & VÉ THI (OFFICIAL EXAM & LOBBY)**         |                                     |                              |                                                                                                                                                   |
|    6     | **Sảnh Ca Thi (Page Exam / Lobby)**                              | `/page-exam`                        | `MainLayout`                 | Danh sách ca thi chính thức của thí sinh, ô nhập mã Access Code / Ticket.                                                                         |
|    7     | **Xác Thực Vé Thi (Verify Ticket)**                              | `/verify-ticket`                    | `MainLayout`                 | Xác thực mã vé thi, kiểm tra thông tin thí sinh, xác nhận quy chế phòng thi.                                                                      |
|    8     | **Phòng Thi Trực Tuyến (Main Exam Taking)**                      | `/page-exam/main-exam/:id`          | `ExamLayout` _(Protected)_   | **Màn hình làm bài thi chính thức**: Socket giám thị, Countdown Timer, Anti-cheat monitor, ma trận câu hỏi, auto-save câu trả lời, modal nộp bài. |
|    9     | **Kết Quả Bài Thi Chính Thức (Exam Result Detail)**              | `/page-exam/result-exam/:id`        | `ExamLayout` _(Protected)_   | Hiển thị kết quả điểm số, trạng thái đạt/chưa đạt, tỷ lệ câu đúng/sai, nhận xét từ giám khảo.                                                     |
|    10    | **Lịch Sử & Báo Cáo Thi (Exam Result History)**                  | `/exam-result`                      | `MainLayout`                 | Dashboard tổng hợp toàn bộ lịch sử thi cử, biểu đồ phân tích phổ điểm tích lũy.                                                                   |
|  **IV**  | **NHÓM LUYỆN TẬP & ÔN THI (PRACTICE & TOPICS)**                  |                                     |                              |                                                                                                                                                   |
|    11    | **Danh Sách Bài Thi Thử (Practice List)**                        | `/practice`                         | `MainLayout`                 | Danh mục các đề thi thử theo môn học, bộ kỹ năng, mức độ khó/dễ.                                                                                  |
|    12    | **Chi Tiết Đề Thi Thử (Practice Detail)**                        | `/practice/:id`                     | `MainLayout`                 | Thông tin số lượng câu hỏi, thời gian, cơ cấu điểm, nút "Bắt đầu làm bài".                                                                        |
|    13    | **Làm Bài Luyện Tập Công Khai (Public Practice Exam)**           | `/practice-public/:id`              | `MainLayout`                 | Môi trường làm bài thi thử tự do không cần đăng nhập hoặc vé thi.                                                                                 |
|    14    | **Kết Quả Luyện Tập Công Khai (Public Practice Result)**         | `/practice-public/result-exam/:id`  | `MainLayout`                 | Báo cáo chi tiết đáp án đúng/sai, giải thích lời giải bài thi thử.                                                                                |
|    15    | **Danh Sách Chủ Đề Ôn Luyện (Topics Page)**                      | `/topics`                           | `MainLayout`                 | Danh mục chủ đề kiến thức phân cấp (Tree structure).                                                                                              |
|    16    | **Chi Tiết Chủ Đề Ôn Luyện (Topic Detail)**                      | `/topics/:id`                       | `MainLayout`                 | Ngân hàng câu hỏi mẫu và tài liệu ôn tập theo từng chủ đề.                                                                                        |
|  **V**   | **NHÓM THI CHỨNG CHỈ NGOẠI NGỮ (TOEIC / IELTS)**                 |                                     |                              |                                                                                                                                                   |
|    17    | **Danh Sách Đề Ngoại Ngữ (TOEIC/IELTS List)**                    | `/toeic`                            | `MainLayout`                 | Danh sách đề thi Listening / Reading theo format chuẩn quốc tế.                                                                                   |
|    18    | **Phòng Thi Ngoại Ngữ Chuyên Sâu (IELTS/TOEIC Exam)**            | `/toeic/:id`                        | `IeltsLayout` _(Split View)_ | **Màn hình chia đôi (Split Screen)**: Bên trái đọc Passage / phát Audio, bên phải làm câu hỏi trắc nghiệm.                                        |
|    19    | **Kết Quả Thi Ngoại Ngữ (TOEIC/IELTS Result)**                   | `/toeic/:id/result`                 | `MainLayout`                 | Phân tích điểm chi tiết từng Part, band score ước tính, bảng câu đúng/sai.                                                                        |
|  **VI**  | **NHÓM ĐÁNH GIÁ NĂNG LỰC TƯ DUY (COMPETENCY / EQ & IQ)**         |                                     |                              |                                                                                                                                                   |
|    20    | **Danh Mục Bài Đánh Giá Năng Lực (Competency Assessment)**       | `/competency-assessment`            | `MainLayout`                 | Danh sách bài kiểm tra tư duy logic, EQ, IQ, năng lực chuyên môn.                                                                                 |
|    21    | **Làm Bài Test Đánh Giá Năng Lực (EQ/IQ Exam)**                  | `/competency-assessment/:id`        | `MainLayout`                 | Giao diện làm bài test tư duy logic với đồng hồ giới hạn theo từng câu hỏi.                                                                       |
|    22    | **Biểu Đồ Kết Quả Năng Lực (Competency Result)**                 | `/competency-assessment/:id/result` | `MainLayout`                 | **Biểu đồ Radar đa giác năng lực**, phân tích chỉ số IQ/EQ, tiềm năng thí sinh.                                                                   |
| **VII**  | **NHÓM PHỎNG VẤN & ĐÁNH GIÁ AI (AI INTERVIEW & VOICE)**          |                                     |                              |                                                                                                                                                   |
|    23    | **Danh Sách Phòng Phỏng Vấn AI (AI Interview List)**             | `/interview`                        | `MainLayout`                 | Danh sách các vị trí và chủ đề phỏng vấn thử với AI.                                                                                              |
|    24    | **Kiểm Tra Thiết Bị Phỏng Vấn (Check Device)**                   | `/ai-interview/check-device/:id`    | `InterviewLayout`            | Màn hình kiểm tra Microphone, Camera, Loa, âm lượng và đường truyền mạng.                                                                         |
|    25    | **Phòng Phỏng Vấn Giọng Nói Trực Tiếp Với AI (Voice Interview)** | `/ai-interview/session/:id`         | `InterviewLayout`            | **Màn hình phỏng vấn tương tác AI trực tiếp qua Voice/Video stream**, nhận diện giọng nói và phản hồi thời gian thực.                             |
|    26    | **Chi Tiết Phiên Phỏng Vấn (Interview Session)**                 | `/interview/:id`                    | `MainLayout`                 | Lịch trình và trạng thái buổi phỏng vấn.                                                                                                          |
|    27    | **Báo Cáo Đánh Giá Phỏng Vấn AI (Interview Result)**             | `/interview/result/:id`             | `MainLayout`                 | Đánh giá phát âm, ngữ pháp, độ lưu loát, tính logic và gợi ý cải thiện từ AI.                                                                     |
| **VIII** | **NHÓM HỆ THỐNG & ĐIỀU HƯỚNG (SYSTEM & ERROR)**                  |                                     |                              |                                                                                                                                                   |
|    28    | **Trang Không Tìm Thấy (404 Not Found)**                         | `*`                                 | `ExamLayout` / Default       | Màn hình thông báo trang không tồn tại kèm nút quay về trang chủ.                                                                                 |

---

## 🔍 CHI TIẾT CÁC MÀN HÌNH NÒNG CỐT (CORE SCREENS DEEP-DIVE)

### 1. Màn hình Làm bài thi chính thức (`/page-exam/main-exam/:id`)

- **Kiến trúc Layout**: Sử dụng `ExamLayout` với tính năng chặn điều hướng trái phép (`ProtectedExamRoute`).
- **Các tính năng kỹ thuật cao**:
    - **Realtime Socket**: Kết nối WebSocket với phòng thi của giám thị (`LMS-AI-QLDT`).
    - **Anti-cheat Security**: Theo dõi sự kiện mất focus trình duyệt (chuyển tab), tự động bật chế độ toàn màn hình (Fullscreen), chặn copy/paste và chặn phím F12.
    - **Question Navigation Palette**: Bảng ma trận danh sách câu hỏi hỗ trợ đánh dấu cờ (Flag), trạng thái đã trả lời (Answered), chưa trả lời (Unanswered).
    - **Đa dạng 7 dạng câu hỏi**: Trắc nghiệm 1 đáp án, nhiều đáp án, điền từ vào chỗ trống, ghép nối cặp, tự luận (Rich Editor), viết code lập trình, nghe/nói audio.
    - **Auto-save**: Cơ chế tự động lưu đáp án theo thời gian thực.

### 2. Màn hình Thi chứng chỉ Ngoại ngữ (`/toeic/:id`)

- **Kiến trúc Layout**: `IeltsLayout` thiết kế dạng **Split View (2 cột song song)**:
    - **Cột trái**: Hiển thị bài đọc dài (Reading Passage) hoặc Trình phát âm thanh có waveform (Audio Listening Player).
    - **Cột phải**: Danh sách câu hỏi tương ứng theo từng Part.

### 3. Màn hình Phỏng vấn tương tác AI (`/ai-interview/session/:id`)

- **Kiến trúc Layout**: `InterviewLayout` tích hợp WebRTC, Web Speech API và Audio Stream.
- **Các tính năng chính**:
    - AI Avatar / Voice Generator đặt câu hỏi.
    - Thí sinh trả lời trực tiếp qua micro, hệ thống phân tích realtime độ trễ phản xạ, từ vựng và chấm điểm năng lực phỏng vấn.

### 4. Màn hình Báo cáo & Đánh giá năng lực (`/competency-assessment/:id/result`)

- **Thành phần UI**: Sử dụng Chart.js (Radar Chart & Bar Chart).
- **Nội dung**: Thể hiện trực quan thế mạnh và điểm cần cải thiện của thí sinh theo các trục năng lực: Tư duy logic, Kỹ năng chuyên môn, Giải quyết vấn đề, Giao tiếp.
