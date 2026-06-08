import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import VerifyPage from "../pages/VerificationPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import HomePage from "../pages/HomePage";
import MovieDetailPage from "../pages/MovieDetailsPage";
import Dashboard from "../pages/Dashboard";
import WatchList from "../pages/Watchlist";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <AuthPage /> },
  { path: "/register", element: <AuthPage /> },
  { path: "/verify", element: <VerifyPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/browse", element: <HomePage /> },
  { path: "/details/:mediaType/:id", element: <MovieDetailPage /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/watchlist", element: <WatchList /> },
]);

export default router;
