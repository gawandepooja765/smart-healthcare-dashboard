import doctorScheduleModel from "../models/doctorScheduleSchema.js"
import appointmentModel from "../models/appointmentSchema.js"
import  generateSlots  from "../utility/slotGenrator.js";
import userModel from "../models/userSchema.js";

export const getAutoSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    const schedule = await doctorScheduleModel.findOne({ doctorId });

    if (!schedule) {     

      return res.status(404).json({ message: "Schedule not set" });
    }

    const dayName = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" });
     
    // ❌ Doctor not working that day
    if (!schedule.workingDays.includes(dayName)) {
      return res.json([]);
    }

    // ✅ Generate slots
    const allSlots = generateSlots(
      schedule.startTime,
      schedule.endTime,
      schedule.slotDuration
    );
   

    // 🔍 Find booked appointments
    const booked = await appointmentModel.find({
      doctorId,
      appDate: date,
      status: { $in: ["pending", "confirmed"] }
    });

    const bookedTimes = booked.map(a => a.appTime);

    // ❌ Remove booked slots
    const freeSlots = allSlots.filter(
      time => !bookedTimes.includes(time)
    );

    res.json(freeSlots);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updatePatientProfile = async (req, res) => {
  try {
    const patientId = req.params.id;

    const { patientName, email, phNo, gender, dob } = req.body;

    const updatedPatient = await userModel.findByIdAndUpdate(
      patientId,
      {
        patientName,
        email,
        phNo,
        gender,
        dob,
        
      },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedPatient
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePatientProfile = async (req, res) => {
  try {
    const patientId = req.user.id

    const deletedPatient = await userModel.findByIdAndDelete(patientId);

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient profile deleted successfully"
    });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};