import mongoose from "mongoose";
import { type } from "os";

const docSchema = new mongoose.Schema({
  authDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
    unique: true,

  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true
  },
  gender:{
    type:String,
    required:true
  },
  mobNum: {
    type: String,
    required: true
  },
  exp: {
    type: Number,
    required: true,
    min: 0
  },
  address: String,
  docImg: String
}, { timestamps: true });

const docModel = mongoose.model("DoctorDetails",docSchema);

export default docModel;