import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    patientName : {
        type:String,
        required:true,
    },
    email :{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        
        enum:["admin","user","doctor"],
        default:"user"
        
    },
   
  phNo: {
    type: Number,
    match: [/^[789]\d{9}$/, "Mobile number must be 10 digits and start with 7, 8, or 9"]
  },
  dob: {
    type: Date,
    require:true
  },
 
gender: {
    type: String,
    require:true
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  address:{
    type:String,
    require:true
  },
  loginAttempts: { type: Number, default: 0 },
lockUntil: { type: Date },
resetOTP: String,
resetOTPExpire: Date,

}, { timestamps: true });

const userModel = mongoose.model("User",userSchema);

export default userModel;