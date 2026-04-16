import { useState, useEffect } from "react";

const reminders = [
    { id: 1, msg: "💧 Time to drink water!", delay: 5000 },
    { id: 2, msg: "🧘 Take a stretch break", delay: 15000 },
    { id: 3, msg: "🏃 Don't forget your workout today!", delay: 25000 },
];

export default function Notifications() {
    const [active, setActive] = useState(null);

    useEffect(() => {
        const timers = reminders.map((r) =>
            setTimeout(() => {
                setActive(r);
                setTimeout(() => setActive(null), 4000);
            }, r.delay),
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    if (!active) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 999,
                width: "calc(100% - 32px)",
                maxWidth: 390,
                background: "var(--surface2)",
                border: "1px solid var(--border2)",
                borderRadius: "16px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                animation: "fadeUp 0.3s ease",
                backdropFilter: "blur(10px)",
            }}
        >
            <span style={{ fontWeight: 500, fontSize: 14 }}>{active.msg}</span>
            <button
                onClick={() => setActive(null)}
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text2)",
                    fontSize: 18,
                    padding: "0 4px",
                }}
            >
                ×
            </button>
        </div>
    );
}
