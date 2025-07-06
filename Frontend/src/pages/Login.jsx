import React, { useState } from "react";
import { login } from "../services/authService";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';



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
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
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
        navigate("/cliente");
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
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        ¿No tienes cuenta?
        <br />
        <Link to="/SelectRegister" style={{ color: "#007BFF" }}>
          Regístrate aquí
        </Link>

      </p>
      

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
