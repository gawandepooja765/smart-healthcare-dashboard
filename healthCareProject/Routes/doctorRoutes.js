import express from "express";
import multer from "multer";
import path from "path";
import { setDoctorPassword } from "../Controller/setDoctorPassword.js"
import { addDoctorDetails,createSchedule, deactivateAccount, doctorSearch } from "../Controller/doctorData.js";
import authMiddleware from "../middleware/auth.js";
import {
  getDoctorAppointments,
acceptAppointment,
rejectAppointment,
completeAppointment,
updateAppointmentStatus
} from "../Controller/appointment.js";

const router = express.Router();

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /auth/add/details

router.post("/set-password", setDoctorPassword);

router.post("/add/details",authMiddleware(["doctor"]), upload.single("docImg"), addDoctorDetails);

// router.get("/doctor/dashboard",authMiddleware(["doctor"]),getDoctorDashboard);

router.get("/doctor-appointments",authMiddleware(["doctor"]),getDoctorAppointments);

router.put("/accept/:id",authMiddleware(["doctor"]),acceptAppointment);

router.put("/reject/:id",authMiddleware(["doctor"]),rejectAppointment);

router.put("/complete/:id",authMiddleware(["doctor"]),completeAppointment);

router.put("/appointment-status/:id",authMiddleware(),updateAppointmentStatus);

router.post("/doctor/schedule", authMiddleware(["doctor"]), createSchedule);

router.put("/doctor/update", authMiddleware(["doctor"]),deactivateAccount)

router.get("/doctor/search",authMiddleware(["doctor"]),doctorSearch)

export default router;
