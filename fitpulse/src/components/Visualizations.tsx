import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

interface Log {
    date: string;
    steps: number;
    calories: number;
    mood: "Good" | "Okay" | "Tired";
    workout: boolean;
    energy: "High" | "Medium" | "Low";
    meal?: string;
}

interface VisualizationsProps {
    logs: Log[];
}

const moodScore: Record<string, number> = { Good: 3, Okay: 2, Tired: 1 };
const energyScore: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border2)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    zIndex: 100,
                }}
            >
                <p
                    style={{
                        fontSize: 11,
                        color: "var(--text2)",
                        marginBottom: 4,
                        fontWeight: 500,
                    }}
                >
                    {label}
                </p>
                {payload.map((p: any) => (
                    <p
                        key={p.dataKey}
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: p.color || p.fill || "var(--accent2)",
                        }}
                    >
                        {p.name}: {p.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Visualizations({ logs }: VisualizationsProps) {
    if (!logs || logs.length === 0) {
        return (
            <div
                className="fade-up"
                style={{
                    padding: "120px 20px",
                    textAlign: "center",
                    color: "var(--text2)",
                }}
            >
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <h3 className="section-title" style={{ marginBottom: 8 }}>
                    No data yet
                </h3>
                <p style={{ opacity: 0.7 }}>
                    Log your first activity to see insights!
                </p>
            </div>
        );
    }

    const data = logs.map((l) => {
        const dateObj = new Date(l.date);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });

        return {
            date: formattedDate,
            steps: l.steps,
            calories: l.calories,
            mood: moodScore[l.mood] || 0,
            energy: energyScore[l.energy] || 0,
            moodLabel: l.mood,
        };
    });

    const totalSteps = logs.reduce((s, l) => s + (l.steps || 0), 0);
    const avgSteps = Math.round(totalSteps / logs.length);
    const workoutDays = logs.filter((l) => l.workout).length;
    const goodDays = logs.filter((l) => l.mood === "Good").length;

    return (
        <div
            className="fade-up"
            style={{ padding: "52px 20px 24px", animationDelay: "0.1s" }}
        >
            <h2 className="section-title" style={{ marginBottom: 4 }}>
                Insights
            </h2>
            <p className="section-sub" style={{ marginBottom: 24 }}>
                Your last 7 days at a glance
            </p>

            {/* Summary row */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 10,
                    marginBottom: 24,
                }}
            >
                {[
                    {
                        label: "Avg Steps",
                        val: avgSteps.toLocaleString(),
                        icon: "👟",
                        color: "var(--accent2)",
                    },
                    {
                        label: "Workouts",
                        val: `${workoutDays}/7`,
                        icon: "🏋️",
                        color: "var(--green)",
                    },
                    {
                        label: "Good Days",
                        val: `${goodDays}/7`,
                        icon: "😊",
                        color: "var(--yellow)",
                    },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="card"
                        style={{ textAlign: "center", padding: "14px 8px" }}
                    >
                        <div style={{ fontSize: 20, marginBottom: 4 }}>
                            {s.icon}
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-head)",
                                fontWeight: 700,
                                fontSize: 16,
                                color: s.color,
                            }}
                        >
                            {s.val}
                        </div>
                        <div
                            style={{
                                fontSize: 10,
                                color: "var(--text2)",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                marginTop: 2,
                            }}
                        >
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Steps chart */}
            <div className="card" style={{ marginBottom: 16 }}>
                <p
                    style={{
                        fontSize: 12,
                        color: "var(--text2)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 16,
                    }}
                >
                    📊 Steps Over Time
                </p>
                <ResponsiveContainer width="100%" height={160}>
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="stepsGrad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--accent)"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--accent)"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.05)"
                        />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: "var(--text2)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "var(--text2)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            width={35}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="steps"
                            name="Steps"
                            stroke="var(--accent)"
                            strokeWidth={2.5}
                            fill="url(#stepsGrad)"
                            dot={{ fill: "var(--accent)", r: 4, strokeWidth: 2, stroke: "var(--surface)" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Mood vs Energy */}
            <div className="card" style={{ marginBottom: 16 }}>
                <p
                    style={{
                        fontSize: 12,
                        color: "var(--text2)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 16,
                    }}
                >
                    🧠 Mood vs Energy
                </p>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    {[
                        { color: "#4ade80", label: "Mood" },
                        { color: "#fbbf24", label: "Energy" },
                    ].map((l) => (
                        <div
                            key={l.label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <div
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 2,
                                    background: l.color,
                                }}
                            />
                            <span
                                style={{ fontSize: 12, color: "var(--text2)" }}
                            >
                                {l.label}
                            </span>
                        </div>
                    ))}
                </div>
                <ResponsiveContainer width="100%" height={120}>
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.05)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: "var(--text2)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 3.5]}
                            ticks={[1, 2, 3]}
                            tickFormatter={(v) => {
                                if (v === 1) return "Low";
                                if (v === 2) return "Med";
                                if (v === 3) return "High";
                                return "";
                            }}
                            tick={{ fill: "var(--text2)", fontSize: 10, fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            width={35}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="mood"
                            name="Mood"
                            fill="#4ade80"
                            radius={[3, 3, 0, 0]}
                            maxBarSize={20}
                        />
                        <Bar
                            dataKey="energy"
                            name="Energy"
                            fill="#fbbf24"
                            radius={[3, 3, 0, 0]}
                            maxBarSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Calories bar */}
            <div className="card">
                <p
                    style={{
                        fontSize: 12,
                        color: "var(--text2)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 16,
                    }}
                >
                    🔥 Calories Burned
                </p>
                <ResponsiveContainer width="100%" height={120}>
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="calGrad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor="var(--pink)" />
                                <stop offset="100%" stopColor="var(--accent)" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.05)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: "var(--text2)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "var(--text2)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            width={35}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="calories"
                            name="kcal"
                            fill="url(#calGrad)"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={28}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
