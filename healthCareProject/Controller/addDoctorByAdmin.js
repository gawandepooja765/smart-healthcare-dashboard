import Doctor from "../models/doctorSchema.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const addDoctorByAdmin = async (req, res) => {
  try {
       
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email required" });
    }

    // 1️⃣ Check existing doctor
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // 2️⃣ Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    // 3️⃣ Save doctor
    await Doctor.create({
      name,
      email,
      resetToken: token,
      resetTokenExpiry: tokenExpiry
    });

    // 4️⃣ Password setup link
    const setupLink = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

    // 5️⃣ Mail config
    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

    // 6️⃣ Send mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Set Your Password",
      html: `
        <h3>Hello Dr. ${name}</h3>
        <p>Click below link to set your password:</p>
        <a href="${setupLink}">${setupLink}</a>
        <p>This link expires in 15 minutes</p>
      `
    });

    res.status(201).json({
      message: "Doctor added & email sent successfully"
    });

  } catch (error) {
    console.error("Add doctor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
