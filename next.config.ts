import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
    // "standalone" cho build Docker/VPS (self-hosting). Trên Vercel (VERCEL=1) phải
    // tắt để Vercel tự xử lý output — nếu để standalone sẽ lỗi next-server.js.nft.json.
    output: process.env.VERCEL ? undefined : "standalone",
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
