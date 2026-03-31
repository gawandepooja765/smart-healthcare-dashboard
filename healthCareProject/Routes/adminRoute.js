import express from "express";
import {register,login} from "../Controller/adminAuth.js";
import {addDoctorByAdmin}  from "../Controller/addDoctorByAdmin.js";
import authMiddleware from "../middleware/auth.js"
import { forgotPassword } from "../Controller/ForgotPassword.js";
import { resetPassword } from "../Controller/ResetPassword.js";
import {
  
  getDoctorData,
  getDoctorDataById,
  updateDoctors,
  deleteRecord,
  adminSearch,
  getLoggedInUser,
  getAllPatients
} from "../Controller/getAdminController.js";
import { getAppointments } from "../Controller/appointment.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);

// Admin data routes

router.get("/admin/search", adminSearch);
router.get("/logged_user",authMiddleware(),getLoggedInUser);
router.get("/get/appointments", getAppointments);
router.post("/admin/doctor", addDoctorByAdmin);
router.get("/get/doctors", getDoctorData);
router.get("/get/doctors/:_id", getDoctorDataById);
router.put("/edit_record/:_id", updateDoctors);
router.delete("/delete_record/:_id", deleteRecord);
router.get("/get/patients",getAllPatients)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
