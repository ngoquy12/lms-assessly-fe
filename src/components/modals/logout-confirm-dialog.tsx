"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLogout } from "@/hooks/queries/use-auth";

interface LogoutConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LogoutConfirmDialog({ open, onOpenChange }: LogoutConfirmDialogProps) {
    const router = useRouter();
    const { mutate: logoutMutate, isPending } = useLogout();

    const handleConfirmLogout = () => {
        logoutMutate(undefined, {
            onSuccess: () => {
                onOpenChange(false);
                router.push("/");
            },
            onError: () => {
                onOpenChange(false);
                router.push("/");
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="md" className="max-w-[400px] gap-4 rounded-xl border border-slate-200 bg-white px-[24px] py-[20px] shadow-xl">
                <DialogHeader className="pb-0 text-center sm:text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                        <LogOut className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-lg font-bold text-slate-900">Xác nhận đăng xuất</DialogTitle>
                    <DialogDescription className="pt-1 text-xs text-slate-500">
                        Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không? Mọi tiến trình làm bài chưa nộp có thể không được lưu.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex-row items-center justify-center gap-2.5 pt-2 sm:justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                        className="h-10 flex-1 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        disabled={isPending}
                        onClick={handleConfirmLogout}
                        className="h-10 flex-1 rounded-xl bg-brand-600 text-xs font-bold text-white shadow-xs hover:bg-brand-700 sm:text-sm"
                    >
                        {isPending ? "Đang xử lý..." : "Đăng xuất"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
