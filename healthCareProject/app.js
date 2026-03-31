// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import {connectDB} from "./Config/db.js";

import adminRouter from "./Routes/adminRoute.js";
import doctorRouter from "./Routes/doctorRoutes.js";
import appointmentRoute from "./Routes/appointmentRoute.js";
import pateintRoute from "./Routes/pateintRoute.js";

const app = express();

// DB connection
connectDB();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use("/auth", adminRouter);
app.use("/auth",pateintRoute)
app.use("/auth", doctorRouter);
app.use("/auth", appointmentRoute);

// serve uploaded images
app.use("/uploads", express.static("uploads"));

//error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Something went wrong" });
// });

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on atlas ${PORT}`);
});
