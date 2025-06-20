import React, { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      const { access_token, role } = data;

      // Guarda en localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);

      setToken(access_token);
      setError("");
      alert("Login exitoso 🎉");

      // Redirige según rol
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "cliente") {
        navigate("/cliente-dashboard");
      } else if (role === "repartidor") {
        navigate("/repartidor-dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError("Credenciales inválidas o error de conexión");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "8px" }}>
          Ingresar
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {token && (
        <div>
          <p><strong>Token:</strong></p>
          <textarea value={token} readOnly style={{ width: "100%", height: "80px" }} />
        </div>
      )}
    </div>
  );
}
