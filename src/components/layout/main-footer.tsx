"use client";

import Image from "next/image";

const OFFICES = [
    {
        id: "hanoi",
        label: "Cơ sở Hà Nội:",
        address: "Toà nhà HPC Landmark 105, 105 Tố Hữu, La Khê, Hà Đông, Hà Nội",
    },
    {
        id: "hcm",
        label: "Cơ sở Hồ Chí Minh:",
        address: "Tầng 2, Tòa nhà Dali Tower, số 24C đường Phan Đăng Lưu, Phường 6, Quận Bình Thạnh, TP. Hồ Chí Minh",
    },
    {
        id: "fukuoka",
        label: "Cơ sở Fukuoka:",
        address: "Phòng 417, Tầng 4, Tòa nhà Tokan Fukuoka số 2, số 1-18 Hie-machi, quận Hakata, Fukuoka",
    },
];

const PRODUCT_GROUPS = [
    {
        title: "Hợp tác đào tạo Đại học",
        items: [
            "Kỹ Sư Công nghệ thông tin (PTIT x Rikkeisoft)",
            "Cử nhân Quản trị Kinh doanh - Định hướng Kinh doanh số (PTIT x Rikkeisoft)",
            "Chương trình đào tạo Data Analysis (HUST x Rikkeisoft)",
            "Chương trình đào tạo Lập trình Nhúng giảng dạy bởi Trường Điện – Điện Tử (ĐHBKHN) x Rikkeisoft",
        ],
    },
    {
        title: "Hợp tác đào tạo Đại học",
        items: ["Chương trình Đào tạo IT TSUBASA", "Chương trình Đào tạo Java Backend Full-Skill"],
    },
    {
        title: "Du học & Việc làm Nhật Bản",
        items: ["Du học Rikkei Academy", "Cung ứng nhân lực Nhật Bản"],
    },
];

const EXTRA_GROUPS = [
    {
        title: "Tiếng Nhật",
        items: ["JLPT", "IT TALK", "Đào tạo Doanh nghiệp"],
    },
    {
        title: "Hệ sinh thái EdTech",
        items: ["Internship One Connect", "Khảo thí chất lượng đào tạo", "Rikkei Edu LMS"],
    },
];

export function MainFooter() {
    return (
        <footer className="w-full bg-[#faf7f5] px-6 py-12 font-sans text-[#2d2c2c] sm:px-10 lg:px-12 lg:py-14">
            <div className="mx-auto max-w-[1400px]">
                {/* 1. Brand Row */}
                <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row">
                    <div className="flex max-w-[520px] flex-col gap-4">
                        <Image src="/images/footer/image.png" alt="Rikkei Edu" width={168} height={48} className="h-auto w-[168px] object-contain" priority />
                        <h2 className="text-[24px] leading-[1.35] font-bold tracking-[-0.02em] text-[#2d2c2c] sm:text-[28px]">
                            Tổ chức Giáo dục & Phát triển Nhân lực quốc tế
                        </h2>
                    </div>

                    {/* Social Media Links (4 Round Navy Circles) */}
                    <div className="flex shrink-0 items-center gap-3 pt-2">
                        {/* Facebook */}
                        <a
                            href="https://www.facebook.com/rikkeiacademy"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f3f63] text-white transition-opacity hover:opacity-90"
                        >
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/company/rikkeisoft"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f3f63] text-white transition-opacity hover:opacity-90"
                        >
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>

                        {/* TikTok */}
                        <a
                            href="https://www.tiktok.com/@rikkeiacademy"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f3f63] text-white transition-opacity hover:opacity-90"
                        >
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.02 3.32-1.51 3.35-3.33.05-3.83.02-7.66.03-11.49 0-.25-.01-.5-.03-.75z" />
                            </svg>
                        </a>

                        {/* YouTube */}
                        <a
                            href="https://www.youtube.com/@RikkeiAcademy"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f3f63] text-white transition-opacity hover:opacity-90"
                        >
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* 2. Grid Columns (minmax(280px, 1.1fr) minmax(280px, 1.2fr) minmax(220px, 0.8fr)) */}
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.1fr_1.2fr_0.8fr]">
                    {/* Column 1: THÔNG TIN LIÊN HỆ */}
                    <section className="space-y-5">
                        <h3 className="mb-5 text-[14px] font-semibold text-[#848484]">Thông tin liên hệ</h3>

                        <ul className="space-y-4">
                            {OFFICES.map((office) => (
                                <li key={office.id} className="flex items-start gap-2.5">
                                    <Image
                                        src="/images/footer/Featured local.png"
                                        alt=""
                                        width={18}
                                        height={18}
                                        className="mt-0.5 h-[18px] w-[18px] shrink-0 object-contain"
                                    />
                                    <div>
                                        <p className="mb-1 text-[14px] leading-[20px] font-bold text-[#2d2c2c]">{office.label}</p>
                                        <p className="text-[14px] leading-[22px] font-normal text-[#4a4a4a]">{office.address}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Hotline & Email Row */}
                        <div className="mt-7 grid grid-cols-1 gap-6 border-t border-black/6 pt-6 sm:grid-cols-2">
                            <div>
                                <p className="mb-2.5 text-[13px] font-semibold text-[#848484]">Số điện thoại</p>
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/images/footer/Featured icon2.png"
                                        alt=""
                                        width={18}
                                        height={18}
                                        className="h-[18px] w-[18px] shrink-0 object-contain"
                                    />
                                    <a href="tel:0862069233" className="text-[14px] font-semibold text-[#2d2c2c] transition-colors hover:text-[#ab1f24]">
                                        0862 069 233
                                    </a>
                                </div>
                            </div>

                            <div>
                                <p className="mb-2.5 text-[13px] font-semibold text-[#848484]">Email</p>
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/images/footer/Featured icon3.png"
                                        alt=""
                                        width={18}
                                        height={18}
                                        className="h-[18px] w-[18px] shrink-0 object-contain"
                                    />
                                    <a
                                        href="mailto:academy@rikkeisoft.com"
                                        className="text-[14px] font-semibold text-[#2d2c2c] transition-colors hover:text-[#ab1f24]"
                                    >
                                        academy@rikkeisoft.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Column 2: SẢN PHẨM & DỊCH VỤ */}
                    <section className="space-y-6">
                        <h3 className="mb-5 text-[14px] font-semibold text-[#848484]">Sản phẩm & Dịch vụ</h3>

                        {PRODUCT_GROUPS.map((group, index) => (
                            <div key={index} className="mb-6 space-y-3">
                                <h4 className="text-[15px] leading-[22px] font-bold text-[#1b2f4b]">{group.title}</h4>
                                <ul className="space-y-2.5">
                                    {group.items.map((item, itemIdx) => (
                                        <li key={itemIdx} className="text-[14px] leading-[22px] font-normal text-[#4a4a4a]">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    {/* Column 3: HỆ SINH THÁI */}
                    <section className="space-y-6">
                        {EXTRA_GROUPS.map((group, index) => (
                            <div key={index} className="mb-6 space-y-3">
                                <h4 className="text-[15px] leading-[22px] font-bold text-[#1b2f4b]">{group.title}</h4>
                                <ul className="space-y-2.5">
                                    {group.items.map((item, itemIdx) => (
                                        <li key={itemIdx} className="text-[14px] leading-[22px] font-normal text-[#4a4a4a]">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </footer>
    );
}
