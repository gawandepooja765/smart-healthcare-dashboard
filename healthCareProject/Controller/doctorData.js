import doctorSchema from "../models/doctorSchema.js"
import docModel from "../models/doctorProfile.js";
import doctorScheduleModel from "../models/doctorScheduleSchema.js";
import appointmentModel from "../models/appointmentSchema.js"

// ✅ ADD DOCTOR DETAILS
export const addDoctorDetails = async (req, res) => {
  try {
    const authDoctorId = req.user._id || req.user.id;

    const {
      fullName,
      specialization,
      gender,
      mobNum,
      exp,
      address
      
    } = req.body;

    if (!fullName || !specialization || !mobNum || !exp || !gender) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    const existDoctor = await docModel.findOne({ authDoctorId });

    if (existDoctor) {
      return res.status(400).json({
        message: "Doctor already exists",
      });
    }

    let imagePath = "";

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({
        message: "Image required",
      });
    }

    const newDoctor = new docModel({
      authDoctorId,
      fullName,
      specialization,
      mobNum,
      gender,
      exp,
      address,
      docImg: imagePath,
    });

    await newDoctor.save();

    res.status(201).json({
      message: "Doctor added successfully",
      doctor: newDoctor,
    });
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CREATE / UPDATE SCHEDULE (FIXED)
export const createSchedule = async (req, res) => {
  try {
    
    const doctorId = req.user._id || req.user.id;

if (!doctorId) {
  
  return res.status(401).json({ message: "Unauthorized" });
}

    const { workingDays, startTime, endTime, slotDuration } = req.body;

    if (!workingDays || !startTime || !endTime || !slotDuration) {
      return res.status(400).json({ message: "All fields required" });
    }

    const schedule = await doctorScheduleModel.findOneAndUpdate(
      { doctorId },
      { doctorId,workingDays, startTime, endTime, slotDuration },
      { new: true, upsert: true }
    );

    res.json(schedule);

  } catch (err) {
    console.error("SCHEDULE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deactivateAccount = async(req,res)=>{
  try {
    await doctorSchema.findByIdAndUpdate(req.user.id, {
      isActive: false,
    });

    res.json({ message: "Account deactivated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const doctorSearch = async (req, res) => {
  try {
    const doctorId = req.user.id;
    console.log("doctorid",doctorId)
    const { q } = req.query;

    if (!q) return res.json([]);

    const doctorDetails = await docModel.findOne({
      authDoctorId: doctorId
    });

    if (!doctorDetails) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    let appointments = await appointmentModel
      .find({ doctorId: doctorDetails._id })
      .populate("patientId", "patientName email");
   

    const search = q.toLowerCase();

    appointments = appointments.filter((a) => {
      const name = a.patientId?.patientName?.toLowerCase() || "";
      const email = a.patientId?.email?.toLowerCase() || "";
        const time = a.appTime?.toLowerCase() || "";

      const status = a.status?.toLowerCase() ;


      return (
        name.includes(search) ||
        email.includes(search) ||
          time.includes(search) ||
    status.includes(search)
  
      );
    });

    res.json(appointments);
      

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};