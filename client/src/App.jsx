// ==========================================
// MAIN REACT APP COMPONENT
// ==========================================
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importing common components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Login from "./components/common/Login";
import SignUp from "./components/common/SignUp";
import Home from "./components/common/Home";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Importing user and admin components
import UserHome from "./components/user/UserHome";
import BookingHistory from "./components/user/BookingHistory";
import AdminHome from "./components/admin/AdminHome";

function App() {
  return (
    <div className="App">
      <Router>
        {/* Navigation Bar */}
        <Navbar />

        {/* Content Routes */}
        <div className="content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register" element={<SignUp />} />

            {/* Ordinary User protected routes */}
            <Route
              path="/userhome"
              element={
                <ProtectedRoute>
                  <UserHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mybookings"
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookinghistory"
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />

            {/* Admin protected route */}
            <Route
              path="/adminhome"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminHome />
                </ProtectedRoute>
              }
            />

            {/* Default fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </Router>
    </div>
  );
}

export default App;
