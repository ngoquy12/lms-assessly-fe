import { QueryClient } from "@tanstack/react-query";

const DEFAULT_STALE_TIME_MS = 60_000;
const DEFAULT_QUERY_RETRY = 1;

export function makeQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: DEFAULT_STALE_TIME_MS,
                retry: DEFAULT_QUERY_RETRY,
                refetchOnWindowFocus: false,
            },
        },
    });
}
