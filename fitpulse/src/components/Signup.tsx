import { useState } from "react";
import { signup } from "../api";

interface SignupProps {
    onSignupSuccess: (token: string) => void;
    onToggleLogin: () => void;
}

export default function Signup({ onSignupSuccess, onToggleLogin }: SignupProps) {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
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
                            name="name"
                            autoComplete="name"
                            placeholder="John Doe"
                            required
                            value={formData.name}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFormData(prev => ({ ...prev, name: val }));
                            }}
                        />
                    </div>
                    <div>
                        <label className="label">Email</label>
                        <input
                            className="input"
                            type="email"
                            name="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="john@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFormData(prev => ({ ...prev, email: val }));
                            }}
                        />
                    </div>
                    <div>
                        <label className="label">Password</label>
                        <input
                            className="input"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            required
                            value={formData.password}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFormData(prev => ({ ...prev, password: val }));
                            }}
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
