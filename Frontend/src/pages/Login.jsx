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
      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "cliente") navigate("/cliente-dashboard");
      else if (role === "repartidor") navigate("/repartidor-dashboard");
    }
  }, []);

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

      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "cliente") navigate("/cliente-dashboard");
      else if (role === "repartidor") navigate("/repartidor-dashboard");
      else navigate("/");
    } catch (err) {
      setError("Credenciales inválidas o error de conexión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-cyan-300">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Iniciar sesión</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            Ingresar
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}

        <div className="mt-6 text-right">
          <Link to="/SelectRegister" className="text-sm text-blue-700 hover:underline">
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>

        {token && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700">Token:</p>
            <textarea
              value={token}
              readOnly
              className="w-full mt-2 p-2 border rounded text-xs text-gray-600"
              rows={4}
            />
          </div>
        )}
      </div>
    </div>
  );
}
