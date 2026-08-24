import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QueryStateBoundary } from "@/components/shared/query-state";
import { UI_TEXT } from "@/constants/ui-text.constants";

describe("QueryStateBoundary", () => {
    it("shows the loading state when isLoading is true", () => {
        render(
            <QueryStateBoundary isLoading isError={false}>
                <span>content</span>
            </QueryStateBoundary>,
        );
        expect(screen.getByText(UI_TEXT.common.loading)).toBeInTheDocument();
        expect(screen.queryByText("content")).not.toBeInTheDocument();
    });

    it("shows the error state and calls onRetry when the retry button is clicked", async () => {
        const onRetry = vi.fn();
        render(
            <QueryStateBoundary isLoading={false} isError onRetry={onRetry}>
                <span>content</span>
            </QueryStateBoundary>,
        );
        expect(screen.getByText(UI_TEXT.common.genericError)).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: UI_TEXT.common.retry }));
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("renders children when not loading and not error", () => {
        render(
            <QueryStateBoundary isLoading={false} isError={false}>
                <span>content</span>
            </QueryStateBoundary>,
        );
        expect(screen.getByText("content")).toBeInTheDocument();
    });
});
