import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import DashboardRouter from "./components/Dashboard/DashboardRouter";
import { getToken, clearToken } from "./utils/storage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const loggedIn = !!getToken();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          loggedIn ? <Navigate to="/dashboard" /> : <LoginForm />
        }
      />
      <Route
        path="/register"
        element={
          loggedIn ? <Navigate to="/dashboard" /> : (
            <RegisterForm
              onRegisterSuccess={() => {
                alert("Registro exitoso. Ahora inicia sesión.");
                window.location.href = "/login";
              }}
            />
          )
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardRouter
              onLogout={() => {
                clearToken();
                window.location.href = "/login";
              }}
            />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
