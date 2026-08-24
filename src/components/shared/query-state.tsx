import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/constants/ui-text.constants";

interface QueryStateBoundaryProps {
    isLoading: boolean;
    isError: boolean;
    onRetry?: () => void;
    children: React.ReactNode;
}

export function QueryStateBoundary({ isLoading, isError, onRetry, children }: QueryStateBoundaryProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{UI_TEXT.common.loading}</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-600">
                <p>{UI_TEXT.common.genericError}</p>
                {onRetry ? (
                    <Button variant="outline" size="sm" onClick={onRetry}>
                        {UI_TEXT.common.retry}
                    </Button>
                ) : null}
            </div>
        );
    }

    return <>{children}</>;
}
