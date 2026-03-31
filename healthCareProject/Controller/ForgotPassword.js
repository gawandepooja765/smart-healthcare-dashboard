import crypto from "crypto";
import { sendEmail } from "../utility/forgotPasswordMail.js";
import userModel from "../models/userSchema.js";
import docModel from "../models/doctorSchema.js";
import { adminModel } from "../models/adminSchema.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // 1. Validate
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // 2. Find user (user / doctor / admin)
    let user =
      (await userModel.findOne({ email })) ||
      (await docModel.findOne({ email })) ||
      (await adminModel.findOne({ email }));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Generate OTP (6 digit)
    const otp = crypto.randomInt(100000, 999999).toString();

    // 4. Save OTP + expiry
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    // 5. Send Email
    await sendEmail(email, otp);

    // 6. Response
    res.status(200).json({
      message: "OTP sent to your email"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error sending OTP"
    });
  }
};

