import React, { useState, useEffect, useRef } from "react";
import { login } from "../services/authService";
import { validateRole } from "../services/authorizationService";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Para autocompletado
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

  // Cargar emails guardados en localStorage
  useEffect(() => {
    const savedEmails = JSON.parse(localStorage.getItem("savedEmails") || "[]");
    setEmailSuggestions(savedEmails);
  }, []);

  // Función para filtrar emails sugeridos según input
  const filterSuggestions = (input) => {
    if (!input) return [];
    return emailSuggestions.filter((e) =>
      e.toLowerCase().startsWith(input.toLowerCase())
    );
  };

  const handleEmailChange = (e) => {
    const input = e.target.value;
    setEmail(input);
    if (input.length > 0) {
      const filtered = filterSuggestions(input);
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
      setActiveSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  // Manejo teclado para selección con flechas y enter
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        Math.min(prev + 1, filteredSuggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (activeSuggestionIndex >= 0) {
        e.preventDefault();
        setEmail(filteredSuggestions[activeSuggestionIndex]);
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Cuando se clickea una sugerencia
  const handleSuggestionClick = (suggestion) => {
    setEmail(suggestion);
    setShowSuggestions(false);
  };

  // Guardar email exitoso en localStorage
  const saveEmail = (emailToSave) => {
    let emails = JSON.parse(localStorage.getItem("savedEmails") || "[]");
    if (!emails.includes(emailToSave)) {
      emails.push(emailToSave);
      localStorage.setItem("savedEmails", JSON.stringify(emails));
      setEmailSuggestions(emails);
    }
  };

  // Validar sesión al cargar la página
  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await validateRole();
        if (data.role === "admin") navigate("/admin");
        else if (data.role === "cliente") navigate("/cliente");
        else if (data.role === "repartidor") navigate("/repartidor");
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
      saveEmail(email); // Guardamos el email exitoso
      alert("Login exitoso 🎉");

      if (data.role === "admin") navigate("/admin-dashboard");
      else if (data.role === "cliente") navigate("/cliente");
      else if (data.role === "repartidor") navigate("/repartidor-dashboard");
      else navigate("/");
    } catch (err) {
      setError("Credenciales inválidas o error de conexión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-200 to-blue-300">
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Correo electrónico"
                value={email}
                onChange={handleEmailChange}
                onKeyDown={handleKeyDown}
                required
                autoComplete="off"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    border: "1px solid #ccc",
                    backgroundColor: "white",
                    listStyleType: "none",
                    margin: 0,
                    padding: 0,
                    maxHeight: "150px",
                    overflowY: "auto",
                    zIndex: 1000,
                  }}
                  ref={suggestionsRef}
                >
                  {filteredSuggestions.map((suggestion, index) => (
                    <li
                      key={suggestion}
                      style={{
                        padding: "8px",
                        backgroundColor:
                          index === activeSuggestionIndex ? "#ddd" : "white",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
    </div>
  );
}
