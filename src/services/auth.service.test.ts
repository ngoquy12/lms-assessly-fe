import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_CREDENTIALS } from "@/constants/auth.constants";
import { MOCK_USER_PROFILE } from "@/mocks/user.mock";
import { getCurrentUser, login, logout } from "@/services/auth.service";
import * as session from "@/utils/session";

vi.mock("@/services/mock-delay", () => ({ simulateLatency: (data: unknown) => Promise.resolve(data) }));
vi.mock("@/utils/session", () => ({ getSessionToken: vi.fn(), setSessionToken: vi.fn(), clearSessionToken: vi.fn() }));

describe("auth.service", () => {
    beforeEach(() => vi.clearAllMocks());

    it("login with valid demo credentials returns a session and stores the token", async () => {
        const result = await login({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
        expect(result.user).toBe(MOCK_USER_PROFILE);
        expect(session.setSessionToken).toHaveBeenCalledWith(result.token);
    });

    it("login with wrong credentials throws and does not store a token", async () => {
        await expect(login({ email: "wrong@example.com", password: "nope" })).rejects.toThrow();
        expect(session.setSessionToken).not.toHaveBeenCalled();
    });

    it("getCurrentUser returns the user when a session cookie exists", async () => {
        (session.getSessionToken as unknown as ReturnType<typeof vi.fn>).mockReturnValue("tok");
        await expect(getCurrentUser()).resolves.toBe(MOCK_USER_PROFILE);
    });

    it("getCurrentUser returns null when there is no session cookie", async () => {
        (session.getSessionToken as unknown as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
        await expect(getCurrentUser()).resolves.toBeNull();
    });

    it("logout clears the session token", async () => {
        await logout();
        expect(session.clearSessionToken).toHaveBeenCalled();
    });
});
