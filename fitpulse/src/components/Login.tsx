import { useState } from "react";
import { login } from "../api";

export default function Login({ onLoginSuccess, onToggleSignup }) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await login(formData);
            onLoginSuccess(res.access_token);
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-screen">
            <div className="onboarding-card" style={{ maxWidth: 400 }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🔑</div>
                    <h1 className="onboarding-title">Welcome Back</h1>
                    <p className="onboarding-sub">Log in to your APMHOS dashboard</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <label className="label">Email</label>
                        <input
                            className="input"
                            type="email"
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
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                    
                    <p style={{ textAlign: "center", fontSize: 13, color: "var(--text2)", marginTop: 8 }}>
                        Don't have an account?{" "}
                        <span 
                            onClick={onToggleSignup} 
                            style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}
                        >
                            Sign Up
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
