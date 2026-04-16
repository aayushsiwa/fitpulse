import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import ActivityLog from "./components/ActivityLog";
import Schedule from "./components/Schedule";
import Visualizations from "./components/Visualizations";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import NavBar from "./components/NavBar";
import { onboardUser, saveLog, getLogs, fetchMe } from "./api";
import type { LogEntry } from "./api";
import "./index.css";

const today = new Date().toISOString().slice(0, 10);

interface StoredUser {
    id: string;
    name: string;
    email: string;
    age?: string;
    gender?: string;
    level?: string;
    goal?: string;
    height?: string;
    weight?: string;
    target_weight?: string;
    is_onboarded: boolean;
}

const calorieRates: Record<string, number> = { HIIT: 12, Cardio: 10, Strength: 8, Yoga: 4 };

export const calculateCalories = (steps: number, workoutType?: string, duration?: number) => {
    const stepCals = Math.round((steps || 0) * 0.05);
    const workoutCals = workoutType && duration ? (calorieRates[workoutType] || 6) * duration : 0;
    return stepCals + workoutCals;
};

export default function App() {
    const [token, setToken] = useState<string | null>(localStorage.getItem("apmhos_token"));
    const [user, setUser] = useState<StoredUser | null>(null);
    const [authMode, setAuthMode] = useState<"login" | "signup">("login");
    const [activeTab, setActiveTab] = useState("dashboard");
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [onboarding, setOnboarding] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [todayLog, setTodayLog] = useState({
        steps: 0,
        calories: 0,
        workout: false,
        energy: "Medium",
        meal: "",
        workout_type: "",
        workout_duration: 0,
        weight: 0,
    });

    // ── Session Recovery ──────────────────────────────────────────────────────
    useEffect(() => {
        const savedUser = localStorage.getItem("apmhos_user");
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        } else if (token && !user && !userLoading) {
            // Token exists but no user (e.g. refresh), fetch it
            setUserLoading(true);
            fetchMe()
                .then(u => {
                    const stored: StoredUser = {
                        id: u.id,
                        name: u.name,
                        email: u.email,
                        is_onboarded: u.is_onboarded,
                        age: u.age?.toString(),
                        gender: u.gender,
                        level: u.fitness_level,
                        goal: u.goal,
                        height: u.height?.toString(),
                        weight: u.weight?.toString(),
                        target_weight: u.target_weight?.toString()
                    };
                    setUser(stored);
                    localStorage.setItem("apmhos_user", JSON.stringify(stored));
                })
                .catch(handleLogout)
                .finally(() => setUserLoading(false));
        }
    }, [token]);

    // Lock scroll when profile is open
    useEffect(() => {
        if (showProfile) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [showProfile]);

    // ── Hydrate logs & user detail ────────────────────────────────────────────
    useEffect(() => {
        if (!user?.id || !token) return;
        
        setLogsLoading(true);
        Promise.all([
            getLogs(user.id),
            fetchMe()
        ])
        .then(([fetchedLogs, userDetail]) => {
            setLogs(fetchedLogs);
            
            // Sync user detail (in case it changed on server)
            const updatedUser: StoredUser = {
                ...user,
                age: userDetail.age?.toString(),
                gender: userDetail.gender,
                level: userDetail.fitness_level,
                goal: userDetail.goal,
                height: userDetail.height?.toString(),
                weight: userDetail.weight?.toString(),
                target_weight: userDetail.target_weight?.toString(),
                is_onboarded: userDetail.is_onboarded
            };
            setUser(updatedUser);
            localStorage.setItem("apmhos_user", JSON.stringify(updatedUser));

            const todayEntry = fetchedLogs.find((l) => l.date === today);
            if (todayEntry) {
                setTodayLog({
                    steps: todayEntry.steps,
                    calories: todayEntry.calories,
                    workout: todayEntry.workout,
                    energy: todayEntry.energy,
                    meal: "",
                    workout_type: todayEntry.workout_type || "",
                    workout_duration: todayEntry.workout_duration || 0,
                    weight: todayEntry.weight || Number(userDetail.weight) || 0,
                });
            } else {
                // Initialize today's weight from user profile
                setTodayLog(prev => ({ ...prev, weight: Number(userDetail.weight) || 0 }));
            }
        })
        .catch(console.error)
        .finally(() => setLogsLoading(false));
    }, [user?.id, token]);

    // ── Auth Handlers ─────────────────────────────────────────────────────────
    const handleAuthSuccess = (newToken: string) => {
        localStorage.setItem("apmhos_token", newToken);
        setToken(newToken);
        
        // Since fetchMe is updated to use headers, we just call it.
        setUserLoading(true);
        fetchMe()
            .then(u => {
                const stored: StoredUser = {
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    is_onboarded: u.is_onboarded,
                    age: u.age?.toString(),
                    gender: u.gender,
                    level: u.fitness_level,
                    goal: u.goal,
                    height: u.height?.toString(),
                    weight: u.weight?.toString(),
                    target_weight: u.target_weight?.toString()
                };
                setUser(stored);
                localStorage.setItem("apmhos_user", JSON.stringify(stored));
            })
            .catch(handleLogout)
            .finally(() => setUserLoading(false));
    };

    const handleLogout = () => {
        localStorage.removeItem("apmhos_token");
        localStorage.removeItem("apmhos_user");
        setToken(null);
        setUser(null);
        setLogs([]);
        setShowProfile(false);
    };

    // ── Onboarding complete ───────────────────────────────────────────────────
    const handleOnboard = async (formData: any) => {
        if (!user?.id) return;
        setOnboarding(true);
        try {
            await onboardUser(user.id, {
                name: user.name,
                age: Number(formData.age),
                gender: formData.gender,
                fitness_level: formData.level,
                goal: formData.goal,
                height: Number(formData.height),
                weight: Number(formData.weight),
                target_weight: formData.target_weight ? Number(formData.target_weight) : undefined,
            });
            
            const userData: StoredUser = {
                ...user,
                ...formData,
                is_onboarded: true
            };
            localStorage.setItem("apmhos_user", JSON.stringify(userData));
            setUser(userData);
        } catch (err) {
            console.error("Onboarding failed:", err);
            alert("Could not update health profile.");
        } finally {
            setOnboarding(false);
        }
    };

    // ── Log update ────────────────────────────────────────────────────────────
    const handleLogUpdate = (newLog: any) => {
        const cals = calculateCalories(
            newLog.steps, 
            newLog.workout_type || todayLog.workout_type, 
            newLog.workout_duration || todayLog.workout_duration
        );
        
        const fullLog = { ...newLog, calories: cals };
        setTodayLog(fullLog);

        setLogs((prev) => {
            const existing = prev.findIndex((l) => l.date === today);
            const entry: LogEntry = { date: today, ...fullLog };
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = entry;
                return updated;
            }
            return [...prev, entry];
        });

        if (user?.id) {
            if (fullLog.weight && fullLog.weight !== Number(user.weight)) {
                const updatedUser = { ...user, weight: fullLog.weight.toString() };
                setUser(updatedUser);
                localStorage.setItem("apmhos_user", JSON.stringify(updatedUser));
            }

            saveLog({
                user_id: user.id,
                date: today,
                steps: fullLog.steps,
                workout_done: fullLog.workout,
                workout_type: fullLog.workout_type,
                workout_duration: fullLog.workout_duration,
                energy_level: fullLog.energy,
                meal: fullLog.meal,
                weight: fullLog.weight,
                is_delta: false,
            }).catch(console.error);
        }
    };

    // Conditional Rendering
    if (!token) {
        return authMode === "login" ? (
            <Login onLoginSuccess={handleAuthSuccess} onToggleSignup={() => setAuthMode("signup")} />
        ) : (
            <Signup onSignupSuccess={handleAuthSuccess} onToggleLogin={() => setAuthMode("login")} />
        );
    }

    if (userLoading || (token && !user)) {
        return (
            <div className="onboarding-screen">
                <div style={{ textAlign: "center" }}>
                    <div className="loading-spinner" style={{ marginBottom: 16 }}></div>
                    <p style={{ color: "var(--text2)", fontSize: 14 }}>Initializing your profile...</p>
                </div>
            </div>
        );
    }

    if (user && !user.is_onboarded) {
        return <Onboarding onComplete={handleOnboard} isLoading={onboarding} />;
    }

    return (
        <div className="app">
            <Notifications />
            {showProfile && user && (
                <Profile 
                    user={user} 
                    onLogout={handleLogout} 
                    onClose={() => setShowProfile(false)} 
                />
            )}
            <div className="app-content">
                {activeTab === "dashboard" && user && (
                    <Dashboard
                        user={user}
                        todayLog={todayLog}
                        onLogUpdate={handleLogUpdate}
                        onReset={() => setShowProfile(true)}
                    />
                )}
                {activeTab === "activity" && user && (
                    <ActivityLog
                        todayLog={todayLog}
                        onLogUpdate={handleLogUpdate}
                        userId={user.id}
                    />
                )}
                {activeTab === "schedule" && user && (
                    <Schedule user={user} />
                )}
                {activeTab === "insights" && user && (
                    <Visualizations
                        logs={logs}
                        user={user as any}
                        isLoading={logsLoading}
                    />
                )}
            </div>
            <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}
