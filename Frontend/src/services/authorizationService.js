export const validateRole = async () => {
  try {
    const response = await fetch("http://3.227.175.211/validate-role", {
      method: "GET",
      credentials: "include", // <- para enviar cookie del token
    });

    if (!response.ok) {
      throw new Error("No autorizado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al validar rol:", error);
    throw error;
  }
};