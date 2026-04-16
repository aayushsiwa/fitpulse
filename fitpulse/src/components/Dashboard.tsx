import { useState } from "react";

const goalLabel = {
    weightloss: "Weight Loss",
    muscle: "Muscle Gain",
    fitness: "General Fitness",
};
const goalIcon = { weightloss: "🔥", muscle: "💪", fitness: "⚡" };

export default function Dashboard({ user, todayLog, onLogUpdate, onReset }) {
    const [editSteps, setEditSteps] = useState(false);
    const [stepsInput, setStepsInput] = useState(todayLog.steps);
    const progress = Math.min((todayLog.steps / 8000) * 100, 100);

    const handleStepsSubmit = () => {
        onLogUpdate({
            ...todayLog,
            steps: Number(stepsInput),
        });
        setEditSteps(false);
    };

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


            {/* Quick stats grid */}
            {(() => {
                const stats = [
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
                        hidden: true
                    },
                ].filter(s => !s.hidden);

                return (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: stats.length > 1 ? "1fr 1fr" : "1fr",
                            gap: 12,
                            marginBottom: 24,
                            animation: "fadeUp 0.4s ease 0.2s both",
                        }}
                    >
                        {stats.map((s) => (
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
                );
            })()}

            {/* Weight Progress Card */}
            {user.target_weight && (
                <div 
                    className="card"
                    style={{
                        marginBottom: 24,
                        background: "linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%)",
                        border: "1px solid var(--border)",
                        animation: "fadeUp 0.4s ease 0.3s both"
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                            <p style={{ fontSize: 11, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                                Goal Progress
                            </p>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                <span style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)" }}>
                                    {user.weight}
                                </span>
                                <span style={{ fontSize: 14, color: "var(--text2)" }}>kg current</span>
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
                                {user.target_weight} <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.6 }}>kg goal</span>
                            </div>
                            <div style={{ fontSize: 12, color: "var(--accent2)", fontWeight: 600, marginTop: 4 }}>
                                {Math.abs(Number(user.weight) - Number(user.target_weight)).toFixed(1)} kg to go
                            </div>
                        </div>
                    </div>
                    
                    {/* Progress slider visually showing distance to goal */}
                    <div style={{ height: 4, background: "var(--bg3)", borderRadius: 2, marginTop: 16, position: "relative" }}>
                        <div 
                            style={{ 
                                height: "100%", 
                                width: "60%", // Static for UI mock but logic can be added
                                background: "var(--accent)", 
                                borderRadius: 2,
                                boxShadow: "0 0 10px var(--accent-glow)"
                            }} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
