import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Function to get token and role from localStorage
const getAuth = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return { token, role };
};

/**
 * Component that protects routes according to role
 * @param {Array} allowedRoles - List of allowed roles (["admin"], ["client"], etc.)
 */
export default function PrivateRoute({ allowedRoles }) {
  const { token, role } = getAuth();

  if (!token) {
    // Not authenticated
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) {
    // Unauthorized
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
