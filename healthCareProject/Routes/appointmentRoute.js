import express from "express";
import {
  addAppointments,
   getAppointments
  // getAppointmentsById
} from "../Controller/appointment.js";
import authMiddleware from "../middleware/auth.js"

const router = express.Router();

router.post("/appointment",authMiddleware(), addAppointments);
router.get("/get/appointments", getAppointments);
// router.get("/get/appointmentsById/:_id", getAppointmentsById);

export default router;
