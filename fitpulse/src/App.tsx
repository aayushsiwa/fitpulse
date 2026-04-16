import { useState, useEffect } from "react";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import ActivityLog from "./components/ActivityLog";
import Schedule from "./components/Schedule";
import Visualizations from "./components/Visualizations";
import Notifications from "./components/Notifications";
import NavBar from "./components/NavBar";
import "./index.css";

export default function App() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [logs, setLogs] = useState([
        {
            date: "2025-04-10",
            steps: 6200,
            calories: 420,
            mood: "Good",
            workout: true,
            energy: "High",
            meal: "Oats, chicken rice, salad",
        },
        {
            date: "2025-04-11",
            steps: 4800,
            calories: 310,
            mood: "Okay",
            workout: false,
            energy: "Medium",
            meal: "Toast, pasta",
        },
        {
            date: "2025-04-12",
            steps: 8100,
            calories: 530,
            mood: "Good",
            workout: true,
            energy: "High",
            meal: "Eggs, grilled fish, veggies",
        },
        {
            date: "2025-04-13",
            steps: 3200,
            calories: 210,
            mood: "Tired",
            workout: false,
            energy: "Low",
            meal: "Cereal, soup",
        },
        {
            date: "2025-04-14",
            steps: 7600,
            calories: 490,
            mood: "Good",
            workout: true,
            energy: "Medium",
            meal: "Smoothie, rice bowl",
        },
        {
            date: "2025-04-15",
            steps: 5100,
            calories: 360,
            mood: "Okay",
            workout: false,
            energy: "Medium",
            meal: "Sandwich, fruit",
        },
        {
            date: "2025-04-16",
            steps: 2800,
            calories: 190,
            mood: "Tired",
            workout: false,
            energy: "Low",
            meal: "",
        },
    ]);
    const [todayLog, setTodayLog] = useState({
        steps: 2800,
        calories: 190,
        mood: "Tired",
        workout: false,
        energy: "Low",
        meal: "",
    });

    useEffect(() => {
        const saved = localStorage.getItem("fitpulse_user");
        if (saved) setUser(JSON.parse(saved));
    }, []);

    const handleOnboard = (userData) => {
        localStorage.setItem("fitpulse_user", JSON.stringify(userData));
        setUser(userData);
    };

    const handleReset = () => {
        localStorage.removeItem("fitpulse_user");
        setUser(null);
        setActiveTab("dashboard");
    };

    const handleLogUpdate = (newLog) => {
        setTodayLog(newLog);
        const today = "2025-04-16";
        setLogs((prev) => {
            const existing = prev.findIndex((l) => l.date === today);
            const entry = { date: today, ...newLog };
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = entry;
                return updated;
            }
            return [...prev, entry];
        });
    };

    if (!user) return <Onboarding onComplete={handleOnboard} />;

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
                    />
                )}
                {activeTab === "schedule" && <Schedule user={user} />}
                {activeTab === "insights" && <Visualizations logs={logs} />}
            </div>
            <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}
