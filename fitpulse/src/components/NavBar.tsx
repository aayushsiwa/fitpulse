const tabs = [
    { id: "dashboard", icon: "🏠", label: "Home" },
    { id: "activity", icon: "✏️", label: "Log" },
    { id: "schedule", icon: "📅", label: "Plan" },
    { id: "insights", icon: "📊", label: "Insights" },
];

export default function NavBar({ activeTab, setActiveTab }) {
    return (
        <nav
            style={{
                position: "fixed",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                maxWidth: 430,
                background: "rgba(14,14,20,0.92)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid var(--border)",
                height: "var(--nav-h)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                zIndex: 100,
                padding: "0 8px 8px",
            }}
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                        padding: "8px 16px",
                        borderRadius: 12,
                        border: "none",
                        cursor: "pointer",
                        background:
                            activeTab === tab.id
                                ? "rgba(124,109,250,0.15)"
                                : "transparent",
                        transition: "all 0.2s",
                        flex: 1,
                    }}
                >
                    <span style={{ fontSize: 20, lineHeight: 1 }}>
                        {tab.icon}
                    </span>
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: activeTab === tab.id ? 600 : 400,
                            color:
                                activeTab === tab.id
                                    ? "var(--accent2)"
                                    : "var(--text2)",
                            fontFamily: "var(--font-body)",
                            transition: "color 0.2s",
                            letterSpacing: "0.02em",
                        }}
                    >
                        {tab.label}
                    </span>
                    {activeTab === tab.id && (
                        <div
                            style={{
                                width: 20,
                                height: 2,
                                background: "var(--accent)",
                                borderRadius: 2,
                                marginTop: 1,
                            }}
                        />
                    )}
                </button>
            ))}
        </nav>
    );
}
