import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Home = () => {
	const { store, actions } = useGlobalReducer();

	useEffect(() => {
		if (store.people.length === 0) actions.getPeople();
		if (store.planets.length === 0) actions.getPlanets();
	}, []);

	const isFavorite = (id, type) => {
		return store.favorites.some(fav => {
			if (type === "people") return fav.people?.id === id;
			if (type === "planet") return fav.planet?.id === id;
			return false;
		});
	};

	return (
		<div className="container-fluid mt-4 pb-5 bg-black" style={{ minHeight: "100vh" }}>
			<div className="container mb-5">
				<h2 className="text-warning mb-4" style={{ textShadow: "0 0 10px #e3b324" }}>
					Personajes
				</h2>
				<div className="d-flex flex-row flex-nowrap overflow-auto pb-4 gap-3 custom-scrollbar">
					{store.people.length === 0 ? (
						<div className="text-muted">Cargando personajes... <i className="fas fa-spinner fa-spin"></i></div>
					) : (
						store.people.map((person) => {
							const isFav = isFavorite(person.id, "people");
							return (
								<div key={person.id} className="card bg-dark border-warning text-white flex-shrink-0" style={{ width: "18rem", boxShadow: "0 0 5px #444" }}>
									<img 
										src={`https://starwars-visualguide.com/assets/img/characters/${person.id}.jpg`} 
										className="card-img-top" 
										alt={person.name}
										onError={(e) => { e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg" }} // Fallback si falla la imagen
									/>
									<div className="card-body">
										<h5 className="card-title text-warning fw-bold">{person.name}</h5>
										<div className="card-text mb-3 small">
											<p className="m-0">Gender: {person.gender || "n/a"}</p>
											<p className="m-0">Hair Color: {person.hair_color}</p>
											<p className="m-0">Eye Color: {person.eye_color || "n/a"}</p>
										</div>
										<div className="d-flex justify-content-between">
											<Link to={`/people/${person.id}`} className="btn btn-outline-primary btn-sm">
												Learn more!
											</Link>
											<button 
												className={`btn btn-outline-warning btn-sm ${isFav ? "active" : ""}`}
												onClick={() => actions.addFavoritePeople(person.id)}
											>
												<i className={`${isFav ? "fas" : "far"} fa-heart`}></i>
											</button>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>

			<div className="container">
				<h2 className="text-warning mb-4" style={{ textShadow: "0 0 10px #e3b324" }}>
					Planetas
				</h2>
				<div className="d-flex flex-row flex-nowrap overflow-auto pb-4 gap-3 custom-scrollbar">
					{store.planets.length === 0 ? (
						<div className="text-muted">Cargando planetas... <i className="fas fa-spinner fa-spin"></i></div>
					) : (
						store.planets.map((planet) => {
							const isFav = isFavorite(planet.id, "planet");
							return (
								<div key={planet.id} className="card bg-dark border-warning text-white flex-shrink-0" style={{ width: "18rem", boxShadow: "0 0 5px #444" }}>
									<img 
										src={planet.id === 1 ? "https://static.wikia.nocookie.net/esstarwars/images/b/b0/Tatooine_TPM.png" : `https://starwars-visualguide.com/assets/img/planets/${planet.id}.jpg`}
										className="card-img-top" 
										alt={planet.name}
										style={{ height: "200px", objectFit: "cover" }}
										onError={(e) => { e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg" }}
									/>
									<div className="card-body">
										<h5 className="card-title text-warning fw-bold">{planet.name}</h5>
										<div className="card-text mb-3 small">
											<p className="m-0">Population: {planet.population}</p>
											<p className="m-0">Terrain: {planet.terrain}</p>
										</div>
										<div className="d-flex justify-content-between">
											<Link to={`/planets/${planet.id}`} className="btn btn-outline-primary btn-sm">
												Learn more!
											</Link>
											<button 
												className={`btn btn-outline-warning btn-sm ${isFav ? "active" : ""}`}
												onClick={() => actions.addFavoritePlanet(planet.id)}
											>
												<i className={`${isFav ? "fas" : "far"} fa-heart`}></i>
											</button>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
};