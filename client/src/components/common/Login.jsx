// ==========================================
// USER LOGIN COMPONENT
// ==========================================
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthIllustration from "./AuthIllustration";

export default function Login() {
  // state variables for login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // function to handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password!");
      return;
    }

    try {
      // calling login api
      const response = await axios.post("/Login", {
        email: email,
        password: password
      });

      console.log(response.data);

      if (response.data.status) {
        // save user and token in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        alert("Login successful!");

        // redirect based on user role
        if (response.data.user.userType === "Admin") {
          window.location.href = "/adminhome";
        } else {
          window.location.href = "/userhome";
        }
      } else {
        alert(response.data.msg || "Invalid credentials");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("Invalid email or password");
      }
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "40px 20px", background: "#fff" }}>
      <div style={{ display: "flex", maxWidth: "1050px", width: "100%", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "40px" }}>
        
        {/* Left side illustration */}
        <div style={{ flex: "1", minWidth: "320px", display: "flex", justifyContent: "center" }}>
          <AuthIllustration />
        </div>

        {/* Right side login form (matching screenshot) */}
        <div style={{ flex: "1", minWidth: "320px", maxWidth: "420px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px", color: "#222" }}>
            Login for the Account
          </h2>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>

            {/* Login button */}
            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#2e72d2",
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                letterSpacing: "0.5px"
              }}
            >
              LOGIN
            </button>
          </form>

          {/* Link to register */}
          <p style={{ marginTop: "16px", fontSize: "14px", color: "#555" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#d93838", fontWeight: "bold", textDecoration: "none" }}>
              Register
            </Link>
          </p>

          {/* Quick test buttons for easy demo */}
          <div style={{ marginTop: "24px", padding: "10px", background: "#f8f9fa", borderRadius: "4px", border: "1px dashed #ccc", fontSize: "12px" }}>
            <strong>Demo Logins:</strong>
            <div style={{ marginTop: "8px", display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => {
                  setEmail("s@gmail.com");
                  setPassword("password123");
                }}
                style={{ padding: "4px 8px", cursor: "pointer", background: "#e2e8f0", border: "none", borderRadius: "3px" }}
              >
                Admin (sun)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("rohan3@gmail.com");
                  setPassword("password123");
                }}
                style={{ padding: "4px 8px", cursor: "pointer", background: "#e2e8f0", border: "none", borderRadius: "3px" }}
              >
                Guest (rohan)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
