import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

export const TodoList = () => {
    const { store, actions } = useGlobalReducer();
    const [inputValue, setInputValue] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        if (store.token) {
            actions.getTodos();
        }
    }, [store.token]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (inputValue.trim() === "") {
                alert("La misión no puede estar vacía, soldado.");
                return;
            }
            actions.addTodo(inputValue);
            setInputValue("");
        }
    };

    if (!store.token) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger bg-black border-danger text-danger">
                    <h4 className="alert-heading"><i className="fas fa-user-lock"></i> Acceso Restringido</h4>
                    <p>Necesitas identificarte para acceder a tu Bitácora de Misiones.</p>
                    <Link to="/login" className="btn btn-outline-danger fw-bold mt-3">
                        Ir al Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 pb-5">
            <h1 className="text-warning text-center mb-4" style={{ textShadow: "0 0 10px #e3b324" }}>
                <i className="fas fa-clipboard-list me-3"></i>
                Bitácora de Misiones
            </h1>

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card bg-black border-warning shadow-lg">
                        <div className="card-body p-0">

                            <input
                                type="text"
                                className="form-control bg-dark text-white border-0 p-3 fs-5"
                                placeholder="Añadir nueva misión (Presiona Enter)"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ borderRadius: "0", boxShadow: "none" }}
                            />

                            <ul className="list-group list-group-flush">
                                {store.todos.length === 0 ? (
                                    <li className="list-group-item bg-black text-muted text-center p-4 border-secondary">
                                        No hay tareas pendientes, añadir tareas.
                                    </li>
                                ) : (
                                    store.todos.map((todo, index) => (
                                        <li
                                            key={todo.id || index}
                                            className="list-group-item bg-black text-warning border-secondary d-flex justify-content-between align-items-center p-3"
                                            onMouseEnter={() => setHoveredIndex(index)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            <span className="fs-5">{todo.label}</span>

                                            <span
                                                onClick={() => actions.deleteTodo(todo.id)}
                                                className="hover-effect"
                                                style={{
                                                    cursor: "pointer",
                                                    visibility: hoveredIndex === index ? "visible" : "hidden",
                                                    transition: "color 0.3s"
                                                }}
                                            >
                                                <i className="fas fa-trash-alt text-danger fa-lg"></i>
                                            </span>
                                        </li>
                                    ))
                                )}
                            </ul>

                            <div className="card-footer bg-dark text-secondary border-top border-secondary small">
                                {store.todos.length} item{store.todos.length !== 1 ? "s" : ""} left
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};