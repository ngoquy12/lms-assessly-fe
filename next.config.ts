import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
    // KHÔNG đặt output:"standalone" khi deploy Vercel — Vercel tự xử lý output; để
    // standalone sẽ thiếu .next/next-server.js.nft.json → bước onBuildComplete của
    // Vercel lỗi ENOENT. Nếu sau này cần build Docker/VPS self-host thì thêm lại:
    //   output: "standalone",
    reactStrictMode: true,
    poweredByHeader: false,
    typedRoutes: true,
    experimental: {},
    transpilePackages: ["tiptap-markdown"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.youtube.com",
            },
            {
                protocol: "https",
                hostname: "www.figma.com",
                pathname: "/api/**",
            },
            {
                protocol: "http",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "placehold.co",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3845",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5000",
            },
            {
                protocol: "https",
                hostname: "rikkeiedu-storage.s3.ap-southeast-2.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    // camera/microphone left enabled for same-origin: ai-interview (check-device, voice-interview) is an intended WebRTC feature.
                    { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=()" },
                ],
            },
        ];
    },
};

export default withNextIntl(nextConfig);
