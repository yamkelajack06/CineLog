import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import VerifyPage from "../pages/VerificationPage";
import HomePage from "../pages/HomePage";

const router = createBrowserRouter([
    { path: "/",        element: <LandingPage /> },
    { path: "/login",   element: <AuthPage /> },
    { path: "/register", element: <AuthPage /> },
    { path: "/verify",  element: <VerifyPage /> },
    {path:"/browse", element: <HomePage/>}
])

export default router;