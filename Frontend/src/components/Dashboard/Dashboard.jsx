import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import ClientDashboard from "./ClientDashboard";
import DeliveryDashboard from "./DeliveryDashboard";
import { getToken } from "../../utils/storage";
import { validateRole } from "../../services/api";

export default function Dashboard({ onLogout }) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function fetchRole() {
      try {
        const token = getToken();
        const data = await validateRole("any", token); // "any" es opcional, depende cómo esté tu backend
        setRole(data.role);
      } catch {
        onLogout();
      }
    }
    fetchRole();
  }, []);

  if (!role) return <p>Cargando...</p>;

  if (role === "admin") return <AdminDashboard onLogout={onLogout} />;
  if (role === "cliente") return <ClientDashboard onLogout={onLogout} />;
  if (role === "repartidor") return <DeliveryDashboard onLogout={onLogout} />;

  return <p>Rol desconocido</p>;
}
