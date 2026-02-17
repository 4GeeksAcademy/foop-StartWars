import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const SectionRow = ({ title, data = [], type, actions, favorites }) => {
    
	const safeData = Array.isArray(data) ? data : [];

    const isFav = (id) => favorites.some(fav => fav[type]?.id === id);

	const getImgPath = (type) => {
        if (type === 'people') return 'characters';
        if (type === 'spaceship') return 'starships';
        if (type === 'species') return 'species';
        return type + 's';
    };

return (
        <div className="container mb-5">
            <h2 className="text-warning mb-4 text-uppercase" style={{ textShadow: "0 0 10px #e3b324" }}>
                {title}
            </h2>
            <div className="d-flex flex-row flex-nowrap overflow-auto pb-4 gap-3 custom-scrollbar">
                {/* Usamos safeData en lugar de data */}
                {safeData.length === 0 ? (
                    <div className="text-muted">
                        Cargando {title.toLowerCase()}... <i className="fas fa-spinner fa-spin"></i>
                    </div>
                ) : (
                    safeData.map((item) => (
                        <div key={item.id} className="card bg-dark border-warning text-white flex-shrink-0" style={{ width: "18rem", boxShadow: "0 0 5px #444" }}>
                            <img 
                                src={`https://starwars-visualguide.com/assets/img/${getImgPath(type)}/${item.id}.jpg`} 
                                className="card-img-top" 
                                alt={item.name || item.title}
                                style={{ height: "250px", objectFit: "cover", objectPosition: "top" }}
                                onError={(e) => { e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title text-warning fw-bold text-truncate">
                                    {item.name || item.title}
                                </h5>
                                
                                <div className="card-text mb-3 small">
                                    {type === 'people' && <p className="m-0">Gender: {item.gender || "n/a"}</p>}
                                    {type === 'planet' && <p className="m-0">Population: {item.population || "n/a"}</p>}
                                    {type === 'vehicle' && <p className="m-0">Model: {item.model || "n/a"}</p>}
                                    {type === 'spaceship' && <p className="m-0">Class: {item.starship_class || "n/a"}</p>}
                                    {type === 'species' && <p className="m-0">Language: {item.language || "n/a"}</p>}
                                    {type === 'film' && <p className="m-0">Director: {item.director || "n/a"}</p>}
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-auto">
                                    <Link to={`/${type === 'people' ? 'people' : type + 's'}/${item.id}`} className="btn btn-outline-primary btn-sm">
                                        Learn more!
                                    </Link>
                                    
                                    <button 
                                        className={`btn btn-sm ${isFav(item.id) ? "btn-warning" : "btn-outline-warning"}`}
                                        onClick={() => isFav(item.id) 
                                            ? actions.deleteFavorite(type, item.id) 
                                            : actions.addFavorite(type, item.id)
                                        }
                                    >
                                        <i className={`${isFav(item.id) ? "fas" : "far"} fa-heart`}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export const Home = () => {
    const { store, actions } = useGlobalReducer();

    useEffect(() => {
        actions.loadAllStarWars(); 
    }, []);

    return (
        <div className="container-fluid mt-4 pb-5 bg-black" style={{ minHeight: "100vh" }}>
            <SectionRow title="Personajes" data={store.people} type="people" actions={actions} favorites={store.favorites} />
            <SectionRow title="Planetas" data={store.planets} type="planet" actions={actions} favorites={store.favorites} />
            <SectionRow title="Naves Espaciales" data={store.spaceships} type="spaceship" actions={actions} favorites={store.favorites} />
            <SectionRow title="Vehículos" data={store.vehicles} type="vehicle" actions={actions} favorites={store.favorites} />
            <SectionRow title="Especies" data={store.species} type="species" actions={actions} favorites={store.favorites} />
            <SectionRow title="Películas" data={store.films} type="film" actions={actions} favorites={store.favorites} />
        </div>
    );
};