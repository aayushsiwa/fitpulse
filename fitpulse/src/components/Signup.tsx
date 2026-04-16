import { useState } from "react";
import { signup } from "../api";

export default function Signup({ onSignupSuccess, onToggleLogin }) {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await signup(formData);
            onSignupSuccess(res.access_token);
        } catch (err: any) {
            setError(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-screen">
            <div className="onboarding-card" style={{ maxWidth: 400 }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
                    <h1 className="onboarding-title">Join APMHOS</h1>
                    <p className="onboarding-sub">Elevate your health journey</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <label className="label">Full Name</label>
                        <input
                            className="input"
                            type="text"
                            placeholder="John Doe"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="label">Email</label>
                        <input
                            className="input"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="john@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="label">Password</label>
                        <input
                            className="input"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {error && (
                        <div style={{ color: "var(--red)", fontSize: 13, textAlign: "center", background: "rgba(255, 71, 87, 0.1)", padding: "8px", borderRadius: 8 }}>
                            {error}
                        </div>
                    )}

                    <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                    
                    <p style={{ textAlign: "center", fontSize: 13, color: "var(--text2)", marginTop: 8 }}>
                        Already have an account?{" "}
                        <span 
                            onClick={onToggleLogin} 
                            style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}
                        >
                            Log In
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
