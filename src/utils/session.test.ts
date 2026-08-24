import Cookies from "js-cookie";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_DAYS } from "@/constants/auth.constants";
import { clearSessionToken, getSessionToken, setSessionToken } from "@/utils/session";

vi.mock("js-cookie", () => ({ default: { get: vi.fn(), set: vi.fn(), remove: vi.fn() } }));

describe("session utils", () => {
    beforeEach(() => vi.clearAllMocks());

    it("setSessionToken writes the cookie with the configured name and options", () => {
        setSessionToken("tok-123");
        expect(Cookies.set).toHaveBeenCalledWith(SESSION_COOKIE_NAME, "tok-123", { expires: SESSION_MAX_AGE_DAYS, sameSite: "lax", path: "/" });
    });

    it("getSessionToken reads the cookie by name", () => {
        (Cookies.get as unknown as ReturnType<typeof vi.fn>).mockReturnValue("abc");
        expect(getSessionToken()).toBe("abc");
        expect(Cookies.get).toHaveBeenCalledWith(SESSION_COOKIE_NAME);
    });

    it("clearSessionToken removes the cookie", () => {
        clearSessionToken();
        expect(Cookies.remove).toHaveBeenCalledWith(SESSION_COOKIE_NAME, { path: "/" });
    });
});
