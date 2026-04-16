import { useState, useEffect } from "react";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import ActivityLog from "./components/ActivityLog";
import Schedule from "./components/Schedule";
import Visualizations from "./components/Visualizations";
import Notifications from "./components/Notifications";
import NavBar from "./components/NavBar";
import { createUser, saveLog, getLogs } from "./api";
import type { LogEntry } from "./api";
import "./index.css";

const today = new Date().toISOString().slice(0, 10);

interface StoredUser {
    id: string;
    name: string;
    age: string;
    gender: string;
    level: string;
    goal: string;
}

export default function App() {
    const [user, setUser] = useState<StoredUser | null>(null);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [onboarding, setOnboarding] = useState(false); // spinner in Onboarding
    const [todayLog, setTodayLog] = useState({
        steps: 0,
        calories: 0,
        mood: "Good",
        workout: false,
        energy: "Medium",
        meal: "",
    });

    // ── Restore session from localStorage ──────────────────────────────────────
    useEffect(() => {
        const saved = localStorage.getItem("fitpulse_user");
        if (saved) {
            const u: StoredUser = JSON.parse(saved);
            setUser(u);
        }
    }, []);

    // ── Hydrate logs from backend whenever we have a user ─────────────────────
    useEffect(() => {
        if (!user?.id) return;
        setLogsLoading(true);
        getLogs(user.id)
            .then((fetched) => {
                setLogs(fetched);
                // Seed today's log state from the backend entry if it exists
                const todayEntry = fetched.find((l) => l.date === today);
                if (todayEntry) {
                    setTodayLog({
                        steps: todayEntry.steps,
                        calories: todayEntry.calories,
                        mood: todayEntry.mood,
                        workout: todayEntry.workout,
                        energy: todayEntry.energy,
                        meal: "",
                    });
                }
            })
            .catch(console.error)
            .finally(() => setLogsLoading(false));
    }, [user?.id]);

    // ── Onboarding complete ───────────────────────────────────────────────────
    const handleOnboard = async (formData: Omit<StoredUser, "id">) => {
        setOnboarding(true);
        try {
            const created = await createUser({
                name: formData.name,
                age: Number(formData.age),
                gender: formData.gender,
                fitness_level: formData.level,
                goal: formData.goal,
            });
            const userData: StoredUser = { ...formData, id: created.id };
            localStorage.setItem("fitpulse_user", JSON.stringify(userData));
            setUser(userData);
        } catch (err) {
            console.error("Onboarding failed:", err);
            // Fallback: save locally without a backend id
            const userData: StoredUser = { ...formData, id: crypto.randomUUID() };
            localStorage.setItem("fitpulse_user", JSON.stringify(userData));
            setUser(userData);
        } finally {
            setOnboarding(false);
        }
    };

    const handleReset = () => {
        localStorage.removeItem("fitpulse_user");
        setUser(null);
        setLogs([]);
        setActiveTab("dashboard");
    };

    // ── Log update (Dashboard quick-edit or ActivityLog save) ─────────────────
    const handleLogUpdate = (newLog: typeof todayLog) => {
        setTodayLog(newLog);

        // Optimistically update the in-memory logs list
        setLogs((prev) => {
            const existing = prev.findIndex((l) => l.date === today);
            const entry: LogEntry = { date: today, ...newLog };
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = entry;
                return updated;
            }
            return [...prev, entry];
        });

        // Persist to backend in the background
        if (user?.id) {
            saveLog({
                user_id: user.id,
                date: today,
                steps: newLog.steps,
                workout_done: newLog.workout,
                energy_level: newLog.energy,
                mood: newLog.mood,
            }).catch(console.error);
        }
    };

    if (!user)
        return (
            <Onboarding onComplete={handleOnboard} isLoading={onboarding} />
        );

    return (
        <div className="app">
            <Notifications />
            <div className="app-content">
                {activeTab === "dashboard" && (
                    <Dashboard
                        user={user}
                        todayLog={todayLog}
                        onLogUpdate={handleLogUpdate}
                        onReset={handleReset}
                    />
                )}
                {activeTab === "activity" && (
                    <ActivityLog
                        todayLog={todayLog}
                        onLogUpdate={handleLogUpdate}
                        userId={user.id}
                    />
                )}
                {activeTab === "schedule" && (
                    <Schedule user={user} />
                )}
                {activeTab === "insights" && (
                    <Visualizations
                        logs={logs}
                        isLoading={logsLoading}
                    />
                )}
            </div>
            <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}
