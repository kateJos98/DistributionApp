import React, { useState } from "react";

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("monitoreo");

  const renderContent = () => {
    switch (activeMenu) {
      case "repartidores":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Gestión de Repartidores</h2>
            <p>Aquí puedes crear, modificar o eliminar repartidores.</p>
            {/* Aquí puedes agregar formularios, tablas o componentes específicos */}
          </div>
        );
      case "inventario":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Gestión de Inventario</h2>
            <p>Administra el inventario de tanques y productos.</p>
            {/* Formularios o tablas para inventario */}
          </div>
        );
      case "monitoreo":
      default:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Monitoreo del Sistema</h2>
            <p>Panel de control con estadísticas, alertas y logs.</p>
            {/* Aquí podrías mostrar gráficos o datos en vivo */}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
        </div>
        <ul>
          <li
            onClick={() => setActiveMenu("repartidores")}
            className={`cursor-pointer px-6 py-3 hover:bg-blue-100 ${
              activeMenu === "repartidores" ? "bg-blue-200 font-semibold" : ""
            }`}
          >
            Gestión de Repartidores
          </li>
          <li
            onClick={() => setActiveMenu("inventario")}
            className={`cursor-pointer px-6 py-3 hover:bg-blue-100 ${
              activeMenu === "inventario" ? "bg-blue-200 font-semibold" : ""
            }`}
          >
            Gestión de Inventario
          </li>
          <li
            onClick={() => setActiveMenu("monitoreo")}
            className={`cursor-pointer px-6 py-3 hover:bg-blue-100 ${
              activeMenu === "monitoreo" ? "bg-blue-200 font-semibold" : ""
            }`}
          >
            Monitoreo
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
