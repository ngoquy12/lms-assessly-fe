import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PROTECTED_PATH_PREFIXES, SESSION_COOKIE_NAME } from "@/constants/auth.constants";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtected = PROTECTED_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));

    if (isProtected && !request.cookies.get(SESSION_COOKIE_NAME)) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)"],
};
