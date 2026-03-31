import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
function Appointment() {
const { _id } = useParams();
const navigate = useNavigate();
const appointmentUrl = "http://localhost:3000/auth/appointment";
const loggedUserUrl = "http://localhost:3000/auth/logged_user";
const [slots, setSlots] = useState([]);
const [selectedTime, setSelectedTime] = useState("");
const [showSlots, setShowSlots] = useState(false);
const [appointment, setAppointment] = useState({
patientName: "",
phNo: "",
gender: "",
dob: "",
appDate: "",
appTime: "",
msg: ""
});
useEffect(() => {
getLoggedUser();
}, []);
// ✅ FETCH LOGGED USER + PREFILL
async function getLoggedUser() {
try {
const res = await axios.get(loggedUserUrl, {
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`
}
});
const user = res.data.user;
// ✅ PREFILL HERE (ONLY HERE)
setAppointment({
patientName: user.patientName || "",
phNo: user.phNo || "",
gender: user.gender || "",
dob: user.dob ? user.dob.slice(0, 10) : "",
appDate: "",
appTime: "",
msg: ""
});
} catch (err) {
console.log(err.response?.data || err.message);
}
}
// ✅ INPUT HANDLER (simple)
function inputHandler(e) {
const { name, value } = e.target;
setAppointment(prev => ({
...prev,
[name]: value
}));
}
// ✅ FETCH SLOTS
async function fetchSlots(id, date) {
try {
const res = await axios.get(
`http://localhost:3000/auth/auto-slots?doctorId=${id}&date=${date}`
);
const slotData = res.data.slots || res.data;
setSlots(slotData);
setSelectedTime("");
} catch (err) {
console.log(err);
setSlots([]);
}
}
// ✅ SELECT SLOT
function handleSlotSelect(slot) {
setSelectedTime(slot);
setAppointment(prev => ({
...prev,
appTime: slot.startTime
}));
}
// ✅ SUBMIT
async function submitHandler(e) {
e.preventDefault();
if (!selectedTime) {
alert("Please select a time slot");
return;
}
try {
await axios.post(
appointmentUrl,
{
doctorId: _id,
...appointment
},
{
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`
}
}
);
toast.success("Appointment booked successfully");
navigate("/patient_dashboard");
} catch (err) {
console.log(err.response?.data || err.message);
toast.danger("Appointment failed");
}
}
return (
<div className="container mt-5">
   <div className="card shadow p-4">
      <h3 className="text-center mb-4">Patient Appointment Form</h3>
      <form onSubmit={submitHandler}>
         {/* NAME */}
         <label className="form-label text-primary"> Pateint Name: </label>
         <input
            type="text"
            className="form-control mb-3"
            name="patientName"
            value={appointment.patientName}
            onChange={inputHandler}
            required
            />
         {/* PHONE */}
         <label className="form-label text-primary"> Contact Number: </label>
         <input
            type="tel"
            className="form-control mb-3"
            name="phNo"
            value={appointment.phNo}
            onChange={inputHandler}
            required
            />
         {/* DOB */}
         <label className="form-label text-primary"> Date of Birth: </label>
         <input
            type="date"
            className="form-control mb-3"
            name="dob"
            value={appointment.dob}
            onChange={inputHandler}
            />
         {/* GENDER */}
         <label className="form-label text-primary"> Gender: </label>
         <select
            className="form-control mb-3"
            name="gender"
            value={appointment.gender}
            onChange={inputHandler}
            required
            >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
         </select>
         {/* APPOINTMENT DATE */}
         <label className="form-label text-primary"> Appointment Date: </label>
         <input
            type="date"
            className="form-control mb-3"
            name="appDate"
            value={appointment.appDate}
            onChange={(e) => {
         inputHandler(e);
         fetchSlots(_id, e.target.value);
         setShowSlots(true);
         }}
         required
         />
         {/* SLOTS */}
         <div className={showSlots ? "d-block mb-3" : "d-none"}>
         <label className="fw-bold"> Available Time Slots: </label>
         {slots.length === 0 ? (
         <p className="text-danger mt-2">
            No slots available for selected date
         </p>
         ) : (
         <div className="mt-2">
            {slots.map((slot, i) => (
            <button
            key={i}
            type="button"
            className={
            selectedTime?.startTime === slot.startTime
            ? "btn btn-success m-1"
            : "btn btn-outline-success m-1"
            }
            onClick={() => handleSlotSelect(slot)}
            >
            {slot.startTime} - {slot.endTime}
            </button>
            ))}
         </div>
         )}
   </div>
   {/* MESSAGE */}
   <textarea
      className="form-control mb-3"
      rows="3"
      name="msg"
      placeholder="Any message"
      value={appointment.msg}
      onChange={inputHandler}
      ></textarea>
   <button className="btn btn-primary w-100" type="submit">
   Book Appointment
   </button>
   </form>
</div>
</div>
);
}
export default Appointment;