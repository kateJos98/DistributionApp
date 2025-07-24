export const login = async (email, password) => {
  const response = await fetch("http://3.214.52.43:8001/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // ✅ IMPORTANTE para incluir cookies en la petición
  });

  if (!response.ok) {
    throw new Error("Login fallido");
  }

  return await response.json(); // ✅ Puedes retornar datos útiles como email, role, etc.
};