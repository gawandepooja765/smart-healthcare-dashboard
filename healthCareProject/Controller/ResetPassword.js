import userModel from "../models/userSchema.js";
import docModel from "../models/doctorSchema.js";
import { adminModel } from "../models/adminSchema.js";
import bcrypt from "bcryptjs";

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // 1. Validate
  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  try {
    // 2. Find user
    let user =
      (await userModel.findOne({ email })) ||
      (await docModel.findOne({ email })) ||
      (await adminModel.findOne({ email }));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Verify OTP
    if (
      user.resetOTP !== otp ||
      user.resetOTPExpire < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    // 4. Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 5. Clear OTP + unlock account
    user.resetOTP = null;
    user.resetOTPExpire = null;
    user.loginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error resetting password"
    });
  }
};