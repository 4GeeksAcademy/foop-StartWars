import React, { useState } from "react";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        
        try {
            const resp = await fetch(backendUrl + "/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await resp.json();
            setMsg({ type: resp.ok ? "success" : "danger", text: data.msg });
        } catch (error) {
            setMsg({ type: "danger", text: "Error de conexión" });
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card bg-black border-warning text-warning shadow-lg" style={{ width: "400px" }}>
                <div className="card-header text-center border-warning">
                    <h3>Recuperar Contraseña</h3>
                </div>
                <div className="card-body">
                    {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Ingresa tu Email</label>
                            <input
                                type="email"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="jedi@force.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-warning fw-bold">
                                Enviar Enlace
                            </button>
                        </div>
                    </form>
                </div>
                <div className="card-footer text-center border-warning">
                    <Link to="/login" className="text-decoration-none text-light small">
                        <i className="fas fa-arrow-left"></i> Volver al Login
                    </Link>
                </div>
            </div>
        </div>
    );
};