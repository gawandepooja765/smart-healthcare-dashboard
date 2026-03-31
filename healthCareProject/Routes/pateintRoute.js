import express from "express";
import { completeProfile } from "../Controller/completeProfile.js";
import { getLoggedInUser } from "../Controller/getAdminController.js";
import { deletePatientProfile, getAutoSlots,updatePatientProfile } from "../Controller/patientController.js";
import { getPatientAppointments,
    cancelAppointment,
    rescheduleAppointment,
    getUpcomingAppointments } from "../Controller/appointment.js";
import authMiddleware from "../middleware/auth.js"

const router = express.Router();

// pateint routes

router.put("/complete-profile", authMiddleware(["user"]), completeProfile);
router.get("/logged-user",authMiddleware,getLoggedInUser);
router.get("/auto-slots", getAutoSlots);
router.get("/pateint-appointments",authMiddleware(["user"]),getPatientAppointments)
router.put("/cancel-appointment/:appointmentId",authMiddleware(["user"]),cancelAppointment);
router.put("/reschedule-appointment/:appointmentId", authMiddleware(["user"]), rescheduleAppointment);
router.get("/patient/upcoming",authMiddleware(["user"]), getUpcomingAppointments);
router.put("/patient/update/:id",updatePatientProfile)
router.delete("/patient/delete/:id",authMiddleware(["user"]),deletePatientProfile)
export default router;
