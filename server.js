import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import txnRoutes from "./routes/transactionRoutes.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Allow multiple origins
const allowedOrigins = [
  "http://localhost:3000", // Local frontend
  "https://finance-dashboard-nu-beryl.vercel.app", // Deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like Postman or server-to-server
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS policy blocked this origin"), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("API Running...");
});

connectDB();

// 🔥 Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", txnRoutes);
app.use("/api/users", userRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/summary", summaryRoutes);

// Use dynamic port for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});