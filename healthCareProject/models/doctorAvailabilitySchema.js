import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  slots: [
    {
      time: String,        // "10:00 AM"
      isBooked: {
        type: Boolean,
        default: false
      }
    }
  ]

}, { timestamps: true });

export default mongoose.model("Doctor_Availability", availabilitySchema);