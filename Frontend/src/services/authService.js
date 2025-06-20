// src/services/authService.js
import axios from "axios";

export async function login(username, password) {
  const response = await axios.post("http://localhost:8001/auth/login", {
    username,
    password,
  });

  return response.data; // Returns { access_token, token_type, user, role }
}
