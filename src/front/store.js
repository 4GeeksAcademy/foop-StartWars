const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            user: null,
            people: [],
            planets: [],
            favorites: [],
            todos: [],
            message: null
        },
        actions: {
            // --- AUTHENTICATION ---
            
            syncTokenFromSessionStore: () => {
                const token = sessionStorage.getItem("token");
                if (token && token !== "" && token !== undefined) {
                    setStore({ token: token });
                }
            },

            login: async (email, password) => {
                const store = getStore();
                const actions = getActions();
                const backendUrl = import.meta.env.VITE_BACKEND_URL;

                const resp = await fetch(backendUrl + "/api/token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                if (!resp.ok) {
                    console.error("Error en login: " + resp.statusText);
                    return false;
                }

                const data = await resp.json();
                sessionStorage.setItem("token", data.token);
                setStore({ token: data.token, user: data.user_id });
                actions.getFavorites();
                actions.getTodos();
                return true;
            },

            logout: () => {
                sessionStorage.removeItem("token");
                setStore({ token: null, user: null, favorites: [], todos: [] });
            },

            signup: async (email, password) => {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const resp = await fetch(backendUrl + "/api/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                if (!resp.ok) {
                    console.error("Error en signup");
                    return false;
                }
                
                return true;
            },

            getPeople: async () => {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const resp = await fetch(backendUrl + "/api/people");
                if (!resp.ok) {
                    console.error("Error loading people");
                    return;
                }

                const data = await resp.json();
                setStore({ people: data });
            },

            getPlanets: async () => {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const resp = await fetch(backendUrl + "/api/planets");
                if (!resp.ok) {
                    console.error("Error loading planets");
                    return;
                }

                const data = await resp.json();
                setStore({ planets: data });
            },

            getFavorites: async () => {
                const store = getStore();
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                if (!store.token) return;

                const resp = await fetch(backendUrl + "/api/users/favorites", {
                    headers: { "Authorization": "Bearer " + store.token }
                });

                if (!resp.ok) {
                    console.error("Error loading favorites");
                    return;
                }

                const data = await resp.json();
                setStore({ favorites: data });
            },

            addFavoritePlanet: async (planetId) => {
                const store = getStore();
                const actions = getActions();
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                if (!store.token) {
                    alert("Debes iniciar sesión para añadir favoritos");
                    return;
                }

                const resp = await fetch(backendUrl + "/api/favorite/planet/" + planetId, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + store.token 
                    }
                });

                if (resp.ok) {
                    actions.getFavorites();
                } else {
                    console.error("Error adding favorite planet");
                }
            },

            addFavoritePeople: async (peopleId) => {
                const store = getStore();
                const actions = getActions();
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                if (!store.token) {
                    alert("Debes iniciar sesión para añadir favoritos");
                    return;
                }

                const resp = await fetch(backendUrl + "/api/favorite/people/" + peopleId, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + store.token 
                    }
                });

                if (resp.ok) {
                    actions.getFavorites();
                } else {
                    console.error("Error adding favorite people");
                }
            },

            deleteFavoritePlanet: async (planetId) => {
                const store = getStore();
                const actions = getActions();
                const backendUrl = import.meta.env.VITE_BACKEND_URL;

                const resp = await fetch(backendUrl + "/api/favorite/planet/" + planetId, {
                    method: "DELETE",
                    headers: { "Authorization": "Bearer " + store.token }
                });

                if (resp.ok) {
                    actions.getFavorites();
                } else {
                    console.error("Error deleting favorite");
                }
            },

            deleteFavoritePeople: async (peopleId) => {
                const store = getStore();
                const actions = getActions();
                const backendUrl = import.meta.env.VITE_BACKEND_URL;

                const resp = await fetch(backendUrl + "/api/favorite/people/" + peopleId, {
                    method: "DELETE",
                    headers: { "Authorization": "Bearer " + store.token }
                });

                if (resp.ok) {
                    actions.getFavorites();
                } else {
                    console.error("Error deleting favorite");
                }
            },

            getTodos: async () => {
                const store = getStore();
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                if (!store.token) return;

                const resp = await fetch(backendUrl + "/api/todos", {
                    headers: { "Authorization": "Bearer " + store.token }
                });

                if (!resp.ok) {
                    console.error("Error loading todos");
                    return;
                }

                const data = await resp.json();
                if (Array.isArray(data)) setStore({ todos: data });
            },

            addTodo: async (label) => {
                const store = getStore();
                const actions = getActions();
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                if (!store.token) return;

                const resp = await fetch(backendUrl + "/api/todos", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + store.token 
                    },
                    body: JSON.stringify({ label })
                });

                if (resp.ok) {
                    actions.getTodos();
                } else {
                    console.error("Error adding todo");
                }
            },

            deleteTodo: async (id) => {
                const store = getStore();
                const actions = getActions();
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                if (!store.token) return;

                const resp = await fetch(backendUrl + "/api/todos/" + id, {
                    method: "DELETE",
                    headers: { "Authorization": "Bearer " + store.token }
                });

                if (resp.ok) {
                    actions.getTodos();
                } else {
                    console.error("Error deleting todo");
                }
            }
        }
    };
};

export default getState;