import { useState } from "react";
import "./DashboardStyles.css"; // Asegúrate de tener estilos compartidos si los usas

export default function DeliveryDashboard({ onLogout }) {
  const [activeView, setActiveView] = useState("ver");

  const renderContent = () => {
    switch (activeView) {
      case "ver":
        return <p>Aquí se listan los pedidos asignados al repartidor.</p>;
      case "actualizar":
        return <p>Aquí se actualiza el estado de los pedidos.</p>;
      default:
        return <p>Selecciona una opción del menú.</p>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Repartidor</h2>
        <ul>
          <li onClick={() => setActiveView("ver")}>Ver Pedidos</li>
          <li onClick={() => setActiveView("actualizar")}>Actualizar Estado</li>
        </ul>
        <button onClick={onLogout} className="logout-btn">Cerrar sesión</button>
      </aside>
      <main className="dashboard-content">
        <h1>Panel de Repartidor</h1>
        {renderContent()}
      </main>
    </div>
  );
}
