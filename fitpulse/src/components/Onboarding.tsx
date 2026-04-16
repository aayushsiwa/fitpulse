import { useState } from "react";

const goals = [
    {
        id: "weightloss",
        icon: "🔥",
        label: "Weight Loss",
        desc: "Burn fat, feel lighter",
    },
    {
        id: "muscle",
        icon: "💪",
        label: "Muscle Gain",
        desc: "Build strength & size",
    },
    {
        id: "fitness",
        icon: "⚡",
        label: "General Fitness",
        desc: "Stay active & healthy",
    },
];
const levels = ["Beginner", "Intermediate", "Advanced"];
const genders = ["Male", "Female", "Other"];

export default function Onboarding({ onComplete, isLoading = false }) {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        name: "",
        age: "",
        gender: "",
        level: "",
        goal: "",
    });
    const [err, setErr] = useState("");

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const next = () => {
        if (step === 0 && (!form.name || !form.age || !form.gender)) {
            setErr("Please fill all fields");
            return;
        }
        if (step === 1 && !form.level) {
            setErr("Pick your fitness level");
            return;
        }
        if (step === 2 && !form.goal) {
            setErr("Choose a goal");
            return;
        }
        setErr("");
        if (step < 2) setStep((s) => s + 1);
        else onComplete(form);
    };

    return (
        <div
            style={{
                minHeight: "100dvh",
                background: "var(--bg)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <div style={{ padding: "48px 28px 0" }}>
                <div style={{ marginBottom: 8 }}>
                    <span
                        style={{
                            fontFamily: "var(--font-head)",
                            fontSize: 28,
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                        }}
                    >
                        FIT<span style={{ color: "var(--accent)" }}>PULSE</span>
                    </span>
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            style={{
                                height: 3,
                                flex: 1,
                                borderRadius: 4,
                                background:
                                    i <= step
                                        ? "var(--accent)"
                                        : "var(--border)",
                                transition: "background 0.3s ease",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Steps */}
            <div style={{ padding: "0 28px", flex: 1 }} className="fade-up">
                {step === 0 && (
                    <>
                        <h2
                            className="section-title"
                            style={{ marginBottom: 4 }}
                        >
                            Hey there 👋
                        </h2>
                        <p className="section-sub" style={{ marginBottom: 28 }}>
                            Let's set up your profile
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                            }}
                        >
                            <div>
                                <label className="label">Your Name</label>
                                <input
                                    className="input"
                                    placeholder="e.g. Alex"
                                    value={form.name}
                                    onChange={(e) =>
                                        set("name", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="label">Age</label>
                                <input
                                    className="input"
                                    type="number"
                                    placeholder="e.g. 25"
                                    value={form.age}
                                    onChange={(e) => set("age", e.target.value)}
                                    min={10}
                                    max={99}
                                />
                            </div>
                            <div>
                                <label className="label">Gender</label>
                                <div className="pill-group">
                                    {genders.map((g) => (
                                        <button
                                            key={g}
                                            className={`pill ${form.gender === g ? "active" : ""}`}
                                            onClick={() => set("gender", g)}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {step === 1 && (
                    <>
                        <h2
                            className="section-title"
                            style={{ marginBottom: 4 }}
                        >
                            Fitness Level
                        </h2>
                        <p className="section-sub" style={{ marginBottom: 28 }}>
                            How would you describe yourself?
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                            }}
                        >
                            {levels.map((l, i) => {
                                const descs = [
                                    "Just starting out, learning the basics",
                                    "Some experience, consistent routine",
                                    "Trained regularly, pushing limits",
                                ];
                                const icons = ["🌱", "🏃", "🦅"];
                                return (
                                    <button
                                        key={l}
                                        onClick={() => set("level", l)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 16,
                                            padding: "18px 20px",
                                            borderRadius: "var(--radius)",
                                            border: `1.5px solid ${form.level === l ? "var(--accent)" : "var(--border)"}`,
                                            background:
                                                form.level === l
                                                    ? "rgba(124,109,250,0.08)"
                                                    : "var(--surface)",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            transition: "all 0.2s",
                                            boxShadow:
                                                form.level === l
                                                    ? "0 0 24px var(--accent-glow)"
                                                    : "none",
                                        }}
                                    >
                                        <span style={{ fontSize: 28 }}>
                                            {icons[i]}
                                        </span>
                                        <div>
                                            <div
                                                style={{
                                                    fontFamily:
                                                        "var(--font-head)",
                                                    fontWeight: 600,
                                                    color: "var(--text)",
                                                    fontSize: 15,
                                                }}
                                            >
                                                {l}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: "var(--text2)",
                                                    marginTop: 2,
                                                }}
                                            >
                                                {descs[i]}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2
                            className="section-title"
                            style={{ marginBottom: 4 }}
                        >
                            Your Goal
                        </h2>
                        <p className="section-sub" style={{ marginBottom: 28 }}>
                            What are you training for?
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                            }}
                        >
                            {goals.map((g) => (
                                <button
                                    key={g.id}
                                    onClick={() => set("goal", g.id)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16,
                                        padding: "20px",
                                        borderRadius: "var(--radius)",
                                        border: `1.5px solid ${form.goal === g.id ? "var(--accent)" : "var(--border)"}`,
                                        background:
                                            form.goal === g.id
                                                ? "rgba(124,109,250,0.08)"
                                                : "var(--surface)",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        transition: "all 0.2s",
                                        boxShadow:
                                            form.goal === g.id
                                                ? "0 0 24px var(--accent-glow)"
                                                : "none",
                                    }}
                                >
                                    <span style={{ fontSize: 32 }}>
                                        {g.icon}
                                    </span>
                                    <div>
                                        <div
                                            style={{
                                                fontFamily: "var(--font-head)",
                                                fontWeight: 600,
                                                color: "var(--text)",
                                                fontSize: 15,
                                            }}
                                        >
                                            {g.label}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "var(--text2)",
                                                marginTop: 2,
                                            }}
                                        >
                                            {g.desc}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {err && (
                    <p
                        style={{
                            color: "var(--red)",
                            fontSize: 13,
                            marginTop: 12,
                        }}
                    >
                        {err}
                    </p>
                )}
            </div>

            <div style={{ padding: "28px" }}>
                <button
                    className="btn btn-primary btn-full btn-lg"
                    onClick={next}
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                >
                    {step < 2
                        ? "Continue →"
                        : isLoading
                          ? "Setting up… ⏳"
                          : "Let's Go 🚀"}
                </button>
            </div>
        </div>
    );
}
