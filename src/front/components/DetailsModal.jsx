import React from "react";

export const DetailsModal = ({ show, onClose, item, type }) => {
    if (!show || !item) return null;

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
            { label: "Diameter", key: "diameter" }
        ],
        vehicle: [
            { label: "Model", key: "model" },
            { label: "Manufacturer", key: "manufacturer" },
            { label: "Class", key: "vehicle_class" }
        ],
        spaceship: [
            { label: "Model", key: "model" },
            { label: "Class", key: "starship_class" },
            { label: "Manufacturer", key: "manufacturer" }
        ],
        species: [
            { label: "Classification", key: "classification" },
            { label: "Language", key: "language" },
            { label: "Designation", key: "designation" }
        ],
        film: [
            { label: "Director", key: "director" },
            { label: "Producer", key: "producer" },
            { label: "Release Date", key: "release_date" }
        ]
    };

    const getImgPath = () => {
        if (type === 'people') return 'characters';
        if (type === 'spaceship') return 'starships';
        if (type === 'species') return 'species';
        if (type === 'planet') return 'planets';
        if (type === 'vehicle') return 'vehicles';
        if (type === 'film') return 'films';
        return type + 's';
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)" }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content bg-black border border-warning text-warning shadow-lg" style={{ boxShadow: "0 0 20px #e3b324" }}>
                    
                    <div className="modal-header border-bottom border-secondary">
                        <h1 className="modal-title fs-3 fw-bold">{item.name || item.title}</h1>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6 mb-3 mb-md-0 d-flex justify-content-center align-items-center">
                                <img 
                                    src={`https://starwars-visualguide.com/assets/img/${getImgPath()}/${item.id}.jpg`}
                                    className="img-fluid rounded border border-secondary"
                                    alt={item.name}
                                    style={{ maxHeight: "350px", objectFit: "cover" }}
                                    onError={(e) => e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"}
                                />
                            </div>
                            
                            <div className="col-md-6">
                                <p className="lead text-light text-center text-md-start">
                                    {item.opening_crawl 
                                        ? <small>{item.opening_crawl.substring(0, 200)}...</small>
                                        : "Información clasificada recuperada de los archivos imperiales. Analizando datos biométricos y especificaciones técnicas..."
                                    }
                                </p>
                                
                                <div className="mt-4">
                                    <ul className="list-group list-group-flush">
                                        {fieldConfig[type]?.map((field, idx) => (
                                            <li key={idx} className="list-group-item bg-transparent text-white border-secondary d-flex justify-content-between px-0">
                                                <span className="fw-bold text-warning">{field.label}:</span>
                                                <span>{item[field.key] || "N/A"}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer border-top border-secondary">
                        <button type="button" className="btn btn-outline-warning" onClick={onClose}>
                            Cerrar Transmisión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};