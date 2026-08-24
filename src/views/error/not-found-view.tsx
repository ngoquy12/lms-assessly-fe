"use client";

import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NotFoundView() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
            <Card size="md" className="shadow-card-md w-full max-w-md border-gray-200/80 text-center">
                <CardContent className="space-y-4 p-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                        <FileQuestion className="h-8 w-8" />
                    </div>

                    <div className="space-y-1">
                        <span className="text-4xl font-black text-brand-700">404</span>
                        <h1 className="text-lg font-bold text-gray-900">Không tìm thấy trang</h1>
                        <p className="text-xs text-gray-500">Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển trong hệ thống.</p>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        <Link href="/">
                            <Button className="w-full gap-2">
                                <Home className="h-4 w-4" />
                                <span>Trở về Trang chủ</span>
                            </Button>
                        </Link>
                        <Link href="/page-exam">
                            <Button variant="outline" className="w-full">
                                Vào sảnh ca thi
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
