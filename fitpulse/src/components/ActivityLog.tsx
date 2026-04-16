import { useState, useEffect } from "react";
import { saveLog } from "../api";

const energyOptions = [
    { label: "High", icon: "⚡", desc: "Power session ready" },
    { label: "Medium", icon: "🔋", desc: "Solid performance" },
    { label: "Low", icon: "🪫", desc: "Just showing up" },
];

const calorieRates = { HIIT: 12, Cardio: 10, Strength: 8, Yoga: 4 };

export default function ActivityLog({ todayLog, onLogUpdate, userId: _userId }) {
    const [saved, setSaved] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const [stepsData, setStepsData] = useState({ steps: 0 });
    const [weightInput, setWeightInput] = useState(todayLog.weight?.toString() || "");
    const [mealInput, setMealInput] = useState(todayLog.meal || "");

    useEffect(() => {
        if (todayLog.weight) setWeightInput(todayLog.weight.toString());
        if (todayLog.meal) setMealInput(todayLog.meal);
    }, [todayLog.weight, todayLog.meal]);

    const [workoutData, setWorkoutData] = useState({
        type: "Cardio",
        duration: 20,
        energyAfter: "Medium",
    });

    const estCalories = (calorieRates[workoutData.type] || 6) * workoutData.duration;

    const handleSaveSteps = async () => {
        if (stepsData.steps <= 0) return;
        setSyncing(true);
        try {
            await saveLog({
                user_id: _userId,
                date: new Date().toISOString().slice(0, 10),
                steps: stepsData.steps,
                workout_done: false,
                energy_level: "Medium",
                is_delta: true,
            });
            setSaved(true);
            setStepsData({ steps: 0 });
            onLogUpdate({ ...todayLog, steps: todayLog.steps + stepsData.steps });
        } catch (err) {
            console.error("Sync failed:", err);
        } finally {
            setSyncing(false);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const handleSaveWorkout = async () => {
        setSyncing(true);
        try {
            await saveLog({
                user_id: _userId,
                date: new Date().toISOString().slice(0, 10),
                steps: 0,
                workout_done: true,
                workout_type: workoutData.type,
                workout_duration: workoutData.duration,
                energy_level: workoutData.energyAfter,
                is_delta: true,
            });
            setSaved(true);
            onLogUpdate({
                ...todayLog,
                workout: true,
                workout_type: workoutData.type,
                workout_duration: workoutData.duration,
                energy: workoutData.energyAfter,
            });
        } catch (err) {
            console.error("Sync failed:", err);
        } finally {
            setSyncing(false);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const handleSaveWeight = async () => {
        if (!weightInput) return;
        setSyncing(true);
        try {
            await saveLog({
                user_id: _userId,
                date: new Date().toISOString().slice(0, 10),
                steps: 0,
                workout_done: false,
                energy_level: todayLog.energy,
                weight: Number(weightInput),
                is_delta: false,
            });
            setSaved(true);
            onLogUpdate({ ...todayLog, weight: Number(weightInput) });
        } catch (err) {
            console.error("Sync failed:", err);
        } finally {
            setSyncing(false);
            setTimeout(() => setSaved(false), 2000);
        }
    };
    const handleSaveMeal = async () => {
        if (!mealInput) return;
        setSyncing(true);
        try {
            await saveLog({
                user_id: _userId,
                date: new Date().toISOString().slice(0, 10),
                steps: 0,
                workout_done: false,
                energy_level: todayLog.energy,
                meal: mealInput,
                is_delta: false,
            });
            setSaved(true);
            onLogUpdate({ ...todayLog, meal: mealInput });
        } catch (err) {
            console.error("Sync failed:", err);
        } finally {
            setSyncing(false);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    return (
        <div style={{ padding: "52px 20px 24px" }}>
            <h2 className="section-title" style={{ marginBottom: 4 }}>Activity Log</h2>
            <p className="section-sub" style={{ marginBottom: 28 }}>Capture your movement and effort</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* ── Steps ── */}
                <div className="card" style={{ borderLeft: "4px solid var(--accent)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <label className="label" style={{ marginBottom: 0 }}>👟 Track Movement</label>
                        <span style={{ fontSize: 12, color: "var(--text2)" }}>Daily Total: {todayLog.steps}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <input
                            className="input"
                            type="number"
                            value={stepsData.steps || ""}
                            onChange={(e) => setStepsData({ steps: Number(e.target.value) })}
                            placeholder="Add steps (e.g. 2000)"
                            style={{ flex: 1 }}
                        />
                        <button className="btn btn-primary" onClick={handleSaveSteps} disabled={syncing || stepsData.steps <= 0}>
                            Add
                        </button>
                    </div>
                </div>

                {/* ── Workout ── */}
                <div className="card" style={{ borderLeft: "4px solid var(--accent2)" }}>
                    <label className="label">🏋️ Log a Workout</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {/* Type Selection */}
                        <div>
                            <span style={{ fontSize: 11, color: "var(--text2)", textTransform: "uppercase", letterSpacing: 1 }}>Workout Type</span>
                            <div className="pill-group" style={{ marginTop: 8 }}>
                                {Object.keys(calorieRates).map((t) => (
                                    <button
                                        key={t}
                                        className={`pill ${workoutData.type === t ? "active" : ""}`}
                                        onClick={() => setWorkoutData({ ...workoutData, type: t })}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration & Calories Preview */}
                        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: 11, color: "var(--text2)", textTransform: "uppercase", letterSpacing: 1 }}>Duration (min)</span>
                                <input
                                    className="input"
                                    type="number"
                                    value={workoutData.duration}
                                    onChange={(e) => setWorkoutData({ ...workoutData, duration: Number(e.target.value) })}
                                    style={{ marginTop: 8 }}
                                />
                            </div>
                            <div style={{ flex: 1, padding: "10px", background: "var(--surface2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                                <div style={{ fontSize: 10, color: "var(--text2)", textTransform: "uppercase" }}>🔥 Est. Burn</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>{estCalories} kcal</div>
                            </div>
                        </div>


                        {/* Energy Selection */}
                        <div>
                            <span style={{ fontSize: 11, color: "var(--text2)", textTransform: "uppercase", letterSpacing: 1 }}>Energy after session</span>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
                                {energyOptions.map((e) => (
                                    <button
                                        key={e.label}
                                        onClick={() => setWorkoutData({ ...workoutData, energyAfter: e.label })}
                                        style={{
                                            padding: "10px 4px",
                                            borderRadius: "var(--radius-sm)",
                                            border: `1.5px solid ${workoutData.energyAfter === e.label ? "var(--accent2)" : "var(--border)"}`,
                                            background: workoutData.energyAfter === e.label ? "rgba(124,109,250,0.1)" : "var(--surface)",
                                            cursor: "pointer",
                                            textAlign: "center"
                                        }}
                                    >
                                        <div style={{ fontSize: 20 }}>{e.icon}</div>
                                        <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4 }}>{e.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="btn btn-secondary btn-full" onClick={handleSaveWorkout} disabled={syncing}>
                            {syncing ? "⌛ Logging..." : "Complete Workout"}
                        </button>
                    </div>
                </div>

                {/* ── Weight Tracker ── */}
                <div className="card" style={{ borderLeft: "4px solid var(--yellow)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <label className="label" style={{ marginBottom: 0 }}>⚖️ Update Weight</label>
                        <span style={{ fontSize: 12, color: "var(--text2)" }}>Current: {todayLog.weight || "---"} kg</span>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <input
                            className="input"
                            type="number"
                            step="0.1"
                            value={weightInput}
                            onChange={(e) => setWeightInput(e.target.value)}
                            placeholder="Current weight (kg)"
                            style={{ flex: 1 }}
                        />
                        <button className="btn btn-secondary" onClick={handleSaveWeight} disabled={syncing || !weightInput}>
                            Sync
                        </button>
                    </div>
                </div>

                {/* ── Meal Tracker ── */}
                <div className="card" style={{ borderLeft: "4px solid var(--green)", display: "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <label className="label" style={{ marginBottom: 0 }}>🥗 Log Today's Meal</label>
                        <span style={{ fontSize: 12, color: "var(--text2)" }}>Status: {todayLog.meal ? "Logged" : "Not logged"}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <input
                            className="input"
                            type="text"
                            value={mealInput}
                            onChange={(e) => setMealInput(e.target.value)}
                            placeholder="What did you eat today?"
                            style={{ flex: 1 }}
                        />
                        <button className="btn btn-primary" onClick={handleSaveMeal} disabled={syncing || !mealInput}>
                            Sync
                        </button>
                    </div>
                    {todayLog.meal && (
                        <p style={{ marginTop: 12, fontSize: 13, color: "var(--text2)", fontStyle: "italic" }}>
                            Latest: "{todayLog.meal}"
                        </p>
                    )}
                </div>

                {saved && (
                    <div style={{ textAlign: "center", color: "var(--green)", fontSize: 14, fontWeight: 600, animation: "fadeDown 0.3s ease" }}>
                        ✅ Successfully Synced!
                    </div>
                )}
            </div>
        </div>
    );
}
