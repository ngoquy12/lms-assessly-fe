"use client";

import { useRef, useState } from "react";
import { Camera, Check, Eye, EyeOff, KeyRound, Lock, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { useUserProfile } from "@/hooks/queries/use-user";

export function ProfileView() {
    const { data: user, isLoading, isError, refetch } = useUserProfile();

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] font-sans text-slate-900">
            <div className="mx-auto max-w-[1440px] space-y-8 px-6 py-8 sm:px-10">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
                    <Link href="/" className="transition-colors hover:text-[#ab1f24]">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span className="font-bold text-slate-900">Hồ sơ cá nhân</span>
                </div>

                {/* 1. Header (Standardized Hero Title & Subtitle) */}
                <div className="space-y-1.5">
                    <h1 className="text-3xl leading-tight font-bold tracking-tight text-[#ab1f24] sm:text-4xl lg:text-[40px]">Hồ sơ sinh viên</h1>
                    <p className="max-w-3xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
                        Quản lý thông tin tài khoản, cập nhật ảnh đại diện và bảo mật thông tin cá nhân
                    </p>
                </div>

                <QueryStateBoundary isLoading={isLoading} isError={isError} onRetry={refetch}>
                    {user ? (
                        <ProfileContent user={user} />
                    ) : (
                        <div className="flex items-center justify-center py-16 text-slate-500">{UI_TEXT.common.noData}</div>
                    )}
                </QueryStateBoundary>
            </div>
        </div>
    );
}

function ProfileContent({ user }: { user: NonNullable<ReturnType<typeof useUserProfile>["data"]> }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl || "/images/avatar/avatar.png");
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    // Form fields state
    const [fullName, setFullName] = useState(user.fullName);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || "2002-05-15");
    const [className, setClassName] = useState(user.className || "Kỹ sư Cầu nối Frontend – K26");

    // Change password fields state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    // Avatar upload handler
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Dung lượng ảnh không được vượt quá 5MB");
                return;
            }
            const objectUrl = URL.createObjectURL(file);
            setAvatarUrl(objectUrl);
            toast.success("Cập nhật ảnh đại diện thành công!");
        }
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Cập nhật thông tin hồ sơ thành công!");
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

        toast.success("Đổi mật khẩu thành công! Vui lòng ghi nhớ mật khẩu mới.");
        setIsChangePasswordOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <>
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* Left Column: Focused Avatar Card (No redundant text/stats) */}
                <div className="lg:col-span-4">
                    <Card className="flex flex-col items-center justify-center space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-2xs sm:p-8">
                        {/* Avatar with Click to Upload & Hover Effect */}
                        <div className="group relative cursor-pointer" onClick={() => fileInputRef.current?.click()} title="Nhấp để thay đổi ảnh đại diện">
                            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-slate-100 bg-[#fff6f7] shadow-md transition-transform duration-200 group-hover:scale-[1.02] sm:h-36 sm:w-36">
                                <Image src={avatarUrl} alt={fullName} width={144} height={144} className="h-full w-full object-cover" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <Camera className="h-8 w-8 text-white drop-shadow-sm" />
                            </div>
                            <button
                                type="button"
                                className="absolute right-1 bottom-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#ab1f24] text-white shadow-md transition-transform hover:scale-110 hover:bg-[#8b1a1f]"
                                title="Tải lên ảnh đại diện mới"
                            >
                                <Camera className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

                        <div className="space-y-1.5 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-9 cursor-pointer gap-2 rounded-xl border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                <Upload className="h-3.5 w-3.5" />
                                <span>Tải ảnh lên</span>
                            </Button>
                            <p className="text-[11px] font-medium text-slate-400">Định dạng JPG, PNG, WEBP. Tối đa 5MB</p>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Complete Details Form */}
                <div className="lg:col-span-8">
                    <Card className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8">
                        <CardHeader className="border-b border-slate-100 p-0 pb-4">
                            <CardTitle className="text-base font-bold text-slate-900 sm:text-lg">Thông tin chi tiết</CardTitle>
                            <CardDescription className="text-xs text-slate-500">
                                Thông tin định danh của sinh viên trên hệ thống khảo thí và học tập
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-0">
                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* 1. Full Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Họ và tên</label>
                                        <Input
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="h-10 rounded-xl border-slate-300 text-xs focus:border-[#ab1f24] focus:ring-1 focus:ring-[#ab1f24] sm:text-sm"
                                        />
                                    </div>

                                    {/* 2. Student Code (Disabled) */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Mã thí sinh (Không thể sửa)</label>
                                        <Input
                                            value={user.studentCode}
                                            disabled
                                            className="h-10 cursor-not-allowed rounded-xl border-slate-200 bg-slate-100/80 font-mono text-xs text-slate-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* 3. Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Email nhận kết quả</label>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-10 rounded-xl border-slate-300 text-xs focus:border-[#ab1f24] focus:ring-1 focus:ring-[#ab1f24] sm:text-sm"
                                        />
                                    </div>

                                    {/* 4. Phone */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Số điện thoại</label>
                                        <Input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="h-10 rounded-xl border-slate-300 text-xs focus:border-[#ab1f24] focus:ring-1 focus:ring-[#ab1f24] sm:text-sm"
                                        />
                                    </div>

                                    {/* 5. Date of birth (DatePicker) */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Ngày sinh</label>
                                        <DatePicker value={dateOfBirth} onChange={(date) => setDateOfBirth(date)} placeholder="Chọn ngày sinh..." />
                                    </div>

                                    {/* 6. Class / Batch */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Lớp / Khóa học</label>
                                        <Input
                                            value={className}
                                            onChange={(e) => setClassName(e.target.value)}
                                            className="h-10 rounded-xl border-slate-300 text-xs focus:border-[#ab1f24] focus:ring-1 focus:ring-[#ab1f24] sm:text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Form Action Buttons */}
                                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsChangePasswordOpen(true)}
                                        className="h-11 cursor-pointer gap-2 rounded-xl border-slate-200 px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
                                    >
                                        <KeyRound className="h-4 w-4" />
                                        <span>Đổi mật khẩu</span>
                                    </Button>

                                    <Button
                                        type="submit"
                                        className="h-11 cursor-pointer gap-2 rounded-xl bg-[#ab1f24] px-6 text-xs font-bold text-white shadow-xs hover:bg-[#8b1a1f] sm:text-sm"
                                    >
                                        <Check className="h-4 w-4" />
                                        <span>Lưu thay đổi</span>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 3. Change Password Dialog (Padding 20px 24px, Max Radius 12px) */}
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
        </>
    );
}
