import { useState } from "react";

const moodMap = {
    Good: { icon: "😊", color: "var(--green)", bg: "var(--green-dim)" },
    Okay: { icon: "😐", color: "var(--yellow)", bg: "var(--yellow-dim)" },
    Tired: { icon: "😴", color: "var(--red)", bg: "var(--red-dim)" },
};
const goalLabel = {
    weightloss: "Weight Loss",
    muscle: "Muscle Gain",
    fitness: "General Fitness",
};
const goalIcon = { weightloss: "🔥", muscle: "💪", fitness: "⚡" };

export default function Dashboard({ user, todayLog, onLogUpdate, onReset }) {
    const [editSteps, setEditSteps] = useState(false);
    const [stepsInput, setStepsInput] = useState(todayLog.steps);
    const mood = moodMap[todayLog.mood];
    const progress = Math.min((todayLog.steps / 8000) * 100, 100);

    const handleStepsSubmit = () => {
        onLogUpdate({
            ...todayLog,
            steps: Number(stepsInput),
            calories: Math.round(Number(stepsInput) * 0.06),
        });
        setEditSteps(false);
    };

    const setMood = (m) => onLogUpdate({ ...todayLog, mood: m });

    return (
        <div style={{ padding: "0 20px" }}>
            {/* Top bar */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "52px 0 24px",
                }}
            >
                <div>
                    <p style={{ fontSize: 13, color: "var(--text2)" }}>
                        Good morning,
                    </p>
                    <h1
                        style={{
                            fontFamily: "var(--font-head)",
                            fontSize: 26,
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {user.name} ✌️
                    </h1>
                </div>
                <button
                    onClick={onReset}
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "50%",
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        cursor: "pointer",
                        color: "var(--text2)",
                    }}
                >
                    👤
                </button>
            </div>

            {/* Goal badge */}
            <div style={{ marginBottom: 20 }}>
                <span
                    className="chip"
                    style={{
                        background: "rgba(124,109,250,0.12)",
                        color: "var(--accent2)",
                        border: "1px solid rgba(124,109,250,0.25)",
                    }}
                >
                    {goalIcon[user.goal]} {goalLabel[user.goal]} · {user.level}
                </span>
            </div>

            {/* Steps hero card */}
            <div
                className="card"
                style={{
                    background:
                        "linear-gradient(135deg, #1e1e2e 0%, #16162a 100%)",
                    border: "1px solid var(--border2)",
                    marginBottom: 16,
                    position: "relative",
                    overflow: "hidden",
                    animation: "fadeUp 0.4s ease",
                }}
            >
                {/* Decorative ring */}
                <div
                    style={{
                        position: "absolute",
                        right: -30,
                        top: -30,
                        width: 160,
                        height: 160,
                        borderRadius: "50%",
                        border: "30px solid rgba(124,109,250,0.07)",
                    }}
                />
                <div style={{ position: "relative" }}>
                    <p
                        style={{
                            fontSize: 12,
                            color: "var(--text2)",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: 8,
                        }}
                    >
                        Today's Steps
                    </p>
                    {editSteps ? (
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                marginBottom: 12,
                            }}
                        >
                            <input
                                className="input"
                                type="number"
                                value={stepsInput}
                                onChange={(e) => setStepsInput(e.target.value)}
                                style={{
                                    width: 120,
                                    fontSize: 24,
                                    fontFamily: "var(--font-head)",
                                    fontWeight: 700,
                                }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleStepsSubmit}
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "baseline",
                                gap: 8,
                                marginBottom: 12,
                            }}
                        >
                            <span
                                className="metric-val"
                                style={{
                                    fontSize: 48,
                                    color: "var(--accent2)",
                                }}
                            >
                                {todayLog.steps.toLocaleString()}
                            </span>
                            <span
                                style={{ color: "var(--text2)", fontSize: 14 }}
                            >
                                / 8,000 steps
                            </span>
                            <button
                                onClick={() => setEditSteps(true)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: 16,
                                    marginLeft: 4,
                                }}
                            >
                                ✏️
                            </button>
                        </div>
                    )}
                    {/* Progress bar */}
                    <div
                        style={{
                            height: 6,
                            background: "var(--border)",
                            borderRadius: 4,
                            overflow: "hidden",
                            marginBottom: 16,
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: `${progress}%`,
                                background:
                                    "linear-gradient(90deg, var(--accent), var(--accent2))",
                                borderRadius: 4,
                                transition:
                                    "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                            }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                        <div>
                            <div
                                style={{
                                    fontFamily: "var(--font-head)",
                                    fontWeight: 700,
                                    fontSize: 20,
                                }}
                            >
                                {todayLog.calories}
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "var(--text2)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                kcal burned
                            </div>
                        </div>
                        <div
                            style={{ width: 1, background: "var(--border)" }}
                        />
                        <div>
                            <div
                                style={{
                                    fontFamily: "var(--font-head)",
                                    fontWeight: 700,
                                    fontSize: 20,
                                }}
                            >
                                {Math.round(progress)}%
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "var(--text2)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                goal reached
                            </div>
                        </div>
                        <div
                            style={{ width: 1, background: "var(--border)" }}
                        />
                        <div>
                            <div
                                style={{
                                    fontFamily: "var(--font-head)",
                                    fontWeight: 700,
                                    fontSize: 20,
                                }}
                            >
                                {todayLog.workout ? "✅" : "⬜"}
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "var(--text2)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                workout
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mood row */}
            <div
                className="card card-sm"
                style={{
                    marginBottom: 16,
                    animation: "fadeUp 0.4s ease 0.1s both",
                }}
            >
                <p
                    style={{
                        fontSize: 12,
                        color: "var(--text2)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 10,
                    }}
                >
                    How are you feeling?
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                    {Object.entries(moodMap).map(([m, info]) => (
                        <button
                            key={m}
                            onClick={() => setMood(m)}
                            style={{
                                flex: 1,
                                padding: "10px 8px",
                                borderRadius: "var(--radius-sm)",
                                border: `1.5px solid ${todayLog.mood === m ? info.color : "var(--border)"}`,
                                background:
                                    todayLog.mood === m
                                        ? info.bg
                                        : "var(--bg3)",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 4,
                                transition: "all 0.2s",
                            }}
                        >
                            <span style={{ fontSize: 22 }}>{info.icon}</span>
                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color:
                                        todayLog.mood === m
                                            ? info.color
                                            : "var(--text2)",
                                }}
                            >
                                {m}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick stats grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 24,
                    animation: "fadeUp 0.4s ease 0.2s both",
                }}
            >
                {[
                    {
                        label: "Energy",
                        val: todayLog.energy,
                        icon: "⚡",
                        color: "var(--yellow)",
                    },
                    {
                        label: "Today's Meal",
                        val: todayLog.meal || "Not logged",
                        icon: "🥗",
                        color: "var(--green)",
                    },
                ].map((s) => (
                    <div key={s.label} className="card card-sm">
                        <div style={{ fontSize: 20, marginBottom: 6 }}>
                            {s.icon}
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-head)",
                                fontWeight: 600,
                                fontSize: 14,
                                color: s.color,
                                marginBottom: 2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {s.val}
                        </div>
                        <div
                            style={{
                                fontSize: 11,
                                color: "var(--text2)",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }}
                        >
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
