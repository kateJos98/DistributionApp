import React from "react";
import { useNavigate } from "react-router-dom";

export default function SeleccionarRegistro() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>¿Cómo deseas registrarte?</h2>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px", gap: "20px" }}>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            width: "200px",
            cursor: "pointer",
            background: "#e3fcef"
          }}
          onClick={() => navigate("/register-customer")}
        >
          <h3>🧍 Cliente</h3>
          <p>Comprar y recibir productos.</p>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            width: "200px",
            cursor: "pointer",
            background: "#e6f0ff"
          }}
          onClick={() => navigate("/registro-repartidor")}
        >
          <h3>🚚 Repartidor</h3>
          <p>Entregar productos a clientes.</p>
        </div>
      </div>
    </div>
  );
}
