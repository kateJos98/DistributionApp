import React from "react";
import SidebarCliente from "./components/SidebarCliente";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import LogoutButton from "./components/LogoutButton";

const ClienteDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarCliente />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header with logout button aligned right */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Bienvenido al Dashboard Cliente
          </h1>
          <LogoutButton />
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClienteDashboard;
