// ==========================================
// USER REGISTER COMPONENT
// ==========================================
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthIllustration from "./AuthIllustration";

export default function SignUp() {
  // state variables for registration form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [c_password, setCpassword] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("Ordinary");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  // function to handle signup form submit
  const handleRegister = async (e) => {
    e.preventDefault();

    // validation
    if (!name || !email || !password || !phone) {
      alert("Please fill in all fields!");
      return;
    }

    if (c_password && password !== c_password) {
      alert("Passwords do not match!");
      return;
    }

    const userData = {
      name: name,
      email: email,
      password: password,
      phone: Number(phone),
      userType: userType
    };

    try {
      // calling signup api
      const response = await axios.post("/SignUp", userData);
      console.log(response.data);
      alert("Account created successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("Registration failed! Please try again.");
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

        {/* Right side register form (matching screenshot) */}
        <div style={{ flex: "1", minWidth: "320px", maxWidth: "420px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px", color: "#222" }}>
            Register for the Account
          </h2>

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: "16px" }}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                type="email"
                placeholder="Email Address"
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

            <div style={{ marginBottom: "16px" }}>
              <input
                type="password"
                placeholder="Confirm Password"
                value={c_password}
                onChange={(e) => setCpassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <input
                type="number"
                placeholder="Enter Mobile no."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

            {/* Select User Dropdown button matching screenshot */}
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  backgroundColor: "#2e72d2",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  letterSpacing: "0.5px"
                }}
              >
                SELECT USER ▾ ({userType})
              </button>

              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "36px",
                    left: 0,
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    zIndex: 10,
                    width: "160px"
                  }}
                >
                  <div
                    onClick={() => {
                      setUserType("Ordinary");
                      setShowDropdown(false);
                    }}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      fontSize: "14px",
                      background: userType === "Ordinary" ? "#f0f7ff" : "white"
                    }}
                  >
                    Ordinary (User)
                  </div>
                  <div
                    onClick={() => {
                      setUserType("Admin");
                      setShowDropdown(false);
                    }}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      fontSize: "14px",
                      background: userType === "Admin" ? "#f0f7ff" : "white"
                    }}
                  >
                    Admin (Staff)
                  </div>
                </div>
              )}
            </div>

            {/* Register button */}
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
              REGISTER
            </button>
          </form>

          {/* Link to login */}
          <p style={{ marginTop: "16px", fontSize: "14px", color: "#555" }}>
            Had an account?{" "}
            <Link to="/login" style={{ color: "#d93838", fontWeight: "bold", textDecoration: "none" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
