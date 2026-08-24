"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DEFAULT_AUTH_REDIRECT, DEMO_CREDENTIALS } from "@/constants/auth.constants";
import { UI_TEXT } from "@/constants/ui-text.constants";
import { useLogin } from "@/hooks/queries/use-auth";
import { useAuthModal } from "@/store/use-auth-modal";

const loginSchema = z.object({
    email: z.string().min(1, "Vui lòng nhập địa chỉ email").email("Email không đúng định dạng hợp lệ"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu").min(6, "Mật khẩu phải có tối thiểu 6 ký tự"),
    isPortal: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isOpen, setIsOpen, closeModal } = useAuthModal();
    const [showPassword, setShowPassword] = useState(false);
    const { mutate: loginMutate, isPending: isLoading } = useLogin();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: DEMO_CREDENTIALS.email,
            password: DEMO_CREDENTIALS.password,
            isPortal: false,
        },
    });

    const isPortal = watch("isPortal");

    const onSubmit = (data: LoginFormData) => {
        loginMutate(
            { email: data.email, password: data.password },
            {
                onSuccess: () => {
                    toast.success(UI_TEXT.auth.login.success);
                    closeModal();
                    reset();
                    const redirectParam = searchParams.get("redirect");
                    const safeRedirect =
                        redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//") ? redirectParam : DEFAULT_AUTH_REDIRECT;
                    router.push(safeRedirect as Route);
                },
                onError: () => {
                    toast.error(UI_TEXT.auth.login.errors.loginFailed);
                },
            },
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-[580px] rounded-2xl border-0 bg-white p-8 shadow-2xl sm:p-12">
                {/* Dialog Header with Logo */}
                <DialogHeader className="space-y-4 text-left">
                    <div className="flex items-center">
                        <Image
                            src="/images/header/logo-rikkei2 1.png"
                            alt="RikkeiEdu"
                            width={114}
                            height={40}
                            className="h-10 w-auto object-contain"
                            priority
                        />
                    </div>

                    <div>
                        <DialogTitle className="text-[32px] leading-tight font-semibold text-[#2d2c2c]">Đăng nhập</DialogTitle>
                        <DialogDescription className="mt-2.5 text-[16px] leading-relaxed text-[#2d2c2c]">
                            Khám phá kho tàng kiến thức bất tận cùng bộ tài liệu độc quyền với Rikkei Education
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-[16px] font-medium text-[#2d2c2c]">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Nhập email"
                                {...register("email")}
                                className={`h-12 w-full rounded-lg border bg-[#ebf3ff]/60 px-4 text-[16px] text-[#2d2c2c] transition-all outline-none placeholder:text-gray-400 ${
                                    errors.email ? "border-red-500 bg-red-50/20" : "border-transparent focus:border-[#ab1f24] focus:bg-white"
                                }`}
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs font-medium text-red-600">{errors.email.message}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-[16px] font-medium text-[#2d2c2c]">Mật khẩu</label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                {...register("password")}
                                className={`h-12 w-full rounded-lg border bg-[#ebf3ff]/60 px-4 pr-12 text-[16px] text-[#2d2c2c] transition-all outline-none placeholder:text-gray-400 ${
                                    errors.password ? "border-red-500 bg-red-50/20" : "border-transparent focus:border-[#ab1f24] focus:bg-white"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 cursor-pointer p-1 text-gray-400 hover:text-gray-600"
                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs font-medium text-red-600">{errors.password.message}</p>}
                    </div>

                    {/* Portal Checkbox & Forgot Password */}
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                            <Checkbox id="isPortal" checked={isPortal} onCheckedChange={(checked) => setValue("isPortal", Boolean(checked))} />
                            <label htmlFor="isPortal" className="cursor-pointer text-sm font-medium text-[#2d2c2c] select-none">
                                Đăng nhập với Portal
                            </label>
                        </div>

                        <button
                            type="button"
                            onClick={() => toast.info("Vui lòng liên hệ quản trị viên để cấp lại mật khẩu.")}
                            className="cursor-pointer text-sm font-semibold text-[#ab1f24] hover:underline"
                        >
                            Quên mật khẩu?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ab1f24] text-[16px] font-semibold text-white shadow-xs transition-all hover:bg-[#8b1a1f] disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Đang xác thực...</span>
                                </>
                            ) : (
                                <span>Đăng nhập</span>
                            )}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
