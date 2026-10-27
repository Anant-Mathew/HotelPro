# HotelPro - Complete Hotel Booking & Management Solution (RoomsForUse)

A modern, full-stack **Hotel Management & Room Reservation System** built with the **MERN Stack** (MongoDB/Embedded Storage, Express.js, React 18, Node.js). 
s
---

## 🔑 Demo Accounts to Test

| Role | Name | Email | Password | Phone |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | sun | `s@gmail.com` | `password123` | 9704927807 |
| **Admin** | tousif | `tousif@gmail.com` | `password123` | 9704927891 |
| **Ordinary** | rohan | `rohan3@gmail.com` | `password123` | 9704927800 |
| **Ordinary** | sid | `sid@gmail.com` | `password123` | 9704927807 |

*(You can also register new accounts directly from the Sign Up page)*

---

## 🏛️ Project Structure

```
hotelpro/
│
├── package.json                 # Root script runner (npm start, npm run dev)
├── .gitignore                   # Tells GitHub to ignore node_modules and logs
├── README.md                    # Project documentation & GitHub instructions
├── server/                      # BACKEND (Express & Node.js)
│   ├── package.json
│   ├── server.js                # Express API & Frontend Static Web Server
│   ├── config/
│   │   └── db.js                # Dual-mode database connector
│   ├── models/                  # User, Room, and Booking data schemas
│   │   ├── userModel.js
│   │   ├── roomModel.js
│   │   └── bookingModel.js
│   └── data/                    # JSON storage engine & initial seed data
│       ├── store.js
│       └── hotel_db.json
│
└── client/                      # FRONTEND (React 18 & Vite)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx              # Main Router
        ├── App.css              # Custom styling
        └── components/
            ├── common/          # Navbar, Footer, Home, Login, SignUp
            ├── user/            # UserHome, BookingHistory
            └── admin/           # AdminHome (Tabs for Bookings, Rooms, Add Room, Users)
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router v6, Axios, Custom Bootstrap & Material Inspired CSS
- **Backend**: Node.js, Express.js 4, JSON Web Token (JWT), Bcrypt.js, CORS, Body-Parser
- **Database**: Automatic dual-mode:
  - Connects to local MongoDB (`mongodb://127.0.0.1:27017/hotel`) if online.
  - Automatically falls back to built-in JSON file store (`server/data/hotel_db.json`) if MongoDB service is offline, ensuring 100% uptime with zero setup errors.
- **License**: MIT
