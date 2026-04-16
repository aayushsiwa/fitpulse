import { useState, useEffect } from "react";

const reminders = [
    { id: 1, msg: "💧 Time to drink water!" },
    { id: 2, msg: "🧘 Take a stretch break" },
    { id: 3, msg: "🏃 Don't forget your workout today!" },
    { id: 4, msg: "🌬️ Take 3 deep breaths" },
];

export default function Notifications() {
    const [active, setActive] = useState(null);

    useEffect(() => {
        // Start the cycle after a delay (e.g. 30s) to avoid immediate nag on load
        const initialDelay = setTimeout(() => {
            setActive(reminders[Math.floor(Math.random() * reminders.length)]);
            setTimeout(() => setActive(null), 5000);
        }, 30000);

        // Then repeat every 60 seconds
        const interval = setInterval(() => {
            const r = reminders[Math.floor(Math.random() * reminders.length)];
            setActive(r);
            // Auto-hide after 5s
            setTimeout(() => setActive(null), 5000);
        }, 60000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
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
