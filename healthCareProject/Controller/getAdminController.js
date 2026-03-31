import userModel from "../models/userSchema.js"
import docModel from "../models/doctorSchema.js";
import { adminModel } from "../models/adminSchema.js";
import docDetails from "../models/doctorProfile.js"
import appointmentModel from "../models/appointmentSchema.js"
import docSchedule from "../models/doctorScheduleSchema.js"

//get only logged in user
// Controller/getLoggedInUser.js

export const getLoggedInUser = async (req, res) => {
  try {

    const { id, role } = req.user;
    let profile = null;   
    let user = null;

    if (role === "user") {
      user = await userModel.findById(id);
    }

    else if (role === "doctor") {
      user = await docModel.findById(id)
      
        profile = await docDetails.findOne({
        authDoctorId: id,
      });
 

  } 
    else if (role === "admin") {
      user = await adminModel.findById(id);
    }

    res.status(200).json({
      success: true,
        user,   // email, basic info
        profile   // may be null
      
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// get doctors data
export const getDoctorData = async (req, res) => {
  try {
    const doctors = await docDetails.find()
    .populate({
    path: "authDoctorId",
    select: "email" // 👈 from Doctor collection
  });;
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }
    res.status(200).json({ doctors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get doctor by id
export const getDoctorDataById = async (req, res) => {
  try {
    const doctor = await docDetails.findById(req.params._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update doctor
export const updateDoctors = async (req, res) => {
  try {
    const updatedDoctor = await docDetails.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true } // return updated document
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ updatedDoctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete doctor
export const deleteRecord = async (req, res) => {
  try {
    const doctorId = req.params._id;
    await docDetails.findByIdAndDelete(doctorId);
    await docModel.findByIdAndDelete(doctorId);
    await docSchedule.findByIdAndDelete(doctorId)
    
      res.json({ success: true, message: "Doctor deleted completely" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//get all patients
export const getAllPatients = async(req,res)=>{
try{
  const users = await userModel.find({});
  if(!users) {
    res.status(404).send({message:"Not found"})
  }
    res.status(200).json({users})
  
}catch(err){
  console.log(err.message)
}
}

export const adminSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({ doctors: [], patients: [], appointments: [] });
    }

    // regex for partial match
    const search = q.trim();
const searchRegex = new RegExp(search, "i");
const isNumber = !isNaN(search);
    

    // Doctors
    const doctors = await docDetails.find({
      $or: [
        { fullName: searchRegex },
        { specialization: searchRegex },
         ...(isNumber ? [{ exp: Number(search) }] : [])
        
      ]
    });

    // Patients
    const patients = await userModel.find({
      $or: [
        { patientName : searchRegex },
        { email: searchRegex },
        { gender: searchRegex }
      ]
    });

    // Appointments
    const appointments = await appointmentModel.find({
      $or: [
        ...(isNumber ? [{ appDate: Number(search) }] : []),
        { appTime: searchRegex },
        { status: searchRegex }
      ]
    })
      .populate("doctorId", "fullName email")
      .populate("patientId", "patientName email");

    res.json({ doctors, patients, appointments });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};