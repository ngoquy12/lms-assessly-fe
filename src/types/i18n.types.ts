import type vi from "@/messages/vi.json";

export type Messages = typeof vi;

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntlMessages extends Messages {}
}
