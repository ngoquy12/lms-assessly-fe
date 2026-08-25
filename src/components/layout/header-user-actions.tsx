"use client";

import { useState } from "react";
import { Bell, Brain, ChevronDown, Eye, EyeOff, FileCheck2, History, KeyRound, Lock, LogOut, Radio, Sparkles, User } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogoutConfirmDialog } from "@/components/modals/logout-confirm-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCurrentUser, useLogout } from "@/hooks/queries/use-auth";
import { useAuthModal } from "@/store/use-auth-modal";

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    isRead: boolean;
    type: "exam" | "interview" | "competency" | "toeic";
    href: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
    {
        id: "notif-1",
        title: "Ca thi trực tuyến sắp mở phòng",
        description: 'Ca thi "Lập trình Web Frontend Next.js 16" sẽ mở sau 15 phút nữa.',
        time: "10 phút trước",
        isRead: false,
        type: "exam",
        href: "/page-exam",
    },
    {
        id: "notif-2",
        title: "Đã có kết quả Phỏng vấn AI",
        description: 'Phiên phỏng vấn "Frontend Senior" đạt 88/100 điểm. Xem đánh giá chi tiết.',
        time: "2 giờ trước",
        isRead: false,
        type: "interview",
        href: "/interview/result/backend-nodejs-senior",
    },
    {
        id: "notif-3",
        title: "Bài đánh giá Khởi nguyên mới",
        description: 'Bạn được gán vào bài khảo sát năng lực "Tư duy Logic & Phân tích Dữ liệu (IQ)".',
        time: "5 giờ trước",
        isRead: false,
        type: "competency",
        href: "/competency-assessment",
    },
    {
        id: "notif-4",
        title: "Hoàn thành bài luyện tập TOEIC",
        description: "Bạn đã hoàn thành bài thi thử TOEIC Reading & Listening với điểm số 850/990.",
        time: "Hôm qua",
        isRead: true,
        type: "toeic",
        href: "/toeic",
    },
];

export function HeaderUserActions() {
    const router = useRouter();
    const { data: currentUser } = useCurrentUser();
    const { mutate: logoutMutate } = useLogout();
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { openModal } = useAuthModal();

    const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    // Form Change Password State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
    };

    const handleNotificationClick = (id: string, href: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
        router.push(href as unknown as Route);
    };

    // eslint-disable-next-line unused-imports/no-unused-vars
    const handleLogout = () => {
        logoutMutate(undefined, {
            onSuccess: () => {
                toast.success("Đăng xuất thành công");
                router.push("/");
            },
        });
    };

    const handleChangePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");

        if (!currentPassword.trim()) {
            setPasswordError("Vui lòng nhập mật khẩu hiện tại.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Xác nhận mật khẩu mới không trùng khớp.");
            return;
        }

        // Mock password update
        toast.success("Đổi mật khẩu thành công! Vui lòng ghi nhớ mật khẩu mới.");
        setIsChangePasswordOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const displayName = currentUser?.fullName || currentUser?.email?.split("@")[0] || "Bảo Hoàng 01";
    const displayEmail = currentUser?.email || "baohoang01@rikkeiedu.vn";
    const initials =
        displayName
            .split(" ")
            .map((p: string) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "BH";

    return (
        <div className="flex items-center gap-3">
            {/* 1. Notification Bell Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        aria-label="Thông báo"
                        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-50 hover:text-[#ab1f24] active:scale-95"
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 animate-pulse items-center justify-center rounded-full bg-[#ab1f24] px-1 text-[10px] font-bold text-white shadow-xs">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-[340px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-0 shadow-xl sm:w-[380px]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">Thông báo</span>
                            {unreadCount > 0 && (
                                <Badge className="border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[#ab1f24] shadow-none">
                                    {unreadCount} mới
                                </Badge>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                className="cursor-pointer text-xs font-semibold text-slate-500 transition-colors hover:text-[#ab1f24]"
                            >
                                Đã đọc tất cả
                            </button>
                        )}
                    </div>

                    {/* Notifications List with sleek thin scrollbar */}
                    <div className="max-h-[360px] [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] divide-y divide-slate-100 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-track]:bg-transparent">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => handleNotificationClick(n.id, n.href)}
                                className={`flex cursor-pointer items-start gap-3.5 p-3.5 transition-colors hover:bg-slate-50/80 ${
                                    !n.isRead ? "bg-red-50/30" : "bg-white"
                                }`}
                            >
                                {/* Type Icon */}
                                <div
                                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-2xs ${
                                        n.type === "exam"
                                            ? "bg-red-100 text-[#ab1f24]"
                                            : n.type === "interview"
                                              ? "bg-emerald-100 text-emerald-700"
                                              : n.type === "competency"
                                                ? "bg-indigo-100 text-indigo-700"
                                                : "bg-amber-100 text-amber-700"
                                    }`}
                                >
                                    {n.type === "exam" && <Radio className="h-4 w-4" />}
                                    {n.type === "interview" && <Sparkles className="h-4 w-4" />}
                                    {n.type === "competency" && <Brain className="h-4 w-4" />}
                                    {n.type === "toeic" && <FileCheck2 className="h-4 w-4" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-start justify-between gap-1">
                                        <h4 className={`text-xs leading-snug font-bold ${!n.isRead ? "text-slate-900" : "text-slate-700"}`}>{n.title}</h4>
                                        {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-[#ab1f24]" />}
                                    </div>
                                    <p className="text-2xs line-clamp-2 leading-relaxed text-slate-500">{n.description}</p>
                                    <span className="block pt-0.5 text-[10px] font-medium text-slate-400">{n.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-100 bg-slate-50/50 p-2 text-center">
                        <Link
                            href={"/notifications" as unknown as Route}
                            className="block rounded-lg py-1.5 text-xs font-bold text-[#ab1f24] transition-colors hover:bg-red-50"
                        >
                            Xem thêm
                        </Link>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 2. User Avatar & Profile Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="flex cursor-pointer items-center gap-2.5 rounded-xl p-1 outline-hidden transition-all hover:bg-slate-100/80 active:scale-98"
                    >
                        <Avatar className="h-10 w-10 border border-slate-200 shadow-2xs">
                            <AvatarFallback className="bg-red-50 text-sm font-bold text-[#ab1f24]">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="hidden text-left sm:block">
                            <p className="max-w-[140px] truncate text-xs leading-tight font-bold text-slate-900">{displayName}</p>
                            <p className="max-w-[140px] truncate text-[11px] leading-tight text-slate-500">{displayEmail}</p>
                        </div>
                        <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="w-[260px] rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl">
                    {/* User Header Info (Hidden Email, only Name & Student Code) */}
                    <div className="border-b border-slate-100 px-3 py-2.5">
                        <p className="text-sm leading-tight font-bold text-slate-900">{displayName}</p>
                        <p className="pt-0.5 font-mono text-xs text-slate-500">Mã SV: {currentUser?.studentCode || "BH-2026-0889"}</p>
                    </div>

                    <div className="py-1">
                        {/* 1. Profile option */}
                        <DropdownMenuItem
                            onClick={() => router.push("/profile" as unknown as Route)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <User className="h-4 w-4 text-slate-500" />
                            <span>Thông tin cá nhân</span>
                        </DropdownMenuItem>

                        {/* 2. Exam History option */}
                        <DropdownMenuItem
                            onClick={() => router.push("/exam-result" as unknown as Route)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <History className="h-4 w-4 text-slate-500" />
                            <span>Lịch sử làm bài</span>
                        </DropdownMenuItem>

                        {/* 3. Change password option */}
                        <DropdownMenuItem
                            onClick={() => setIsChangePasswordOpen(true)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <KeyRound className="h-4 w-4 text-slate-500" />
                            <span>Đổi mật khẩu</span>
                        </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-slate-100" />

                    {/* 4. Logout option */}
                    <DropdownMenuItem
                        onClick={() => setIsLogoutConfirmOpen(true)}
                        className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <LogOut className="h-4 w-4 text-red-600" />
                        <span>Đăng xuất</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 3. Dialog Đổi Mật Khẩu (Shadcn UI Standard, Padding 20px 24px, Radius <= 12px) */}
            <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                <DialogContent size="md" className="max-w-[440px] gap-4 rounded-xl border border-slate-200 bg-white px-[24px] py-[20px] shadow-xl">
                    <DialogHeader className="pb-0 text-center sm:text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#ab1f24]">
                            <Lock className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900">Đổi mật khẩu tài khoản</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5 pt-1">
                        {/* Current Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Mật khẩu hiện tại</label>
                            <div className="relative">
                                <Input
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu hiện tại..."
                                    value={currentPassword}
                                    onChange={(e) => {
                                        setCurrentPassword(e.target.value);
                                        if (passwordError) setPasswordError("");
                                    }}
                                    className="h-10 rounded-xl border-slate-300 pr-9 text-xs focus:border-[#ab1f24] focus:ring-1 focus:ring-[#ab1f24] sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Mật khẩu mới</label>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Tối thiểu 6 ký tự..."
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        if (passwordError) setPasswordError("");
                                    }}
                                    className="h-10 rounded-xl border-slate-300 pr-9 text-xs focus:border-[#ab1f24] focus:ring-1 focus:ring-[#ab1f24] sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Xác nhận mật khẩu mới</label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Nhập lại mật khẩu mới..."
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (passwordError) setPasswordError("");
                                    }}
                                    className="h-10 rounded-xl border-slate-300 pr-9 text-xs focus:border-[#ab1f24] focus:ring-1 focus:ring-[#ab1f24] sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {passwordError && <p className="pt-0.5 text-xs font-semibold text-red-600">{passwordError}</p>}

                        <DialogFooter className="flex-row items-center justify-center gap-2.5 pt-2 sm:justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsChangePasswordOpen(false)}
                                className="h-10 flex-1 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="h-10 flex-1 rounded-xl bg-[#ab1f24] text-xs font-bold text-white shadow-xs hover:bg-[#8b1a1f] sm:text-sm"
                            >
                                <span>Cập nhật</span>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 4. Dialog Xác Nhận Đăng Xuất */}
            <LogoutConfirmDialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen} />
        </div>
    );
}
