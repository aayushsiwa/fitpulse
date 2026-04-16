const BASE = "http://localhost:8000";

async function request<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
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
}

export interface UserResponse extends UserPayload {
    id: string;
}

export interface LogPayload {
    user_id: string;
    date: string;       // "YYYY-MM-DD"
    steps: number;
    workout_done: boolean;
    energy_level: string;
    mood: string;
}

export interface LogEntry {
    date: string;
    steps: number;
    calories: number;
    mood: string;
    workout: boolean;
    energy: string;
}

export interface Recommendation {
    user_id: string;
    date: string;
    workout_type: string;
    intensity: string;
    duration_minutes: number;
    error?: string;
}

// ──────────────── Endpoints ────────────────

/** Register a new user. Returns the saved user including server-generated id. */
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
