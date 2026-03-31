import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function AddDoctorComp() {
const navigate = useNavigate();
const DETAILS_URL = "http://localhost:3000/auth/add/details";
const USER_URL = "http://localhost:3000/auth/logged_user";
const SLOT_URL = "http://localhost:3000/auth/doctor/schedule";
const [loggedData, setLoggedData] = useState(null);
const [slots, setSlots] = useState([]);
const [workingDays, setWorkingDays] = useState([]);
const [startTime, setStartTime] = useState("");
const [endTime, setEndTime] = useState("");
const [duration, setDuration] = useState(30);
const [docData, setDocData] = useState({
specialization: "",
mobNum: "",
gender:"",
exp: "",
address: ""
});
const [image, setImage] = useState(null);
const [preview, setPreview] = useState(null);
// ✅ Fetch logged doctor
useEffect(() => {
async function fetchDoctor() {
try {
const token = localStorage.getItem("token");
if (!token) throw new Error("Token not found");
const res = await axios.get(USER_URL, {
headers: { Authorization: `Bearer ${token}` }
});
setLoggedData(res.data.user);
} catch (err) {
console.error(err);
alert("Failed to fetch doctor data");
}
}
fetchDoctor();
}, []);
// ✅ Doctor details input
const inputHandler = (e) => {
const { name, value } = e.target;
setDocData(prev => ({ ...prev, [name]: value }));
};
// ✅ Image preview
const handleFileChange = (e) => {
const file = e.target.files[0];
setImage(file);
if (file) setPreview(URL.createObjectURL(file));
};
// ✅ Submit doctor profile
const submitHandler = async (e) => {
e.preventDefault();
if (!loggedData?._id) return alert("Doctor data not loaded yet.");
try {
const token = localStorage.getItem("token");
const formData = new FormData();
formData.append("fullName", loggedData.name);
Object.keys(docData).forEach(key =>
formData.append(key, docData[key] || "")
);
if (image) formData.append("docImg", image);
await axios.post(DETAILS_URL, formData, {
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "multipart/form-data"
}
});
toast.success("Doctor details added successfully!");
navigate("/doctor-dashboard");
} catch (err) {
console.error(err);
toast.warning(err.response?.data?.message || "Upload failed");
}
};
// ✅ Working days checkbox
const handleDayChange = (e) => {
const { value, checked } = e.target;
setWorkingDays(prev =>
checked ? [...prev, value] : prev.filter(day => day !== value)
);
};
// ✅ Add schedule / slot
const handleAddSlot = async () => {
if (!loggedData?._id) return alert("Doctor data not loaded yet.");
if (!startTime || !endTime || workingDays.length === 0) return alert("Fill all required fields");
if (startTime >= endTime) return alert("End time must be after start time");
try {
const token = localStorage.getItem("token");
const res = await axios.post(
SLOT_URL,
{
// doctorId: loggedData._id, // always send correct doctorId
workingDays,
startTime,
endTime,
slotDuration: Number(duration)
},
{ headers: { Authorization: `Bearer ${token}` } }
);
setSlots(prev => [...prev, res.data]);
toast.success("Schedule added successfully");
setStartTime("");
setEndTime("");
} catch (err) {
console.error(err);
toast.warning(err.response?.data?.message || "Failed to add schedule");
}
};
if (!loggedData) return 
<p className="text-center mt-5">Loading...</p>
;
return (
<div className="container mt-5 w-50 m-auto">
   <div className="card shadow-lg border-0 rounded-4">
      <div className="card-body p-4">
         <h3 className="text-center text-primary mb-4">Add Doctor Details</h3>
         <form onSubmit={submitHandler}>
            <div className="mb-3">
               <label>Full Name</label>
               <input className="form-control" value={loggedData.name} readOnly />
            </div>
            <div className="mb-3">
               <label>Specialization</label>
               <select className="form-select" name="specialization" onChange={inputHandler} required>
                  <option value="">Select</option>
                  <option>General Physician</option>
                  <option>Cardiologist</option>
                  <option>Dermatologist</option>
                  <option>Neurologist</option>
               </select>
            </div>
            <div className="mb-3">
               <label>Experience (Years)</label>
               <input type="number" className="form-control" name="exp" onChange={inputHandler} required />
            </div>
            <div className="mb-3">
               <label> Gender </label>
               <select className="form-control" name="gender" onChange={inputHandler} required>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
               </select>
            </div>
            <div className="mb-3">
               <label>Contact Number</label>
               <input type="tel" className="form-control" name="mobNum" onChange={inputHandler} required />
            </div>
            <div className="mb-3">
               <label>Working Days</label>
               {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => (
               <div key={day}>
                  <input type="checkbox" value={day} onChange={handleDayChange} /> {day}
               </div>
               ))}
            </div>
            <div className="mb-3">
               <label>Start Time</label>
               <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
               <label className="ms-2">End Time</label>
               <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
               <label className="ms-2">Slot Duration</label>
               <select value={duration} onChange={e =>
                  setDuration(e.target.value)}>
                  <option value={15}>15 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={60}>60 mins</option>
               </select>
               <button type="button" className="btn btn-success ms-2" onClick={handleAddSlot}>
               Add Schedule
               </button>
               <ul className="mt-3">
                  {slots.map((slot, i) => (
                  <li key={i}>{slot.startTime} - {slot.endTime} ({slot.slotDuration} mins)</li>
                  ))}
               </ul>
            </div>
            <div className="mb-3">
               <label>Clinic Address</label>
               <textarea className="form-control" name="address" onChange={inputHandler} rows="3" />
            </div>
            <div className="mb-3">
               <label>Upload Photo</label>
               <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
               {preview && <img src={preview} alt="preview" className="img-thumbnail mt-3" style={{ width: 150, height: 150, objectFit: "cover" }} />}
            </div>
            <div className="d-grid">
               <button className="btn btn-primary btn-lg">Add Record</button>
            </div>
         </form>
      </div>
   </div>
</div>
);
}
export default AddDoctorComp;