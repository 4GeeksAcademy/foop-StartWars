const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      user: null,
      people: [],
      planets: [],
      vehicles: [],
      spaceships: [],
      species: [],
      films: [],
      favorites: [],
      todos: [],
    },
    actions: {
      syncTokenFromSessionStore: () => {
        const token = sessionStorage.getItem("token");
        if (token && token !== "" && token !== undefined) {
          setStore({ token: token });
        }
      },

      login: async (email, password) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const resp = await fetch(backendUrl + "/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!resp.ok) {
          console.error("Error en login: " + resp.statusText);
          return false;
        }

        const data = await resp.json();
        sessionStorage.setItem("token", data.token);
        setStore({ token: data.token, user: data.user_id });

        getActions().getFavorites();
        return true;
      },

      signup: async (email, password) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const resp = await fetch(backendUrl + "/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!resp.ok) {
          console.error("Error en registro: " + resp.statusText);
          return false;
        }

        return true;
      },

      logout: () => {
        sessionStorage.removeItem("token");
        setStore({ token: null, user: null, favorites: [], todos: [] });
      },

      loadData: async (entity) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const resp = await fetch(`${backendUrl}/api/${entity}`);

        if (!resp.ok) {
          console.error(`Error cargando ${entity}: ${resp.statusText}`);
          return;
        }

        const data = await resp.json();

        const key =
          entity === "people" || entity === "species" ? entity : entity + "s";

        setStore({ [key]: data });
      },

      loadAllStarWars: () => {
        const actions = getActions();
        actions.loadData("people");
        actions.loadData("planet");
        actions.loadData("vehicle");
        actions.loadData("spaceship");
        actions.loadData("species");
        actions.loadData("film");
      },

      getFavorites: async () => {
        const store = getStore();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!store.token) return;

        const resp = await fetch(backendUrl + "/api/users/favorites", {
          headers: { Authorization: "Bearer " + store.token },
        });

        if (!resp.ok) {
          console.error("Error cargando favoritos");
          return;
        }

        const data = await resp.json();
        setStore({ favorites: data });
      },

      addFavorite: async (type, id) => {
        const store = getStore();
        const actions = getActions();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!store.token) {
          alert("Debes iniciar sesión para añadir favoritos");
          return;
        }

        const resp = await fetch(`${backendUrl}/api/favorite/${type}/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + store.token,
          },
        });

        if (resp.ok) {
          actions.getFavorites();
        } else {
          console.error("Error añadiendo favorito");
        }
      },

      deleteFavorite: async (type, id) => {
        const store = getStore();
        const actions = getActions();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const resp = await fetch(`${backendUrl}/api/favorite/${type}/${id}`, {
          method: "DELETE",
          headers: { Authorization: "Bearer " + store.token },
        });

        if (resp.ok) {
          actions.getFavorites();
        } else {
          console.error("Error eliminando favorito");
        }
      },

      // --- TODO LIST ---

      getTodos: async () => {
        const store = getStore();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!store.token) return;

        const resp = await fetch(backendUrl + "/api/todos", {
          headers: { Authorization: "Bearer " + store.token },
        });

        if (!resp.ok) {
          console.error("Error cargando todos");
          return;
        }

        const data = await resp.json();
        if (Array.isArray(data)) setStore({ todos: data });
      },

      addTodo: async (label) => {
        const store = getStore();
        const actions = getActions();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const resp = await fetch(backendUrl + "/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + store.token,
          },
          body: JSON.stringify({ label }),
        });

        if (resp.ok) {
          actions.getTodos();
        } else {
          console.error("Error creando tarea");
        }
      },

      deleteTodo: async (id) => {
        const store = getStore();
        const actions = getActions();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const resp = await fetch(backendUrl + "/api/todos/" + id, {
          method: "DELETE",
          headers: { Authorization: "Bearer " + store.token },
        });

        if (resp.ok) {
          actions.getTodos();
        } else {
          console.error("Error borrando tarea");
        }
      },
    },
  };
};

export default getState;
