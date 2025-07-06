// src/services/authService.js
import axios from "axios";

export async function login(email, password) {
  const response = await axios.post("http://localhost:8001/auth/login", {
    email,
    password,
  });

  return response.data; // Returns { access_token, token_type, user, role }
}
