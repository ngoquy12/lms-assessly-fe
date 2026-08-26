"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type GuideKey = "khaothi" | "toeic" | "khoinguyen" | "interview";

export interface GuideSection {
    key: GuideKey;
    title: string;
    path: Route;
    summary: string;
    steps: string[];
    notes: string[];
    statusBadge?: string;
}

const EXAM_GUIDE_SECTIONS: GuideSection[] = [
    {
        key: "khaothi",
        title: "Khảo thí",
        path: "/page-exam",
        summary: "Làm bài ca thi thường: nhập mã ca, đồng hồ theo giờ đóng ca, nộp bài khi hoàn thành.",
        steps: [
            "Vào menu Khảo thí → chọn ca đang mở.",
            "Nhập mã ca thi 8 số do giám thị cung cấp.",
            "Làm bài; hệ thống tự lưu đáp án khi mất mạng ngắn.",
            "Nộp bài khi xong hoặc khi hết giờ (auto-submit).",
        ],
        notes: [
            "Tuyệt đối không share mã ca thi; nếu có trường hợp gian lận, hệ thống tự động nộp bài mà không báo trước.",
            "Không F5 liên tục; nếu mất mạng chờ popup reconnect tự tắt.",
        ],
    },
    {
        key: "toeic",
        title: "TOEIC",
        path: "/toeic",
        summary:
            "Đề thi gồm PDF + Audio Listening. Để đảm bảo kết nối ổn định, thí sinh nên làm Reading (Question 101–200) trước, sau đó chủ động bấm phát Audio để làm Listening (Question 1–100) khi sẵn sàng.",
        steps: [
            "Đăng nhập hệ thống → vào TOEIC → chọn ca thi.",
            "Nhập mã ca thi do giám thị cung cấp.",
            "Chờ hệ thống tải xong đề PDF và Audio trước khi bắt đầu làm bài.",
            "Nên làm phần Reading (75 phút) (Question 101–200), sau đó chủ động bấm Phát để làm Listening (Question 1–100) khi sẵn sàng.",
            "Khi còn 45 phút, bấm Phát Listening để bắt đầu phần Nghe.",
            "Hoàn thành bài thi và bấm Nộp bài khi làm xong hoặc chờ hệ thống tự nộp khi hết thời gian.",
        ],
        notes: [
            "Mã ca thi chỉ được cung cấp khi giám thị cho phép bắt đầu thi.",
            "Chỉ bấm Phát Listening khi đã sẵn sàng; audio chỉ được phát 01 lần, không thể phát lại hoặc tua.",
            "Trong quá trình làm bài, nếu mất kết nối Internet, hệ thống sẽ tự động lưu bài làm và hiển thị thông báo.",
            "Khi kết nối được khôi phục, bài thi sẽ tự động tiếp tục, không cần tải lại trang (F5).",
            "Nếu mất mạng khi đang nghe Listening, audio sẽ tạm dừng và tiếp tục phát đúng vị trí trước đó sau khi kết nối lại.",
            "Sinh viên có thể nộp bài bất kỳ lúc nào trong thời gian làm bài, không cần chờ hết giờ.",
            "Không tự ý làm mới trình duyệt hoặc đăng xuất trong thời gian thi nếu không có hướng dẫn của giám thị.",
            "Mọi vấn đề phát sinh trong quá trình thi cần báo ngay cho giám thị để được hỗ trợ.",
        ],
    },
    {
        key: "khoinguyen",
        title: "Khởi nguyên",
        path: "/competency-assessment",
        summary: "Các hoạt động / đánh giá thuộc chương trình Khởi nguyên trên hệ thống.",
        steps: [
            "Vào menu Khởi nguyên từ thanh điều hướng.",
            "Chọn hoạt động hoặc ca đang mở theo hướng dẫn giảng viên.",
            "Làm theo từng bước trên màn hình (đăng nhập đúng tài khoản được cấp).",
        ],
        notes: ["Nội dung chi tiết có thể bổ sung theo từng đợt."],
    },
    {
        key: "interview",
        title: "Interview",
        path: "/interview",
        summary: "Phỏng vấn / kiểm tra thiết bị. Mục này chỉ mở khi có ca Interview đang diễn ra.",
        steps: [
            "Khi có ca Interview: vào menu Interview → chọn ca.",
            "Kiểm tra mic / thiết bị trước khi bắt đầu.",
            "Làm theo quy trình từng vòng trên màn hình.",
        ],
        notes: ["Chỉ mở khi hệ thống có ca Interview dành cho bạn.", "Hiện chưa có ca → tab bị khóa."],
        statusBadge: "Mở",
    },
];

export function ExamGuideView() {
    const [activeTabKey, setActiveTabKey] = useState<GuideKey>("khaothi");

    const currentSection = EXAM_GUIDE_SECTIONS.find((s) => s.key === activeTabKey) || EXAM_GUIDE_SECTIONS[0];

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
            <div className="mx-auto max-w-[1440px] space-y-6 px-6 py-8 sm:px-10">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                    <Link href="/" className="transition-colors hover:text-brand-600">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span className="font-bold text-slate-900">Hướng dẫn thi</span>
                </div>

                {/* 2. Page Title & Subtitle */}
                <div className="space-y-1">
                    <h1 className="text-[32px] font-bold tracking-tight text-brand-700">Hướng dẫn thi</h1>
                    <p className="text-[15px] text-slate-600">Chọn loại hình thi để xem các bước và lưu ý trước khi vào phòng.</p>
                </div>

                {/* 3. 4-Card Tab Selector */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {EXAM_GUIDE_SECTIONS.map((section) => {
                        const isActive = activeTabKey === section.key;
                        return (
                            <button
                                key={section.key}
                                type="button"
                                onClick={() => setActiveTabKey(section.key)}
                                className={`cursor-pointer rounded-2xl p-5 text-left transition-all ${
                                    isActive
                                        ? "border-2 border-brand-600 bg-brand-50/60 shadow-2xs"
                                        : "border border-slate-200 bg-white shadow-2xs hover:border-slate-300"
                                }`}
                            >
                                <span className={`block text-[17px] font-bold ${isActive ? "text-slate-900" : "text-slate-700"}`}>{section.title}</span>
                                {section.statusBadge && <span className="mt-1 block text-xs text-slate-500">{section.statusBadge}</span>}
                            </button>
                        );
                    })}
                </div>

                {/* 4. Active Section Content Card */}
                <div className="space-y-8 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs sm:p-10">
                    {/* Section Header */}
                    <div className="space-y-2 border-b border-slate-100 pb-6">
                        <h2 className="text-[26px] font-bold text-slate-900">{currentSection.title}</h2>
                        <p className="text-[15px] leading-relaxed text-slate-600">{currentSection.summary}</p>
                    </div>

                    {/* Section Steps */}
                    <div className="space-y-4">
                        <h3 className="text-[17px] font-bold text-slate-900">Các bước</h3>
                        <div className="space-y-3">
                            {currentSection.steps.map((step, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 rounded-xl border border-slate-200/60 bg-slate-50 p-4 transition-all hover:bg-slate-100/70"
                                >
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-2xs">
                                        {idx + 1}
                                    </div>
                                    <span className="text-[15px] font-medium text-slate-900">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section Notes */}
                    <div className="space-y-3 pt-2">
                        <h3 className="text-[17px] font-bold text-slate-900">Lưu ý</h3>
                        <div className="space-y-2.5 text-[15px] leading-relaxed text-slate-700">
                            {currentSection.notes.map((note, idx) => (
                                <p key={idx} className="flex items-start gap-2">
                                    <span className="font-bold text-slate-400">•</span>
                                    <span>{note}</span>
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6">
                        <Link href={currentSection.path}>
                            <Button
                                type="button"
                                className="h-11 cursor-pointer rounded-xl bg-slate-900 px-7 text-sm font-bold text-white shadow-xs hover:bg-black"
                            >
                                Vào {currentSection.title}
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 cursor-pointer rounded-xl border-slate-300 px-7 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Quay lại trang chủ
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
