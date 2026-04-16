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
    ReferenceArea,
    ReferenceLine,
} from "recharts";

interface Log {
    date: string;
    steps: number;
    calories: number;
    workout: boolean;
    energy: string;
    weight?: number;
    meal?: string;
}

interface VisualizationsProps {
    logs: Log[];
    user: { height: string; target_weight?: string };
    isLoading?: boolean;
}

const energyScore: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
const energyLabels: Record<number, string> = { 3: "High", 2: "Medium", 1: "Low" };

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
                        {p.name}: {p.name === "Energy" ? energyLabels[p.value] || p.value : p.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Visualizations({ logs, user, isLoading = false }: VisualizationsProps) {
    if (isLoading) {
        return (
            <div style={{ padding: "52px 20px 24px" }}>
                <h2 className="section-title" style={{ marginBottom: 4 }}>Insights</h2>
                <p className="section-sub" style={{ marginBottom: 24 }}>Loading your data…</p>
                {[160, 140, 120].map((h, i) => (
                    <div
                        key={i}
                        className="card"
                        style={{
                            marginBottom: 16,
                            height: h + 52,
                            background:
                                "linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.4s infinite",
                        }}
                    />
                ))}
            </div>
        );
    }

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
            energy: energyScore[l.energy] || 0,
            weight: l.weight || null,
        };
    });

    const totalSteps = logs.reduce((s, l) => s + (l.steps || 0), 0);
    const avgSteps = Math.round(totalSteps / logs.length);
    const workoutDays = logs.filter((l) => l.workout).length;
    const highEnergyDays = logs.filter((l) => l.energy === "High").length;

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
                        label: "High Energy",
                        val: `${highEnergyDays}/7`,
                        icon: "⚡",
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

            {/* Energy Trend */}
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
                    🔋 Energy Recovery Trend
                </p>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    {[
                        { color: "var(--yellow)", label: "Energy" },
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
                            dataKey="energy"
                            name="Energy"
                            fill="var(--yellow)"
                            radius={[3, 3, 0, 0]}
                            maxBarSize={28}
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

            {/* Weight History with BMI Logic */}
            {logs.some((l) => l.weight) && (
                <div className="card" style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 12, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
                        ⚖️ Weight Trend & BMI Status
                    </p>
                    {(() => {
                        const h = Number(user.height) / 100;
                        const h2 = h * h;
                        const targets = {
                            under: 18.5 * h2,
                            healthy: 25 * h2,
                            over: 30 * h2
                        };
                        return (
                            <ResponsiveContainer width="100%" height={240}>
                                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fill: "var(--text2)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis domain={[Math.min(...data.map(d => d.weight || 100)) - 10, 'auto']} tick={{ fill: "var(--text2)", fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
                                    <Tooltip content={<CustomTooltip />} />
                                    
                                    {/* BMI Bands */}
                                    <ReferenceArea y1={0} y2={targets.under} fill="var(--red)" fillOpacity={0.05} />
                                    <ReferenceArea y1={targets.under} y2={targets.healthy} fill="var(--green)" fillOpacity={0.1} />
                                    <ReferenceArea y1={targets.healthy} y2={targets.over} fill="var(--yellow)" fillOpacity={0.05} />
                                    <ReferenceArea y1={targets.over} y2={200} fill="var(--red)" fillOpacity={0.05} />
                                    
                                    {/* Goal Line */}
                                    {user.target_weight && (
                                        <ReferenceLine y={Number(user.target_weight)} stroke="var(--accent)" strokeDasharray="3 3" label={{ value: "Goal", position: "right", fill: "var(--accent)", fontSize: 10 }} />
                                    )}

                                    <Area
                                        type="monotone"
                                        dataKey="weight"
                                        name="Weight (kg)"
                                        stroke="var(--accent2)"
                                        strokeWidth={3}
                                        fill="url(#weightGrad)"
                                        dot={{ fill: "var(--accent2)", r: 4, strokeWidth: 2, stroke: "var(--surface)" }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                        connectNulls
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        );
                    })()}
                    <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                        {[
                            { color: "var(--green)", label: "Healthy Range" },
                            { color: "var(--accent2)", label: "Your Weight" },
                            { color: "var(--accent)", label: "Goal" },
                        ].map(legend => (
                            <div key={legend.label} style={{ fontSize: 10, color: "var(--text2)", display: "flex", alignItems: "center", gap: 4 }}>
                                <div style={{ width: 8, height: 8, borderRadius: 2, background: legend.color }} /> {legend.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
