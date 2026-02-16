import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const { actions } = useGlobalReducer();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            const success = await actions.login(email, password);
            if (success) {
                navigate("/"); 
            } else {
                alert("Error: Email o contraseña incorrectos");
            }
        } else {
            const success = await actions.signup(email, password);
            if (success) {
                alert("Usuario registrado con éxito. Ahora inicia sesión.");
                setIsLogin(true); 
            } else {
                alert("Error: No se pudo registrar el usuario (¿Quizás ya existe?)");
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="card bg-black border-warning text-warning shadow-lg" style={{ width: "400px" }}>
                <div className="card-header text-center border-warning">
                    <h3>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-warning fw-bold">
                                {isLogin ? "Entrar" : "Registrarme"}
                            </button>
                        </div>
                        <div className="text-end mb-3">
                            <Link to="/forgot-password" style={{ fontSize: "0.8rem", color: "#e3b324" }}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </form>
                </div>
                <div className="card-footer text-center border-warning text-muted">
                    {isLogin ? (
                        <small>
                            ¿No tienes cuenta?{" "}
                            <span 
                                className="text-warning fw-bold" 
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsLogin(false)}
                            >
                                Regístrate aquí
                            </span>
                        </small>
                    ) : (
                        <small>
                            ¿Ya tienes cuenta?{" "}
                            <span 
                                className="text-warning fw-bold" 
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsLogin(true)}
                            >
                                Ingresa aquí
                            </span>
                        </small>
                    )}
                </div>
            </div>
        </div>
    );
};