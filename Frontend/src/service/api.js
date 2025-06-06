const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:8001";
const AUTHZ_URL = import.meta.env.VITE_AUTHZ_URL || "http://localhost:8000";

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function createUser(userData, token) {
  const res = await fetch(`${API_URL}/auth/create-user`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Create user failed");
  return res.json();
}

export async function validateRole(requiredRole, token) {
  const res = await fetch(`${AUTHZ_URL}/validate-role?required_role=${requiredRole}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Role validation failed");
  return res.json();
}

// Registrar cliente
export async function registerCustomer(customerData) {
  const res = await fetch(`${CUSTOMER_URL}/customer/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Register failed");
  }
  return res.json();
}
