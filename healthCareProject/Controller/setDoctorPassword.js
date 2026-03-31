import bcrypt from "bcrypt";
import Doctor from "../models/doctorSchema.js"

export const setDoctorPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password required" });
    }

    const doctor = await Doctor.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!doctor) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    doctor.password = hashedPassword;
    doctor.resetToken = undefined;
    doctor.resetTokenExpiry = undefined;

    await doctor.save();

    res.json({ message: "Password set successfully" });

  } catch (error) {
    console.error("Set password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

