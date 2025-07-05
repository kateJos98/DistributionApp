import React from "react";
import SidebarCliente from "./components/SidebarCliente";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";

const ClienteDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarCliente />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClienteDashboard;
