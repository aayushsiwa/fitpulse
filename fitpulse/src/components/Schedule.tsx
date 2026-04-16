import { useState, useEffect } from "react";
import { getRecommendation } from "../api";
import type { Recommendation } from "../api";

const schedules = {
    weightloss: [
        {
            day: "Mon",
            type: "workout",
            name: "HIIT Cardio",
            duration: "30 min",
            icon: "🔥",
            details: "Jump rope, burpees, mountain climbers",
        },
        {
            day: "Tue",
            type: "workout",
            name: "Strength Training",
            duration: "45 min",
            icon: "🏋️",
            details: "Squats, lunges, deadlifts",
        },
        {
            day: "Wed",
            type: "rest",
            name: "Active Recovery",
            duration: "20 min",
            icon: "🧘",
            details: "Yoga or light stretching",
        },
        {
            day: "Thu",
            type: "workout",
            name: "Circuit Training",
            duration: "35 min",
            icon: "⚡",
            details: "3 rounds: push-ups, rows, core",
        },
        {
            day: "Fri",
            type: "workout",
            name: "Cardio Run",
            duration: "40 min",
            icon: "🏃",
            details: "5km steady pace or intervals",
        },
        {
            day: "Sat",
            type: "workout",
            name: "Full Body",
            duration: "50 min",
            icon: "💪",
            details: "Compound movements, light weights",
        },
        {
            day: "Sun",
            type: "rest",
            name: "Rest Day",
            duration: "—",
            icon: "😴",
            details: "Complete rest & recovery",
        },
    ],
    muscle: [
        {
            day: "Mon",
            type: "workout",
            name: "Chest & Triceps",
            duration: "60 min",
            icon: "💪",
            details: "Bench press, dips, flyes",
        },
        {
            day: "Tue",
            type: "workout",
            name: "Back & Biceps",
            duration: "60 min",
            icon: "🏋️",
            details: "Pull-ups, rows, curls",
        },
        {
            day: "Wed",
            type: "rest",
            name: "Rest Day",
            duration: "—",
            icon: "😴",
            details: "Foam rolling, light walk",
        },
        {
            day: "Thu",
            type: "workout",
            name: "Legs",
            duration: "60 min",
            icon: "🦵",
            details: "Squats, leg press, RDL",
        },
        {
            day: "Fri",
            type: "workout",
            name: "Shoulders & Core",
            duration: "55 min",
            icon: "⚡",
            details: "OHP, lateral raises, planks",
        },
        {
            day: "Sat",
            type: "workout",
            name: "Arms & Abs",
            duration: "45 min",
            icon: "🔥",
            details: "Curls, skull crushers, core circuit",
        },
        {
            day: "Sun",
            type: "rest",
            name: "Rest Day",
            duration: "—",
            icon: "😴",
            details: "Complete rest & recovery",
        },
    ],
    fitness: [
        {
            day: "Mon",
            type: "workout",
            name: "Cardio",
            duration: "30 min",
            icon: "🏃",
            details: "Brisk walk, jog, or cycle",
        },
        {
            day: "Tue",
            type: "workout",
            name: "Bodyweight",
            duration: "35 min",
            icon: "💪",
            details: "Push-ups, squats, planks",
        },
        {
            day: "Wed",
            type: "rest",
            name: "Active Recovery",
            duration: "20 min",
            icon: "🧘",
            details: "Stretching or yoga",
        },
        {
            day: "Thu",
            type: "workout",
            name: "Cardio + Core",
            duration: "40 min",
            icon: "⚡",
            details: "Light run + 10 min core",
        },
        {
            day: "Fri",
            type: "workout",
            name: "Full Body",
            duration: "45 min",
            icon: "🏋️",
            details: "Mixed strength & cardio",
        },
        {
            day: "Sat",
            type: "workout",
            name: "Outdoor Activity",
            duration: "60 min",
            icon: "🌿",
            details: "Hiking, sports, or swim",
        },
        {
            day: "Sun",
            type: "rest",
            name: "Rest Day",
            duration: "—",
            icon: "😴",
            details: "Complete rest",
        },
    ],
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const today = new Date().getDay();
const todayIdx = today === 0 ? 6 : today - 1;

export default function Schedule({ user }) {
    const plan = schedules[user.goal] || schedules.fitness;
    const [rec, setRec] = useState<Recommendation | null>(null);
    const [recLoading, setRecLoading] = useState(false);

    useEffect(() => {
        if (!user?.id) return;
        setRecLoading(true);
        getRecommendation(user.id)
            .then((data) => {
                if (!data.error) setRec(data);
            })
            .catch(console.error)
            .finally(() => setRecLoading(false));
    }, [user?.id]);

    return (
        <div style={{ padding: "52px 20px 24px" }}>
            <h2 className="section-title" style={{ marginBottom: 4 }}>
                Weekly Schedule
            </h2>
            <p className="section-sub" style={{ marginBottom: 24 }}>
                Your personalized plan for{" "}
                {
                    ["Weight Loss", "Muscle Gain", "General Fitness"][
                        ["weightloss", "muscle", "fitness"].indexOf(user.goal)
                    ]
                }
            </p>

            {/* Day pills */}
            <div
                style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 20,
                    overflowX: "auto",
                    paddingBottom: 4,
                }}
            >
                {days.map((d, i) => (
                    <div
                        key={d}
                        style={{
                            minWidth: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-head)",
                            fontWeight: 700,
                            fontSize: 12,
                            background:
                                i === todayIdx
                                    ? "var(--accent)"
                                    : plan[i].type === "rest"
                                      ? "var(--bg3)"
                                      : "var(--surface2)",
                            color:
                                i === todayIdx
                                    ? "#fff"
                                    : plan[i].type === "rest"
                                      ? "var(--text2)"
                                      : "var(--text)",
                            border: `1.5px solid ${i === todayIdx ? "var(--accent)" : "var(--border)"}`,
                            flexShrink: 0,
                            boxShadow:
                                i === todayIdx
                                    ? "0 4px 16px var(--accent-glow)"
                                    : "none",
                        }}
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* AI Recommendation */}
            {(recLoading || rec) && (
                <div
                    className="card"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)",
                        border: "1.5px solid var(--accent-glow)",
                        marginBottom: 16,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            right: -20,
                            top: -20,
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            background: "var(--accent-glow)",
                            filter: "blur(40px)",
                        }}
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "var(--accent2)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                            }}
                        >
                            ✨ AI Recommendation
                        </span>
                        {recLoading && <div className="spinner-sm" />}
                    </div>
                    {rec ? (
                        <div style={{ position: "relative" }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    marginBottom: 12,
                                }}
                            >
                                <span style={{ fontSize: 32 }}>
                                    {rec.workout_type.includes("yoga")
                                        ? "🧘"
                                        : rec.workout_type.includes("HIIT")
                                          ? "⚡"
                                          : rec.workout_type.includes("cardio")
                                            ? "🏃"
                                            : "💪"}
                                </span>
                                <div>
                                    <div
                                        style={{
                                            fontFamily: "var(--font-head)",
                                            fontWeight: 700,
                                            fontSize: 20,
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {rec.workout_type}
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            fontSize: 12,
                                            color: "var(--text2)",
                                        }}
                                    >
                                        <span>⏱️ {rec.duration_minutes} min</span>
                                        <span>•</span>
                                        <span style={{ textTransform: "capitalize" }}>
                                            📊 {rec.intensity} intensity
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>
                                Based on your current <b>{rec.intensity}</b> energy level and <b>{user.goal}</b> goal, this workout is perfectly optimized for you right now.
                            </p>
                        </div>
                    ) : (
                        <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <p style={{ fontSize: 13, color: "var(--text2)" }}>Fetching best workout...</p>
                        </div>
                    )}
                </div>
            )}

            <div className="divider" style={{ margin: "24px 0" }} />

            {/* Today's highlight (Static fallback/reference) */}
            <div
                className="card"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(124,109,250,0.12), rgba(124,109,250,0.04))",
                    border: "1.5px solid rgba(124,109,250,0.3)",
                    marginBottom: 16,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <span
                        style={{
                            fontSize: 12,
                            color: "var(--accent2)",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            fontWeight: 600,
                        }}
                    >
                        Today
                    </span>
                    <span
                        className="chip"
                        style={{
                            background:
                                plan[todayIdx].type === "rest"
                                    ? "var(--red-dim)"
                                    : "var(--green-dim)",
                            color:
                                plan[todayIdx].type === "rest"
                                    ? "var(--red)"
                                    : "var(--green)",
                            fontSize: 11,
                        }}
                    >
                        {plan[todayIdx].type === "rest"
                            ? "🌙 Rest"
                            : "🏃 Active"}
                    </span>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 8,
                    }}
                >
                    <span style={{ fontSize: 36 }}>{plan[todayIdx].icon}</span>
                    <div>
                        <div
                            style={{
                                fontFamily: "var(--font-head)",
                                fontWeight: 700,
                                fontSize: 18,
                            }}
                        >
                            {plan[todayIdx].name}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text2)" }}>
                            {plan[todayIdx].duration}
                        </div>
                    </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--text2)" }}>
                    {plan[todayIdx].details}
                </p>
            </div>

            {/* All days */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.map((item, i) => (
                    <div
                        key={item.day}
                        className="card card-sm"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            opacity: i === todayIdx ? 1 : 0.7,
                            border:
                                i === todayIdx
                                    ? "1px solid rgba(124,109,250,0.3)"
                                    : "1px solid var(--border)",
                            animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
                        }}
                    >
                        <div
                            style={{
                                width: 32,
                                textAlign: "center",
                                fontFamily: "var(--font-head)",
                                fontWeight: 700,
                                fontSize: 11,
                                color:
                                    i === todayIdx
                                        ? "var(--accent2)"
                                        : "var(--text2)",
                                flexShrink: 0,
                            }}
                        >
                            {item.day}
                        </div>
                        <span style={{ fontSize: 20 }}>{item.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {item.name}
                            </div>
                            <div
                                style={{ fontSize: 12, color: "var(--text2)" }}
                            >
                                {item.details}
                            </div>
                        </div>
                        <div
                            style={{
                                fontSize: 12,
                                color: "var(--text2)",
                                flexShrink: 0,
                            }}
                        >
                            {item.duration}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
