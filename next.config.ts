import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
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
};

export default nextConfig;
