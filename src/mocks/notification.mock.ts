import seed from "@/mocks/shared/assessment-seed.json";

export type NotificationType = "all" | "unread" | "exam" | "interview" | "competency" | "toeic" | "system";

export interface SystemNotificationItem {
    id: string;
    title: string;
    description: string;
    category: "exam" | "interview" | "competency" | "toeic" | "system";
    categoryLabel: string;
    createdAt: string;
    timestamp: string;
    isRead: boolean;
    href: string;
    actionLabel?: string;
    priority?: "high" | "normal" | "low";
}

export const MOCK_NOTIFICATIONS_LIST: SystemNotificationItem[] = seed.candidate.notifications as unknown as SystemNotificationItem[];
