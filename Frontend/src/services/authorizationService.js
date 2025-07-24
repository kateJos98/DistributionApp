export const validateUserRole = async () => {
  const response = await fetch("http://3.214.52.43:8002/validate-role", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Token inválido");

  return await response.json();
};
