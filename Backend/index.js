import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectdb from "./config/db.js";

import userroutes from "./routes/userroutes.js";
import categoryroutes from "./routes/categoryroutes.js";
import productroutes from "./routes/productroutes.js";
import sellerroutes from "./routes/sellerroutes.js";
import orderroutes from "./routes/orderroutes.js";
import cartroutes from "./routes/cartroutes.js";
import adminroutes from "./routes/adminroutes.js";

const app = express();

// Check environment variables
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "Loaded" : "Missing");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

connectdb();

app.use("/api", userroutes);
app.use("/api", categoryroutes);
app.use("/api", productroutes);
app.use("/api", sellerroutes);
app.use("/api", orderroutes);
app.use("/api", cartroutes);
app.use("/api", adminroutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});