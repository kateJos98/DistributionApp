import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { validateRole } from "../services/authorizationService";

export default function PrivateRoute({ allowedRoles }) {
  const [authorized, setAuthorized] = useState(null); // null = en proceso de validación

  useEffect(() => {
    const checkAccess = async () => {
      try {
        //const data = await validateRole();
        const userRole = data.role;

        if (allowedRoles.includes(userRole)) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch {
        setAuthorized(false);
      }
    };

    checkAccess();
  }, [allowedRoles]);

  if (authorized === null)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Cargando...</p>
      </div>
    );

  if (!authorized) return <Navigate to="/" />;

  return <Outlet />;
}
