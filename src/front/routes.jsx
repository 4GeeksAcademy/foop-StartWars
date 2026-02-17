import { 
    Route, 
    createBrowserRouter, 
    createRoutesFromElements 
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Single } from "./pages/Single";
import { TodoList } from "./pages/TodoList";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/todos" element={<TodoList />} />
            <Route path="/people/:theid" element={<Single type="people" />} />
            <Route path="/planets/:theid" element={<Single type="planet" />} />
            <Route path="/vehicles/:theid" element={<Single type="vehicle" />} />
            <Route path="/spaceships/:theid" element={<Single type="spaceship" />} />
            <Route path="/speciess/:theid" element={<Single type="species" />} /> 
            <Route path="/films/:theid" element={<Single type="film" />} />
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