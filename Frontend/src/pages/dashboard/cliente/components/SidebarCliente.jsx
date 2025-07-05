import React from "react";
import { NavLink } from "react-router-dom";

const SidebarCliente = () => {
  return (
    <aside className="w-64 bg-blue-800 text-white p-4">
      <nav>
        <ul className="space-y-4">
          <li><NavLink to="/cliente/perfil" className="hover:underline">👤 Ver perfil</NavLink></li>
          <li><NavLink to="/cliente/editar" className="hover:underline">📝 Editar perfil</NavLink></li>
          <li><NavLink to="/cliente/ubicacion" className="hover:underline">📍 Ubicación</NavLink></li>
          <li><NavLink to="/cliente/repartidores" className="hover:underline">🧭 Buscar repartidor</NavLink></li>
          <li><NavLink to="/" className="hover:underline">🚪 Cerrar sesión</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarCliente;
