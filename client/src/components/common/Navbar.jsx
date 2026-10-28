// ==========================================
// NAVBAR COMPONENT
// ==========================================
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // get user from local storage safely
  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      user = JSON.parse(stored);
    }
  } catch (e) {
    user = null;
  }
  const isAdmin = user && user.userType === "Admin";

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/login");
  };

  // If Admin is logged in, show purple bar matching screenshot
  if (isAdmin) {
    return (
      <nav
        style={{
          background: "linear-gradient(90deg, #602bd7 0%, #3574fa 100%)",
          padding: "16px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white"
        }}
      >
        <Link
          to="/adminhome"
          style={{
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            textDecoration: "none"
          }}
        >
          RoomsForUse
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: "15px" }}>Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "15px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Logout
          </button>
        </div>
      </nav>
    );
  }

  // If Ordinary User is logged in, show User bar (matching SB Hotel screenshot)
  if (user) {
    return (
      <nav
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "16px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Link
          to="/userhome"
          style={{
            color: "#333333",
            fontSize: "26px",
            textDecoration: "none",
            fontWeight: "400"
          }}
        >
          SB Hotel
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span style={{ color: "#555555", fontSize: "14px" }}>Hi, {user.name}</span>
          <Link
            to="/mybookings"
            style={{ color: "#555555", textDecoration: "none", fontSize: "14px" }}
          >
            My Bookings
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "none",
              color: "#555555",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </nav>
    );
  }

  // Not logged in visitor navbar (matching User Register screenshot)
  return (
    <nav
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <Link
        to="/"
        style={{
          color: "#334155",
          fontSize: "26px",
          fontWeight: "600",
          textDecoration: "none",
          fontFamily: "sans-serif"
        }}
      >
        RoomsForUse
      </Link>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>
          Home
        </Link>
        <Link to="/login" style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>
          Login
        </Link>
        <Link to="/signup" style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>
          SignUp
        </Link>
      </div>
    </nav>
  );
}
