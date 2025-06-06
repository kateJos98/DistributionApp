import { useState } from "react";
import { login } from "../services/api";
import { saveToken } from "../utils/storage";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(username, password);
      saveToken(data.access_token);
      onLogin();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Ingresar</button>
      {error && <p style={{color:"red"}}>{error}</p>}
    </form>
  );
}
