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
                    const safeRedirect = redirectParam && /^\/(?![/\\])/.test(redirectParam) ? redirectParam : DEFAULT_AUTH_REDIRECT;
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
            <DialogContent className="max-w-[480px] rounded-2xl border-0 bg-white p-6 shadow-2xl sm:p-8">
                {/* Dialog Header with Centered Logo, Title & Description */}
                <DialogHeader className="space-y-3 text-center sm:text-center">
                    <div className="flex items-center justify-center pb-1">
                        <Image
                            src="/images/header/logo-rikkei2 1.png"
                            alt={UI_TEXT.common.appName}
                            width={160}
                            height={52}
                            className="h-11 w-auto object-contain"
                            priority
                            quality={100}
                        />
                    </div>

                    <div>
                        <DialogTitle className="text-2xl leading-tight font-bold text-slate-900 sm:text-[28px]">Đăng nhập</DialogTitle>
                        <DialogDescription className="mx-auto mt-1.5 max-w-[380px] text-xs leading-relaxed text-slate-500 sm:text-sm">
                            Khám phá kho tàng kiến thức bất tận cùng bộ tài liệu độc quyền với Rikkei Education
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* Form (Left-aligned for best readability and scanability) */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                    {/* Email Input */}
                    <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-slate-700 sm:text-sm">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Nhập email"
                                {...register("email")}
                                className={`h-11 w-full rounded-xl border bg-slate-50/70 px-4 text-xs text-slate-900 transition-all outline-none placeholder:text-slate-400 sm:text-sm ${
                                    errors.email
                                        ? "border-red-500 bg-red-50/20"
                                        : "border-slate-200 focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
                                }`}
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs font-medium text-red-600">{errors.email.message}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-slate-700 sm:text-sm">Mật khẩu</label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                {...register("password")}
                                className={`h-11 w-full rounded-xl border bg-slate-50/70 px-4 pr-11 text-xs text-slate-900 transition-all outline-none placeholder:text-slate-400 sm:text-sm ${
                                    errors.password
                                        ? "border-red-500 bg-red-50/20"
                                        : "border-slate-200 focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 cursor-pointer p-1 text-slate-400 hover:text-slate-600"
                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs font-medium text-red-600">{errors.password.message}</p>}
                    </div>

                    {/* Portal Checkbox & Forgot Password */}
                    <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-center gap-2">
                            <Checkbox id="isPortal" checked={isPortal} onCheckedChange={(checked) => setValue("isPortal", Boolean(checked))} />
                            <label htmlFor="isPortal" className="cursor-pointer text-xs font-medium text-slate-700 select-none sm:text-sm">
                                Đăng nhập với Portal
                            </label>
                        </div>

                        <button
                            type="button"
                            onClick={() => toast.info("Vui lòng liên hệ quản trị viên để cấp lại mật khẩu.")}
                            className="cursor-pointer text-xs font-semibold text-brand-600 hover:underline sm:text-sm"
                        >
                            Quên mật khẩu?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-700 disabled:opacity-70 sm:text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
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
