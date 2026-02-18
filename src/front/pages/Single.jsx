import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Single = ({ type }) => {
    const { store, actions } = useGlobalReducer();
    const { theid } = useParams();
    const [item, setItem] = useState(null);

    const fieldConfig = {
        people: [
            { label: "Birth Year", key: "birth_year" },
            { label: "Gender", key: "gender" },
            { label: "Height", key: "height" },
            { label: "Skin Color", key: "skin_color" },
            { label: "Eye Color", key: "eye_color" }
        ],
        planet: [
            { label: "Climate", key: "climate" },
            { label: "Population", key: "population" },
            { label: "Terrain", key: "terrain" },
            { label: "Diameter", key: "diameter" },
            { label: "Orbital Period", key: "orbital_period" }
        ],
        vehicle: [
            { label: "Model", key: "model" },
            { label: "Manufacturer", key: "manufacturer" },
            { label: "Class", key: "vehicle_class" },
            { label: "Cost", key: "cost_in_credits" },
            { label: "Speed", key: "max_atmosphering_speed" }
        ],
        spaceship: [
            { label: "Model", key: "model" },
            { label: "Class", key: "starship_class" },
            { label: "Hyperdrive Rating", key: "hyperdrive_rating" },
            { label: "Cost", key: "cost_in_credits" },
            { label: "Manufacturer", key: "manufacturer" }
        ],
        species: [
            { label: "Classification", key: "classification" },
            { label: "Language", key: "language" },
            { label: "Avg Height", key: "average_height" },
            { label: "Lifespan", key: "average_lifespan" },
            { label: "Designation", key: "designation" }
        ],
        film: [
            { label: "Director", key: "director" },
            { label: "Producer", key: "producer" },
            { label: "Release Date", key: "release_date" },
            { label: "Episode", key: "episode_id" }
        ]
    };

    const getImgPath = (type) => {
        if (type === 'people') return 'characters';
        if (type === 'spaceship') return 'starships';
        if (type === 'species') return 'species';
        if (type === 'planet') return 'planets';
        if (type === 'vehicle') return 'vehicles';
        if (type === 'film') return 'films';
        return type + 's';
    };

    const getImageUrl = () => {
        return `/img/${getImgPath(type)}/${theid}.jpg`;
    };

    useEffect(() => {
        const storeKey = type === 'people' || type === 'species' ? type : type + 's';

        if (store[storeKey] && store[storeKey].length === 0) {
            actions.loadData(type);
        }

        if (store[storeKey]) {
            const found = store[storeKey].find(element => element.id == theid);
            setItem(found);
        }
    }, [store, type, theid]);

    if (!item) {
        return (
            <div className="container text-center mt-5 text-warning">
                <h1>Cargando datos del Holocrón... <i className="fas fa-spinner fa-spin"></i></h1>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 d-flex justify-content-center">
                    <img
                        src={getImageUrl()}
                        className="img-fluid rounded border border-warning shadow-lg"
                        alt={item.name || item.title}
                        style={{ maxHeight: "500px", objectFit: "cover" }}
                        onError={(e) => { e.target.src = "https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/big-placeholder.jpg" }}
                    />
                </div>
                <div className="col-md-6 text-center text-md-start">
                    <h1 className="display-4 text-warning fw-bold">{item.name || item.title}</h1>
                    <p className="lead text-light mt-4">
                        {item.opening_crawl
                            ? item.opening_crawl
                            : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Este es un registro detallado de ${item.name || item.title} en los archivos de la Alianza Rebelde. Información clasificada recuperada de los servidores imperiales.`
                        }
                    </p>
                </div>
            </div>

            <hr className="my-5 border-warning" />

            <div className="row text-danger text-center fw-bold bg-dark py-3 rounded border border-secondary">
                {fieldConfig[type]?.map((field, index) => (
                    <div key={index} className="col-md-2 col-6 mb-3 border-end border-secondary">
                        <span className="d-block text-warning h6 text-uppercase">{field.label}</span>
                        <span className="text-white small">
                            {item[field.key] || "N/A"}
                        </span>
                    </div>
                ))}
            </div>

            <div className="text-center mt-5 mb-5">
                <Link to="/">
                    <button className="btn btn-outline-warning btn-lg hover-glow">
                        <i className="fas fa-space-shuttle me-2"></i>
                        Regresar a la Base
                    </button>
                </Link>
            </div>
        </div>
    );
};