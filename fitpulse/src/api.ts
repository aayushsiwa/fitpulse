const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const token = localStorage.getItem("apmhos_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE}${path}`, {
        headers,
        ...options,
    });
    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`API ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
}

// ──────────────── Types ────────────────

export interface UserPayload {
    name: string;
    age: number;
    gender: string;
    fitness_level: string;
    goal: string;
    height: number;
    weight: number;
    target_weight?: number;
}

export interface UserResponse extends UserPayload {
    id: string;
    email: string;
    is_onboarded: boolean;
}

export interface LogPayload {
    user_id: string;
    date: string;       // "YYYY-MM-DD"
    steps: number;
    workout_done: boolean;
    workout_type?: string;
    workout_duration?: number;
    energy_level: string;
    meal?: string;
    weight?: number;
    is_delta?: boolean;
}

export interface LogEntry {
    date: string;
    steps: number;
    calories: number;
    workout: boolean;
    workout_type?: string;
    workout_duration?: number;
    energy: string;
    meal?: string;
    weight?: number;
}

export interface Recommendation {
    user_id: string;
    date: string;
    workout_type: string;
    intensity: string;
    duration_minutes: number;
    tip: string;
    step_goal: number;
    error?: string;
}

export interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

// ──────────────── Endpoints ────────────────

export function signup(payload: SignupPayload): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function login(payload: LoginPayload): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function fetchMe(): Promise<UserResponse> {
    return request<UserResponse>("/auth/me");
}

export function onboardUser(userId: string, payload: UserPayload): Promise<UserResponse> {
    return request<UserResponse>(`/users/${userId}/onboard`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/** Register a new user (deprecated in favor of signup + onboard). */
export function createUser(payload: UserPayload): Promise<UserResponse> {
    return request<UserResponse>("/users/", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/** Persist today's daily log. */
export function saveLog(payload: LogPayload): Promise<{ message: string }> {
    return request<{ message: string }>("/logs/", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/** Fetch up to 7 most recent logs for a user (used by Insights charts). */
export function getLogs(userId: string): Promise<LogEntry[]> {
    return request<LogEntry[]>(`/logs/${userId}`);
}

/** Get today's AI-generated workout recommendation. */
export function getRecommendation(userId: string): Promise<Recommendation> {
    return request<Recommendation>(`/recommendations/${userId}`);
}
