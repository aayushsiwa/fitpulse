interface ProfileProps {
    user: any;
    onLogout: () => void;
    onClose: () => void;
}

export default function Profile({ user, onLogout, onClose }: ProfileProps) {
    const bmi = (Number(user.weight) / ((Number(user.height) / 100) ** 2)).toFixed(1);
    
    const getBMICategory = (val: number) => {
        if (val < 18.5) return { label: "Underweight", color: "var(--red)" };
        if (val < 25) return { label: "Healthy", color: "var(--green)" };
        if (val < 30) return { label: "Overweight", color: "var(--yellow)" };
        return { label: "Obese", color: "var(--red)" };
    };

    const cat = getBMICategory(Number(bmi));

    return (
        <div className="onboarding-screen">
            <div className="onboarding-card" style={{ maxWidth: 400, position: "relative" }}>
                <button 
                    onClick={onClose}
                    style={{ 
                        position: "absolute", 
                        top: 20, 
                        right: 20, 
                        background: "none", 
                        border: "none", 
                        color: "var(--text2)", 
                        fontSize: 24, 
                        cursor: "pointer" 
                    }}
                >
                    ×
                </button>

                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: "50%", 
                        background: "var(--accent-glow)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        fontSize: 40, 
                        margin: "0 auto 16px",
                        border: "2px solid var(--accent)"
                    }}>
                        👤
                    </div>
                    <h2 className="onboarding-title">{user.name}</h2>
                    <p style={{ color: "var(--accent)", fontWeight: 600, fontSize: 13 }}>{user.email}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                    <div className="card-sm" style={{ textAlign: "center", padding: 16 }}>
                        <div style={{ fontSize: 12, color: "var(--text2)", textTransform: "uppercase", marginBottom: 4 }}>BMI Score</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: cat.color }}>{bmi}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, marginTop: 4 }}>{cat.label}</div>
                    </div>
                    <div className="card-sm" style={{ textAlign: "center", padding: 16 }}>
                        <div style={{ fontSize: 12, color: "var(--text2)", textTransform: "uppercase", marginBottom: 4 }}>Goal</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{user.goal}</div>
                        <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4 }}>Active Plan</div>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div className="card-sm" style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                        <span style={{ color: "var(--text2)", fontSize: 13 }}>Height</span>
                        <span style={{ fontWeight: 600 }}>{user.height} cm</span>
                    </div>
                    <div className="card-sm" style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                        <span style={{ color: "var(--text2)", fontSize: 13 }}>Weight</span>
                        <span style={{ fontWeight: 600 }}>{user.weight} kg</span>
                    </div>
                    {user.target_weight && (
                        <div className="card-sm" style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                            <span style={{ color: "var(--text2)", fontSize: 13 }}>Target</span>
                            <span style={{ fontWeight: 600, color: "var(--accent)" }}>{user.target_weight} kg</span>
                        </div>
                    )}
                </div>

                <button 
                    className="btn btn-secondary btn-full" 
                    onClick={onLogout}
                    style={{ marginTop: 32, borderColor: "var(--red)", color: "var(--red)" }}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}
