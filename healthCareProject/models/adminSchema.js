import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email:{
        type : String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    loginAttempts: { type: Number, default: 0 },
lockUntil: { type: Date },
resetOTP: String,
resetOTPExpire: Date,

})

export const adminModel = mongoose.model("admin",adminSchema);
