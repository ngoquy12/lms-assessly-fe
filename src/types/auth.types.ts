import type { UserProfile } from "@/types/user.types";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthSession {
    token: string;
    user: UserProfile;
}
