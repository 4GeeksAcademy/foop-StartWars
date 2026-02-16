import { useContext, useState, createContext } from "react";
import getState from "../store";

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const [state, setState] = useState(() => {
        let globalStore = {};
        let globalActions = {};

        const helpers = {
            getStore: () => globalStore,
            getActions: () => globalActions,
            setStore: (updatedStore) => {
                globalStore = { ...globalStore, ...updatedStore };
                setState(prevState => ({
                    ...prevState,
                    store: globalStore
                }));
            }
        };

        const initialState = getState(helpers);
        
        globalStore = initialState.store;
        globalActions = initialState.actions;

        return { store: globalStore, actions: globalActions };
    });

    return (
        <StoreContext.Provider value={state}>
            {children}
        </StoreContext.Provider>
    );
}

export default function useGlobalReducer() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useGlobalReducer must be used within a StoreProvider");
    }
    return context; 
}