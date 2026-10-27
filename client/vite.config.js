import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true
      },
      "/SignUp": {
        target: "http://localhost:8001",
        changeOrigin: true
      },
      "/Login": {
        target: "http://localhost:8001",
        changeOrigin: true
      },
      "/addroom": {
        target: "http://localhost:8001",
        changeOrigin: true
      },
      "/getallrooms": {
        target: "http://localhost:8001",
        changeOrigin: true
      },
      "/bookroom": {
        target: "http://localhost:8001",
        changeOrigin: true
      },
      "/cancelbooking": {
        target: "http://localhost:8001",
        changeOrigin: true
      },
      "/getbookingsbyuserid": {
        target: "http://localhost:8001",
        changeOrigin: true
      },
      "/getallbookings": {
        target: "http://localhost:8001",
        changeOrigin: true
      },
      "/getallusers": {
        target: "http://localhost:8001",
        changeOrigin: true
      }
    }
  }
});
