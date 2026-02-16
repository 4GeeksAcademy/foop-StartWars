import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    const { store, actions } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-dark bg-black border-bottom border-warning sticky-top mb-3 px-4 shadow-lg">
            <div className="container">
                {/* LOGO STAR WARS */}
                <Link to="/">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Star_Wars_Logo.svg" 
                        alt="Star Wars" 
                        style={{ height: "60px", filter: "drop-shadow(0 0 5px #e3b324)" }} 
                    />
                </Link>

                <div className="ml-auto d-flex gap-3 align-items-center">
                    
                    {store.token && (
                        <Link to="/todos">
                            <button className="btn btn-outline-light btn-sm">
                                <i className="fas fa-tasks me-2"></i>Mis Tareas
                            </button>
                        </Link>
                    )}

                    {store.token && (
                        <div className="dropdown">
                            <button 
                                className="btn btn-warning dropdown-toggle fw-bold text-black" 
                                type="button" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                                style={{ boxShadow: "0 0 10px #e3b324" }}
                            >
                                Favoritos 
                                <span className="badge bg-black text-warning ms-2 border border-warning">
                                    {store.favorites.length}
                                </span>
                            </button>
                            
                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark border-warning bg-black">
                                {store.favorites.length === 0 ? (
                                    <li className="dropdown-item text-center text-muted">(Vacío)</li>
                                ) : (
                                    store.favorites.map((fav, index) => {
                                        const name = fav.planet ? fav.planet.name : fav.people ? fav.people.name : "Desconocido";
                                        const idToDelete = fav.planet ? fav.planet.id : fav.people ? fav.people.id : null;
                                        const type = fav.planet ? "planet" : "people";

                                        return (
                                            <li key={index} className="dropdown-item d-flex justify-content-between align-items-center">
                                                <span className="text-warning">{name}</span>
                                                <span 
                                                    className="ms-2 cursor-pointer"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (type === "planet") actions.deleteFavoritePlanet(idToDelete);
                                                        else actions.deleteFavoritePeople(idToDelete);
                                                    }}
                                                >
                                                    <i className="fas fa-trash text-danger hover-effect"></i>
                                                </span>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </div>
                    )}

                    {!store.token ? (
                        <Link to="/login">
                            <button className="btn btn-outline-warning fw-bold hover-glow">
                                <i className="fas fa-user-astronaut me-2"></i>Login / Registro
                            </button>
                        </Link>
                    ) : (
                        <button onClick={handleLogout} className="btn btn-outline-danger fw-bold">
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};