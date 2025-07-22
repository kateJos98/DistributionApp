import React, { useState, useEffect } from "react";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "admin") navigate("/cliente-dashboard");
      else if (role === "cliente") navigate("/cliente-dashboard");
      else if (role === "repartidor") navigate("/repartidor-dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      const { access_token, role } = data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);

      setToken(access_token);
      setError("");
      alert("Login exitoso 🎉");

      if (role === "admin") navigate("/cliente-dashboard");
      else if (role === "cliente") navigate("/cliente");
      else if (role === "repartidor") navigate("/repartidor-dashboard");
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

        {token && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Token:</p>
            <textarea
              value={token}
              readOnly
              className="w-full h-20 p-2 border rounded bg-gray-100"
            />
          </div>
        )}
      </div>
    </div>
  );
}
