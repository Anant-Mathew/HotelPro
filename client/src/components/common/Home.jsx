import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { roomAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import BookingModal from "../user/BookingModal";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchType, setSearchType] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const heroSlides = [
    {
      title: "Experience Unrivaled Luxury & Comfort",
      subtitle: "Discover modern rooms, scenic views, and personalized hospitality services at RoomsForUse.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
    },
    {
      title: "Deluxe Suites Designed For Royalty",
      subtitle: "High-speed internet, king-sized bedding, spa-inspired bathrooms, and 24/7 room concierge.",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80"
    },
    {
      title: "Seamless Booking & Instant Check-in",
      subtitle: "Effortlessly reserve your stay in seconds with encrypted payment protection and instant confirmation.",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80"
    }
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomAPI.getAllRooms();
        setRooms(res.data);
        setFilteredRooms(res.data);
      } catch (err) {
        console.error("Failed to load rooms:", err);
      }
    };
    fetchRooms();

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  const handleFilterChange = (type) => {
    setSearchType(type);
    if (type === "all") {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter((r) => r.type.toLowerCase().includes(type.toLowerCase())));
    }
  };

  const handleRoomAction = (room) => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (isAdmin) {
      navigate("/adminhome");
    } else {
      setSelectedRoom(room);
    }
  };

  return (
    <div>
      {/* Hero Carousel */}
      <div style={{ position: "relative", height: 460, overflow: "hidden", backgroundColor: "#0f172a" }}>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              inset: 0,
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.75)), url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "0 24px",
              color: "white"
            }}
          >
            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 48px)",
                fontWeight: 700,
                maxWidth: 850,
                marginBottom: 16,
                letterSpacing: "-0.5px"
              }}
            >
              {slide.title}
            </h1>
            <p
              style={{
                fontSize: "clamp(15px, 2vw, 18px)",
                maxWidth: 680,
                marginBottom: 28,
                color: "#e2e8f0"
              }}
            >
              {slide.subtitle}
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              <button
                onClick={() => {
                  const el = document.getElementById("available-rooms-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "12px 28px",
                  borderRadius: 6,
                  fontSize: 15,
                  fontWeight: 600
                }}
              >
                Browse Rooms
              </button>
              {!isAuthenticated && (
                <Link
                  to="/signup"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(4px)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    padding: "12px 28px",
                    borderRadius: 6,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none"
                  }}
                >
                  Join RoomsForUse
                </Link>
              )}
            </div>
          </div>
        ))}

        {/* Carousel indicators */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 10
          }}
        >
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: currentSlide === i ? 28 : 10,
                height: 10,
                borderRadius: 5,
                background: currentSlide === i ? "#38bdf8" : "rgba(255,255,255,0.4)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>
      </div>

      {/* About Section */}
      <section style={{ padding: "60px 20px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>
          About RoomsForUse & HotelPro
        </h2>
        <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.8, maxWidth: 840, margin: "0 auto 40px" }}>
          In today’s fast-paced hospitality industry, managing hotel operations efficiently and securely
          is more crucial than ever. HotelPro delivers an enterprise-grade platform built for independent
          boutique properties and luxury chains alike. Enjoy real-time room availability, seamless multi-role
          dashboards, and transparent booking management.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
            textAlign: "left"
          }}
        >
          <div style={{ background: "white", padding: 24, borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>🛡️</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#1e293b" }}>
              Secure & Encrypted
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
              JWT authenticated sessions, role-based access control, and protected transactions safeguard every guest interaction.
            </p>
          </div>

          <div style={{ background: "white", padding: 24, borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>⚡</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#1e293b" }}>
              Instant Room Availability
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
              Live inventory tracking prevents double-booking and lets you manage check-ins and check-outs seamlessly.
            </p>
          </div>

          <div style={{ background: "white", padding: 24, borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>💳</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#1e293b" }}>
              Transparent Payments
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
              Hassle-free digital card checkouts with instant booking receipts and straightforward cancellation options.
            </p>
          </div>
        </div>
      </section>

      {/* Available Rooms Section */}
      <section
        id="available-rooms-section"
        style={{ backgroundColor: "#f8fafc", padding: "60px 20px", borderTop: "1px solid #e2e8f0" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 32
            }}
          >
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b" }}>Featured Rooms & Suites</h2>
              <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
                Choose the best room for your vacation or business retreat.
              </p>
            </div>

            {/* Filter buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              {["all", "delux", "non-delux"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange(type)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 6,
                    border: searchType === type ? "1px solid #2563eb" : "1px solid #cbd5e1",
                    background: searchType === type ? "#2563eb" : "#ffffff",
                    color: searchType === type ? "#ffffff" : "#475569",
                    fontWeight: 600,
                    fontSize: 13,
                    textTransform: "capitalize"
                  }}
                >
                  {type === "all" ? "All Rooms" : type}
                </button>
              ))}
            </div>
          </div>

          <div className="rooms-grid">
            {filteredRooms.map((room) => (
              <div key={room._id} className="room-card">
                <img
                  src={
                    room.photos && room.photos.length > 0
                      ? room.photos[0]
                      : "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={`Room ${room.roomNumber}`}
                  className="room-card-img"
                />
                <div className="room-card-body">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <h3 className="room-card-title">Room Type: {room.type}</h3>
                    <span className={room.type.toLowerCase().includes("non") ? "badge-nondelux" : "badge-delux"}>
                      Room #{room.roomNumber}
                    </span>
                  </div>

                  <div className="room-card-meta">
                    <div><strong>Room Capacity:</strong> {room.count} People</div>
                    <div><strong>Rent:</strong> ₹{room.rent} per day</div>
                    <div><strong>Type:</strong> {room.type}</div>
                    <div style={{ marginTop: 6, color: "#64748b", fontSize: 13, height: 42, overflow: "hidden" }}>
                      {room.description}
                    </div>
                  </div>

                  <button onClick={() => handleRoomAction(room)} className="room-card-btn">
                    {isAuthenticated ? "Book Now" : "Learn More"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Dialog Modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onSuccess={() => {
            setSelectedRoom(null);
            navigate("/mybookings");
          }}
        />
      )}
    </div>
  );
}
