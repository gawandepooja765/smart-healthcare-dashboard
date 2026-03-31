import appointmentModel from "../models/appointmentSchema.js";
import userModel from "../models/userSchema.js";
import docDetails from "../models/doctorProfile.js"
export const addAppointments = async (req, res) => {
try {
const patientId = req.user.id;
const { doctorId, phNo, gender, dob, appDate, appTime} = req.body;
const today = new Date();
today.setHours(0, 0, 0, 0);
const selectedDate = new Date(appDate);
selectedDate.setHours(0, 0, 0, 0);
if (selectedDate < today) {
return res.status(400).json({
message: "Past date not allowed"
});
}
const doctorDetails = await docDetails.findOne({
authDoctorId: doctorId
});
if (!doctorDetails) {
return res.status(404).json({
success: false,
message: "Doctor profile not found"
});
}
const updatedPateint = await userModel.findByIdAndUpdate(
patientId,
{phNo,gender,dob},
{new:true});
const appointment = await appointmentModel.create({
patientId,
doctorId:doctorDetails._id,
appDate:appDate,
appTime:appTime
})
res.status(201).json({
message: "Appointment booked & patient updated",
appointment,
patient: updatedPateint
})
} catch (err) {
console.log("ERROR:", err);
res.status(500).json({ message: err.message });
}
};
//see admin all appointments
export const getAppointments = async (req, res) => {
try {
const appointments = await appointmentModel.find({})
.populate("patientId", "patientName email phNo dob")
.populate("doctorId", "fullName email");;
if (appointments.length === 0) {
return res.status(404).json({ message: "No appointments booked" });
}
return res.status(200).json({ appointments });
} catch (err) {
console.log(err);
return res.status(500).json({ message: "Server error" });
}
};
// doctor see appointments related to them
// export const getAppointments = async (req, res) => {
//   try {
//     const patientId = req.user.id;
//     const appointments = await appointmentModel.find({ patientId })
//       .populate({
//         path: "doctorId",
//         select: "fullName specialization",
//       })
//       .sort({ appDate: 1 });
//     res.status(200).json({
//       success: true,
//       data: appointments
//     });
//   } catch (error) {
//     res.status(500).json({ success: false });
//   }
// };
export const getDoctorAppointments = async (req, res) => {
try {
const doctorId = req.user.id;
const details = await docDetails.findOne({authDoctorId:doctorId})
const appointments = await appointmentModel
.find({ doctorId: details._id })
.populate("patientId", "patientName email phNo dob");
if (appointments.length === 0) {
return res.status(404).json({
message: "No appointments found for this doctor"
});
}
res.status(200).json({appointments});
} catch (err) {
console.error("🔥 SERVER ERROR:", err);
res.status(500).json({
message: "Internal server error",
error: err.message
});
}
};
//doctor accept appointment
export const acceptAppointment = async (req,res)=>{
try{
const appointment = await appointmentModel.findByIdAndUpdate(
req.params.id,
{ status:"accepted" },
{ new:true }
);
res.json({
message:"Appointment accepted",
appointment
});
}
catch(err){
console.log(err);
res.status(500).json({message:"Server error"});
}
}
//doctor reject appointment
export const rejectAppointment = async (req,res)=>{
try{
const appointment = await appointmentModel.findByIdAndUpdate(
req.params.id,
{ status:"rejected" },
{ new:true }
);
res.json({
message:"Appointment rejected",
appointment
});
}
catch(err){
console.log(err);
res.status(500).json({message:"Server error"});
}
}
//doctor complete appointment
export const completeAppointment = async (req,res)=>{ 
try{ const appointment = await appointmentModel.findByIdAndUpdate( req.params.id, 
{ status:"completed" }, { new:true } ); res.json({ message:"Appointment completed", appointment }); } catch(err){ console.log(err); res.status(500).json({message:"Server error"}); } }
//update appointment status
export const updateAppointmentStatus = async (req, res) => {
try {
const { id } = req.params;
const { status } = req.body;
const appointment = await appointmentModel.findById(id);
if (!appointment) {
return res.status(404).json({ message: "Appointment not found" });
}
const today = new Date().toISOString().slice(0, 10);
const appDate = appointment.appDate?.toISOString().slice(0, 10);
// 🔥 RULE: Prevent completing future appointments
if (status === "completed" && appDate > today) {
return res.status(400).json({
message: "Cannot complete future appointment",
});
}
// 🔥 RULE: Only confirmed can be completed
if (status === "completed" && appointment.status !== "confirmed") {
return res.status(400).json({
message: "Only confirmed appointments can be completed",
});
}
appointment.status = status;
await appointment.save();
res.json(appointment);
} catch (err) {
res.status(500).json({ message: err.message });
}
};
//getpateint appointments related to them
export const getPatientAppointments = async (req, res) => {
try {
const patientId = req.user.id;
const appointments = await appointmentModel.find
({ patientId }).populate("doctorId", "fullName specialization");;
res.status(200).json(appointments);
} catch (err) {
res.status(500).json({ error: err.message });
}
};
//pateint cancel appointment
export const cancelAppointment = async (req, res) => {
try {
if (!req.user) {
return res.status(401).json({ message: "Unauthorized" });
}
const appointmentId = req.params.appointmentId;
const patientId = req.user.id;
const appointment = await appointmentModel.findOne({
_id: appointmentId,
patientId
});
if (!appointment) {
return res.status(404).json({
message: "Appointment not found"
});
}
if (appointment.status === "cancelled") {
return res.status(400).json({
message: "Already cancelled"
});
}
if (new Date(appointment.appDate) < new Date()) {
return res.status(400).json({
message: "Cannot cancel past appointment"
});
}
appointment.status = "cancelled";
await appointment.save();
res.status(200).json({
message: "Appointment cancelled successfully"
});
} catch (err) {
console.log(err);   // 🔥 ADD THIS FOR DEBUG
res.status(500).json({ error: err.message });
}
};
export const rescheduleAppointment = async (req, res) => {
try {
const appointmentId = req.params.appointmentId;
const patientId = req.user.id;
const { appDate, appTime } = req.body;
if (!appDate || !appTime) {
return res.status(400).json({
message: "Date and Time required"
});
}
const appointment = await appointmentModel.findOne({
_id: appointmentId,
patientId: patientId
});
if (!appointment) {
return res.status(404).json({
message: "Appointment not found"
});
}
// ❌ Prevent rescheduling past appointment
if (new Date(appointment.appDate) < new Date()) {
return res.status(400).json({
message: "Cannot reschedule past appointment"
});
}
// ✅ Update date & time
appointment.appDate = appDate;
appointment.appTime = appTime;
// Optional: reset status to pending
appointment.status = "pending";
await appointment.save();
res.status(200).json({
message: "Appointment rescheduled successfully"
});
} catch (err) {
res.status(500).json({ error: err.message });
}
};
//patient upcoming appointment
export const getUpcomingAppointments = async (req, res) => {
try {
const patientId = req.user.id;
const today = new Date();
today.setHours(0, 0, 0, 0); // start of today
const appointments = await appointmentModel.find({
patientId,
appDate: { $gte: today },      // today & future
status: { $ne: "cancelled" }   // exclude cancelled
});
// If you store authDoctorId → fetch doctor manually
const result = await Promise.all(
appointments.map(async (appt) => {
const doctor = await docDetails.findOne({
authDoctorId: appt.doctorId
});
return {
...appt.toObject(),
doctorName: doctor?.fullName,
specialization: doctor?.specialization
};
})
);
res.status(200).json(result);
} catch (err) {
res.status(500).json({ error: err.message });
}
};