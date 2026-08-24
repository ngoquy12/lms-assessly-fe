"use client";

import { Award, BookOpen } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_USER_PROFILE } from "@/mocks/user.mock";

export function ProfileView() {
    const user = MOCK_USER_PROFILE;

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] px-4 py-10 font-sans text-slate-900 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1440px] space-y-8">
                {/* 1. Header */}
                <div>
                    <h1 className="text-[32px] font-extrabold tracking-tight text-[#ab1f24] sm:text-[38px]">Hồ sơ thí sinh</h1>
                    <p className="mt-1 text-[15px] text-slate-600 sm:text-[16px]">Quản lý thông tin tài khoản và xem lịch sử chứng chỉ khảo thí</p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Card: Summary & Stats */}
                    <div className="space-y-6 lg:col-span-4">
                        <Card size="md" className="rounded-2xl border-slate-200/80 bg-white">
                            <CardContent className="space-y-4 pt-6 text-center">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-[#ab1f24]/20 bg-[#fff6f7]">
                                    <Image src="/images/avatar/avatar.png" alt={user.fullName} width={80} height={80} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">{user.fullName}</h2>
                                    <p className="font-mono text-xs text-slate-500">Mã thí sinh: {user.studentCode}</p>
                                    <p className="mt-1 text-xs font-semibold text-[#ab1f24]">{user.className}</p>
                                </div>
                                <div className="flex justify-center gap-2">
                                    <Badge variant="success" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                                        Đã xác thực danh tính
                                    </Badge>
                                    <Badge variant="secondary">Hạng #{user.rankPosition}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card size="sm" className="rounded-2xl border-slate-200/80 bg-white p-4 text-center">
                                <BookOpen className="mx-auto mb-1 h-5 w-5 text-[#ab1f24]" />
                                <p className="text-2xl font-bold text-slate-900">{user.totalExamsTaken}</p>
                                <p className="text-xs text-slate-500">Bài thi đã làm</p>
                            </Card>
                            <Card size="sm" className="rounded-2xl border-slate-200/80 bg-white p-4 text-center">
                                <Award className="mx-auto mb-1 h-5 w-5 text-amber-500" />
                                <p className="text-2xl font-bold text-slate-900">{user.averageScore}</p>
                                <p className="text-xs text-slate-500">Điểm trung bình</p>
                            </Card>
                        </div>
                    </div>

                    {/* Right Card: Details Form */}
                    <div className="lg:col-span-8">
                        <Card size="md" className="rounded-2xl border-slate-200/80 bg-white p-6">
                            <CardHeader className="border-b border-slate-100 p-0 pb-4">
                                <CardTitle className="text-base font-bold text-slate-900">Thông tin chi tiết</CardTitle>
                                <CardDescription className="text-xs text-slate-500">Thông tin định danh trong các biên bản ca thi và chứng chỉ</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-0 pt-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Họ và tên</label>
                                        <Input defaultValue={user.fullName} readOnly className="rounded-xl" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Mã thí sinh (Không thể sửa)</label>
                                        <Input defaultValue={user.studentCode} disabled className="rounded-xl" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Email nhận kết quả</label>
                                        <Input defaultValue={user.email} className="rounded-xl" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Số điện thoại</label>
                                        <Input defaultValue={user.phone} className="rounded-xl" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Ngày sinh</label>
                                        <Input defaultValue={user.dateOfBirth} type="date" className="rounded-xl" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Lớp / Khóa học</label>
                                        <Input defaultValue={user.className} readOnly className="rounded-xl" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                    <Button variant="outline" className="h-10 rounded-xl px-5 font-semibold">
                                        Đổi mật khẩu
                                    </Button>
                                    <Button className="h-10 rounded-xl bg-[#ab1f24] px-6 font-bold text-white shadow-xs hover:bg-[#90171b]">
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
