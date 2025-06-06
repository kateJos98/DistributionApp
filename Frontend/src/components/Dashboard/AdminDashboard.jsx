import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const adminMenu = [
  { label: "Repartidores", submenu: ["Crear", "Modificar", "Eliminar"] },
  { label: "Inventario", submenu: ["Agregar", "Modificar", "Eliminar"] },
  { label: "Monitoreo", submenu: ["Ver Estado"] }
];

export default function AdminDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="admin" menu={adminMenu} />
      <div style={{ padding: "20px", flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}
