import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/userSchema.js";
import docModel from "../models/doctorSchema.js";
import { adminModel } from "../models/adminSchema.js";

export const register = async (req, res) => {
  const { patientName, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      patientName,
      email,
      password: hashedPassword,
      
    });

    await newUser.save();

    res.status(201).json({ user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    let user = await userModel.findOne({ email });
    let role = "user";

    if (!user) {
      user = await docModel.findOne({ email });
      role = "doctor";
    }

    if (!user) {
      user = await adminModel.findOne({ email });
      role = "admin";
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check lock
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        message: "Account locked. Please use forgot password."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= 3) {
        user.lockUntil = Date.now() + 15 * 60 * 1000;
      }

      await user.save();

      return res.status(401).json({
        message:
          user.loginAttempts >= 3
            ? "Too many attempts. Please use forgot password."
            : `Invalid password. Attempts left: ${3 - user.loginAttempts}`
      });
    }

    // Reset on success
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign(
      { email: user.email, id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user._doc;

    res.status(200).json({ user: userData, token });

  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//control doctor login
export const loginDoctor = async (req, res) => {
  try {
    const { email } = req.body;

    const doctorData = await docModel.findOne({ email });

    if (!doctorData) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctorData.isActive) {
      return res.status(403).json({
        message: "Account is deactivated. Contact admin.",
      });
    }

    // continue login...
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
