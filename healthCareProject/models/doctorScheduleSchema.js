import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({

  doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",   // login model name
      required: true,
      unique: true     // one profile per doctor
    },

  workingDays: {
  type: [String],
  enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
  required: true
},

  startTime: {
    type: String,     // "10:00"
    required: true
  },

  endTime: {
    type: String,     // "14:00"
    required: true
  },

  slotDuration: {
    type: Number,     // minutes (e.g., 30)
    required: true
  }

}, { timestamps: true });

export default mongoose.model("DoctorSchedule", scheduleSchema);