import React, { useState, useEffect } from "react";
import { login } from "../services/authService";
import { validateRole } from "../services/authorizationService";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await validateRole(); // Consulta backend con cookie
        if (data.role === "admin") navigate("/admin-dashboard");
        else if (data.role === "cliente") navigate("/cliente-dashboard");
        else if (data.role === "repartidor") navigate("/repartidor-dashboard");
        else navigate("/");
      } catch {
        // No autenticado, queda en login
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      setError("");
      alert("Login exitoso 🎉");

      if (data.role === "admin") navigate("/admin-dashboard");
      else if (data.role === "cliente") navigate("/cliente-dashboard");
      else if (data.role === "repartidor") navigate("/repartidor-dashboard");
      else navigate("/");
    } catch (err) {
      setError("Credenciales inválidas o error de conexión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Ingresar
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        <p className="text-center text-sm mt-4 text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/SelectRegister" className="text-blue-500 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
