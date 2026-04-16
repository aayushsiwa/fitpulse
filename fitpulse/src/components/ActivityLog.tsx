import { useState } from "react";
import { saveLog } from "../api";

export default function ActivityLog({ todayLog, onLogUpdate, userId: _userId }) {
    const [local, setLocal] = useState({ ...todayLog });
    const [saved, setSaved] = useState(false);

    const set = (k, v) => {
        setLocal((f) => ({ ...f, [k]: v }));
        setSaved(false);
    };

    const [syncing, setSyncing] = useState(false);

    const handleSave = async () => {
        const calories = Math.round(local.steps * 0.06);
        const logData = { ...local, calories };

        // Update local state
        onLogUpdate(logData);

        // Sync to backend
        setSyncing(true);
        try {
            await saveLog({
                user_id: _userId,
                date: new Date().toISOString().slice(0, 10),
                steps: local.steps,
                workout_done: local.workout,
                energy_level: local.energy,
                mood: local.mood,
            });
            setSaved(true);
        } catch (err) {
            console.error("Sync failed:", err);
        } finally {
            setSyncing(false);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    return (
        <div style={{ padding: "52px 20px 24px" }}>
            <h2 className="section-title" style={{ marginBottom: 4 }}>
                Daily Check-in
            </h2>
            <p className="section-sub" style={{ marginBottom: 28 }}>
                Log today's activity & health
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Steps */}
                <div className="card">
                    <label className="label">👟 Steps Today</label>
                    <input
                        className="input"
                        type="number"
                        value={local.steps}
                        onChange={(e) => set("steps", Number(e.target.value))}
                        placeholder="e.g. 5000"
                    />
                    <p
                        style={{
                            fontSize: 12,
                            color: "var(--text2)",
                            marginTop: 6,
                        }}
                    >
                        ≈ {Math.round(local.steps * 0.06)} kcal burned
                    </p>
                </div>

                {/* Workout */}
                <div className="card">
                    <label className="label">🏋️ Workout Done?</label>
                    <div className="toggle-group">
                        {["Yes", "No"].map((v) => (
                            <button
                                key={v}
                                className={`toggle-btn ${(local.workout ? "Yes" : "No") === v ? "active" : ""}`}
                                onClick={() => set("workout", v === "Yes")}
                            >
                                {v === "Yes" ? "✅ Yes" : "❌ No"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Energy */}
                <div className="card">
                    <label className="label">⚡ Energy Level</label>
                    <div className="pill-group">
                        {["Low", "Medium", "High"].map((v) => (
                            <button
                                key={v}
                                className={`pill ${local.energy === v ? "active" : ""}`}
                                onClick={() => set("energy", v)}
                            >
                                {v === "Low"
                                    ? "🪫"
                                    : v === "Medium"
                                      ? "🔋"
                                      : "⚡"}{" "}
                                {v}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mood */}
                <div className="card">
                    <label className="label">😊 Mood</label>
                    <div className="pill-group">
                        {[
                            { v: "Good", e: "😊" },
                            { v: "Okay", e: "😐" },
                            { v: "Tired", e: "😴" },
                        ].map(({ v, e }) => (
                            <button
                                key={v}
                                className={`pill ${local.mood === v ? "active" : ""}`}
                                onClick={() => set("mood", v)}
                            >
                                {e} {v}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Meal */}
                <div className="card">
                    <label className="label">🥗 Meal Log (optional)</label>
                    <textarea
                        className="input"
                        rows={3}
                        placeholder="e.g. Oats for breakfast, grilled chicken for lunch..."
                        value={local.meal}
                        onChange={(e) => set("meal", e.target.value)}
                        style={{ resize: "none", lineHeight: 1.5 }}
                    />
                </div>

                <button
                    className="btn btn-primary btn-full btn-lg"
                    onClick={handleSave}
                    disabled={syncing}
                    style={{
                        background: saved ? "var(--green)" : undefined,
                        opacity: syncing ? 0.7 : 1,
                        transition: "background 0.3s",
                    }}
                >
                    {syncing ? "⌛ Syncing..." : saved ? "✅ Saved!" : "Save Check-in"}
                </button>
            </div>
        </div>
    );
}
