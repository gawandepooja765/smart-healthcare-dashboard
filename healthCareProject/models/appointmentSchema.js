import mongoose from "mongoose";


const appointmentSchema = new mongoose.Schema({

 patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorDetails",
    required: true
  },
  // patientName:{
  //   type:String,
  //   require :true
  // },
  // phNo:{
  //   type:Number,
  //   require:true
  // },
  // gender:{
  //   type:String,
  //   require:true
  // },
  // dob:{
  //   type:Date,
  //   require:true
  // },

  appDate: {
    type: Date,
    required: true
  },

  appTime: {
    type: String,
    required: true
  },

  message: {
    type: String
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed","cancelled"],
    default: "pending"
  }

}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;