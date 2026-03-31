import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({

  name: String,

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    default: null
  },

  role: {
    type: String,
    default: "doctor"
  },
  isVerified: {
    type: Boolean,
    default: false   // becomes true after password set
  },
   isActive: {
    type: Boolean,
    default: true,
  },
  loginAttempts: { type: Number, default: 0 },
lockUntil: { type: Date },
resetOTP: String,
resetOTPExpire: Date,
  resetToken: String,
  resetTokenExpiry: Date

}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;