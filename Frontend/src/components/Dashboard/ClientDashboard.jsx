import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const clientMenu = [
  { label: "Ver Información" },
  { label: "Editar Información" },
  { label: "Solicitar Pedido", submenu: ["Crear", "Modificar", "Eliminar"] }
];

export default function ClientDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="client" menu={clientMenu} />
      <div style={{ padding: "20px", flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}
