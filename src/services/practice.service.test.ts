import { describe, expect, it, vi } from "vitest";
import { MOCK_PRACTICE_LIST } from "@/mocks/practice.mock";
import { getPracticeById, getPracticeList } from "@/services/practice.service";

vi.mock("@/services/mock-delay", () => ({ simulateLatency: (data: unknown) => Promise.resolve(data) }));

describe("practice.service", () => {
    it("getPracticeList returns the full mock list", async () => {
        await expect(getPracticeList()).resolves.toBe(MOCK_PRACTICE_LIST);
    });

    it("getPracticeById returns the matching item", async () => {
        const first = MOCK_PRACTICE_LIST[0]!;
        await expect(getPracticeById(first.id)).resolves.toBe(first);
    });

    it("getPracticeById returns null (not undefined) for a missing id", async () => {
        await expect(getPracticeById("khong-ton-tai")).resolves.toBeNull();
    });
});
