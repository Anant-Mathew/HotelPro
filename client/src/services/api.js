import axios from "axios";

const API = axios.create({
  baseURL: "" // uses Vite proxy or same-origin
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signUp: (userData) => API.post("/SignUp", userData),
  login: (credentials) => API.post("/Login", credentials),
  getAllUsers: () => API.get("/getallusers")
};

export const roomAPI = {
  getAllRooms: () => API.get("/getallrooms"),
  addRoom: (roomData) => API.post("/addroom", roomData),
  deleteRoom: (id) => API.delete(`/api/rooms/${id}`)
};

export const bookingAPI = {
  bookRoom: (bookingData) => API.post("/bookroom", bookingData),
  getBookingsByUser: (userId) => API.post("/getbookingsbyuserid", { userid: userId }),
  getAllBookings: () => API.get("/getallbookings"),
  cancelBooking: (bookingid, roomid) => API.post("/cancelbooking", { bookingid, roomid })
};

export default API;
