// ==========================================
// PROTECTED ROUTE COMPONENT
// ==========================================
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  // get logged in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // check if admin role is required
  if (adminOnly && user.userType !== "Admin") {
    alert("Access Denied: Only Admins can view this dashboard!");
    return <Navigate to="/userhome" replace />;
  }

  return children;
}
