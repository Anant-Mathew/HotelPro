import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1e293b",
        color: "#94a3b8",
        padding: "40px 20px 24px",
        marginTop: "auto"
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 32,
          marginBottom: 32
        }}
      >
        <div>
          <h3 style={{ color: "#ffffff", fontSize: 20, marginBottom: 12 }}>
            RoomsForUse <span style={{ fontSize: 13, color: "#38bdf8" }}>by HotelPro</span>
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            Modern Hotel Management & Booking Solution providing seamless reservations, real-time
            occupancy tracking, and secure hospitality operations.
          </p>
        </div>

        <div>
          <h4 style={{ color: "#ffffff", fontSize: 16, marginBottom: 12 }}>Quick Navigation</h4>
          <ul style={{ listStyle: "none", padding: 0, fontSize: 14, lineHeight: 2 }}>
            <li>
              <Link to="/" style={{ color: "#94a3b8" }}>Home & Suites</Link>
            </li>
            <li>
              <Link to="/login" style={{ color: "#94a3b8" }}>Guest Login</Link>
            </li>
            <li>
              <Link to="/signup" style={{ color: "#94a3b8" }}>Create Account</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: "#ffffff", fontSize: 16, marginBottom: 12 }}>Hospitality Services</h4>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            24/7 Front Desk Concierge<br />
            Instant Digital Check-in<br />
            Verified Clean Rooms & Suites<br />
            Secure Card Payment Processing
          </p>
        </div>

        <div>
          <h4 style={{ color: "#ffffff", fontSize: 16, marginBottom: 12 }}>Contact Support</h4>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            Email: reservations@hotelpro.local<br />
            Support: +91 97049 27807<br />
            Available 24 hours daily
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #334155",
          paddingTop: 20,
          textAlign: "center",
          fontSize: 13,
          color: "#64748b"
        }}
      >
        © {new Date().getFullYear()} HotelPro / RoomsForUse. All rights reserved. MERN Architecture.
      </div>
    </footer>
  );
}
