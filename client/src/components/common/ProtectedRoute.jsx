// ==========================================
// PROTECTED ROUTE COMPONENT
// ==========================================
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  // get logged in user from localStorage safely
  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      user = JSON.parse(stored);
    }
  } catch (e) {
    user = null;
  }

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
