// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Single } from "./pages/Single";
import { TodoList } from "./pages/TodoList";
import { ForgotPassword } from "./pages/ForgotPassword";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} /> {/* <--- NUEVA RUTA */}
            
            {/* Rutas dinámicas */}
            <Route path="/people/:theid" element={<Single type="people" />} />
            <Route path="/planets/:theid" element={<Single type="planet" />} />
            
            <Route path="/todos" element={<TodoList />} />
            
            <Route path="*" element={<h1 className="text-center mt-5 text-warning">Not found!</h1>} />
        </Route>
    ),
    {
        future: {
            v7_relativeSplatPath: true,
            v7_fetcherPersist: true,
            v7_normalizeFormMethod: true,
            v7_partialHydration: true,
            v7_skipActionErrorRevalidation: true,
        }
    }
);