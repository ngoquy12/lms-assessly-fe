import Cookies from "js-cookie";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_DAYS } from "@/constants/auth.constants";

export function getSessionToken(): string | undefined {
    return Cookies.get(SESSION_COOKIE_NAME);
}

export function setSessionToken(token: string): void {
    Cookies.set(SESSION_COOKIE_NAME, token, { expires: SESSION_MAX_AGE_DAYS, sameSite: "lax", path: "/" });
}

export function clearSessionToken(): void {
    Cookies.remove(SESSION_COOKIE_NAME, { path: "/" });
}
