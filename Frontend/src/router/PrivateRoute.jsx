import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { validateRole } from "../services/authorizationService"; // asegúrate que esté exportado

export default function PrivateRoute({ allowedRoles }) {
  const [authorized, setAuthorized] = useState(null); // null = en validación

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const data = await validateRole(); 
        const userRole = data.role;

        if (allowedRoles.includes(userRole)) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        setAuthorized(false);
      }
    };

    checkAccess();
  }, [allowedRoles]);

  if (authorized === null) return <p>Cargando...</p>;
  if (!authorized) return <Navigate to="/" />;

  return <Outlet />;
}
