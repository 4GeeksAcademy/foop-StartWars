import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Single = ({ type }) => {
    const { store, actions } = useGlobalReducer();
    const { theid } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        if (type === "people" && store.people.length === 0) {
            actions.getPeople();
        }
        if (type === "planet" && store.planets.length === 0) {
            actions.getPlanets();
        }
    }, []);

    useEffect(() => {
        let foundItem = null;
        if (type === "people") {
            foundItem = store.people.find(p => p.id == theid);
        } else if (type === "planet") {
            foundItem = store.planets.find(p => p.id == theid);
        }
        setItem(foundItem);
    }, [store.people, store.planets, theid, type]);

    if (!item) {
        return (
            <div className="container text-center mt-5 text-warning">
                <h1>Buscando en los archivos... <i className="fas fa-spinner fa-spin"></i></h1>
            </div>
        );
    }

    const imageUrl = type === "people" 
        ? `https://starwars-visualguide.com/assets/img/characters/${theid}.jpg`
        : `https://starwars-visualguide.com/assets/img/planets/${theid}.jpg`;
    
    const handleImageError = (e) => {
        e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 d-flex justify-content-center">
                    <img 
                        src={imageUrl} 
                        className="img-fluid rounded border border-warning shadow-lg" 
                        alt={item.name} 
                        style={{ maxHeight: "400px" }}
                        onError={handleImageError}
                    />
                </div>
                <div className="col-md-6 text-center text-md-start">
                    <h1 className="display-4 text-warning fw-bold">{item.name}</h1>
                    <p className="lead text-light mt-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    </p>
                </div>
            </div>

            <hr className="my-5 border-warning" />

            <div className="row text-danger text-center fw-bold">
                {type === "people" ? (
                    <>
                        <div className="col-md-2 col-4 mb-3">
                            <span className="d-block text-warning h6">Name</span>
                            {item.name}
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                            <span className="d-block text-warning h6">Birth Year</span>
                            {item.birth_year || "N/A"}
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                            <span className="d-block text-warning h6">Gender</span>
                            {item.gender || "N/A"}
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                            <span className="d-block text-warning h6">Height</span>
                            {item.height} cm
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                            <span className="d-block text-warning h6">Skin Color</span>
                            {item.skin_color || "N/A"}
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                            <span className="d-block text-warning h6">Eye Color</span>
                            {item.eye_color || "N/A"}
                        </div>
                    </>
                ) : (
                    <>
                         <div className="col-md-2 col-4 mb-3">
                            <span className="d-block text-warning h6">Name</span>
                            {item.name}
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                            <span className="d-block text-warning h6">Climate</span>
                            {item.climate}
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                            <span className="d-block text-warning h6">Population</span>
                            {item.population}
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                            <span className="d-block text-warning h6">Orbital Period</span>
                            {item.orbital_period || "N/A"}
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                            <span className="d-block text-warning h6">Rotation Period</span>
                            {item.rotation_period || "N/A"}
                        </div>
                        <div className="col-md-2 col-4 mb-3">
                            <span className="d-block text-warning h6">Diameter</span>
                            {item.diameter || "N/A"}
                        </div>
                    </>
                )}
            </div>

            <div className="text-center mt-5 mb-5">
                <Link to="/">
                    <button className="btn btn-outline-warning btn-lg hover-glow">
                        Back to Home
                    </button>
                </Link>
            </div>
        </div>
    );
};