import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaSearch, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PatientUpcomingApp from "./MyAppointments";
import EditPatientModal from "./EditPatientModal";
const PatientDashboard = () => {
const [doctors, setDoctors] = useState([]);
const [search, setSearch] = useState("");
const [showProfileMenu, setShowProfileMenu] = useState(false);
const [showModal, setShowModal] = useState(false)
const [loggedData, setLoggedData] = useState(null);
const [activeTab, setActiveTab] = useState("upcoming");
const [activePage, setActivePage] = useState("dashboard");
const [appointments, setAppointments] = useState([]);
const navigate = useNavigate();
const doctorUrl = "http://localhost:3000/auth/get/doctors";
const loggedUrl = "http://localhost:3000/auth/logged_user";
const appointmentUrl = "http://localhost:3000/auth/pateint-appointments";
const token = localStorage.getItem("token");
useEffect(() => {
fetchDoctorData();
getLoggedUser();
getAppointments();
}, []);
// 🔹 Get logged pateint profile
async function getLoggedUser() {
// const token = localStorage.getItem("token");
const res = await axios.get(loggedUrl, {
headers: {
Authorization: `Bearer ${token}`,
},
});
setLoggedData(res.data.user);
}
async function fetchDoctorData() {
try {   
const res = await axios.get(doctorUrl) 
setDoctors(res.data.doctors);

} catch (err) {
console.log(err);
}
}
const filteredDoctors = doctors.filter((doc) =>
(doc.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
(doc.specialization || "").toLowerCase().includes(search.toLowerCase())
);
async function getAppointments() {
try {
const res = await axios.get(appointmentUrl, {
headers: {
Authorization: `Bearer ${token}`,
},
});
setAppointments(res.data);
} catch (err) {
console.log(err);
}
}
async function cancelAppointment(id) {
const confirmCancel = window.confirm(
"Are you sure you want to cancel this appointment?"
);
if (!confirmCancel) return; 
try {
await axios.put(
`http://localhost:3000/auth/cancel-appointment/${id}`,
{},
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);
alert("Appointment cancelled successfully");
getAppointments(); // 🔄 refresh list
} catch (err) {
alert("Error cancelling appointment");
}
}
async function rescheduleAppointment(id) {
const newDate = prompt("Enter new date (YYYY-MM-DD)");
const newTime = prompt("Enter new time (HH:MM)");
if (!newDate || !newTime) return;
try {
// const token = localStorage.getItem("token");
await axios.put(
`http://localhost:3000/auth/reschedule-appointment/${id}`,
{
appDate: newDate,
appTime: newTime
},
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);
alert("Appointment rescheduled successfully");
getAppointments();
} catch (err) {
alert("Error rescheduling appointment");
}
}
const today = new Date();
today.setHours(0, 0, 0, 0);
const filteredAppointments = appointments.filter((a) => {
const d = new Date(a && a.appDate);
if (activeTab === "upcoming")
return d >= today && a.status !== "cancelled";
if (activeTab === "past")
return d < today;
return true; // all
});
const handleDelete = async (id) => {
const confirmDelete = window.confirm("Are you sure to delete profile?");
if (!confirmDelete) return;
try {
await axios.delete(
`http://localhost:3000/auth/patient/delete/${id}`,
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);
alert("Profile deleted");
localStorage.removeItem("token");
navigate("/login");
} catch (err) {
console.error(err);
alert("Delete failed");
}
};
return (
<div className="container-fluid bg-light vh-100 ">
   {/* Navbar */}
   <nav className="navbar navbar-light bg-white shadow-sm px-4">
      <span className="navbar-brand h4">🧑 Patient Dashboard</span>
      <button
         className="btn btn-danger btn-sm"
         onClick={() =>
         {
         localStorage.clear();
         navigate("/login");
         }}
         >
         <FaSignOutAlt />
         Logout
      </button>
   </nav>
   <div className="row mt-3">
      {/* Sidebar */}
      <div className="col-md-3">
         <div className="card shadow-sm p-3 text-center">
            <FaUser size={50} className="m-auto text-primary text-center" />
            {loggedData && (
            <h5 className="text-secondary py-2">{loggedData?.patientName}</h5>
            )}
         </div>
         <div className="card mt-3 shadow-sm">
            <div className="list-group list-group-flush">
               {/* <button className="list-group-item list-group-item-action active">
               Dashboard
               </button> */}
               <button
               className={`list-group-item list-group-item-action ${
               activePage === "dashboard" ? "active" : ""
               }`}
               onClick={() => setActivePage("dashboard")}
               >
               Dashboard
               </button>
               {/* <button className="list-group-item list-group-item-action">
               My Appointments
               </button> */}
               <button
               className={`list-group-item list-group-item-action ${
               activePage === "appointments" ? "active" : ""
               }`}
               onClick={() => {
               setActivePage("appointments");    
               getAppointments();
               }}
               >
               My Appointments
               </button>
               {/* Profile Settings */}
               <button
                  className="list-group-item list-group-item-action"
                  onClick={() => setShowProfileMenu(prev => !prev)}
               >
               Profile Settings
               </button>
               {showProfileMenu && (
               <>
               <button
                  className="list-group-item list-group-item-action ps-4"
                  onClick={() => navigate("/complete-profile")}
               >
               Complete Profile
               </button>
               <button
                  className="list-group-item list-group-item-action ps-4"
                  onClick={() => setShowModal(true)}
               >
               Edit Profile
               </button>
               <EditPatientModal
                  show={showModal}
                  handleClose={() =>
               setShowModal(false)}
               patientData={loggedData}
               refreshData={getLoggedUser}
               />
               <button
                  className="list-group-item list-group-item-action ps-4 text-danger"
                  onClick={() => handleDelete(loggedData._id)}
               >
               Delete Profile
               </button>
               </>
               )}
            </div>
         </div>
      </div>
      {/* Main Content */}
      <div className="col-md-9 px-4">
         {activePage === "dashboard" && (
         <>
         {/* Search */}
         <div className="input-group mb-4 shadow-sm">
            <span className="input-group-text bg-primary text-white">
               <FaSearch />
            </span>
            <input
               type="text"
               className="form-control"
               placeholder="Search doctor..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         {/* Doctors */}
         <h4 className="mb-3">Available Doctors</h4>
         <div className="row">
            {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
            <div className="col-md-4 mb-4" key={doc._id}>
               <div className="card shadow-sm h-100 text-center p-3">
                  <img
                     src={`http://localhost:3000${doc.docImg}`}
                     alt="doctor"
                     className="rounded-circle mx-auto mb-3"
                     width="100"
                     height="100"
                     />
                  <h5>{doc.fullName}</h5>
                  <p className="text-muted">
                     {doc.specialization}
                  </p>
                  <p>
                     Experience: {doc.exp || "N/A"} years
                  </p>
                  <button
                     className="btn btn-primary mt-2"
                     onClick={() =>
                  navigate(`/appointment/${doc.authDoctorId?._id}`)
                  }
                  >
                  Book Appointment
                  </button>
               </div>
            </div>
            ))
            ) : (
            <p className="text-muted text-center">
               No doctors found
            </p>
            )}
         </div>
         </>
         )}
         {/* ================= MY APPOINTMENTS VIEW ================= */}
         {activePage === "appointments" && (
         <>
         <h4 className="mb-3">📅 My Appointments</h4>
         {/* ⭐ Tabs */}
         <div className="mb-3">
            {["upcoming", "past", "all"].map((tab) => (
            <button
            key={tab}
            className={`btn me-2 ${
            activeTab === tab ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setActiveTab(tab)}
            >
            {tab.toUpperCase()}
            </button>
            ))}
         </div>
         <table className="table table-hover shadow bg-white">
            <thead className="table-primary">
               <tr>
                  <th>#</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
               </tr>
            </thead>
            <tbody>
               {filteredAppointments.length > 0 ? (
               filteredAppointments.map((a, index) => (
               <tr key={a._id}>
                  <td>{index + 1}</td>
                  <td>Dr. {a.doctorId?.fullName || "N/A"}</td>
                  <td>{a.doctorId?.specialization || "—"}</td>
                  <td>
                     {new Date(a.appDate).toLocaleDateString()}
                  </td>
                  <td>{a.appTime}</td>
                  {/* ⭐ Status Badge */}
                  <td>
                     <span
                     className={`badge ${
                     a.status === "pending"
                     ? "bg-warning"
                     : a.status === "confirmed"
                     ? "bg-success"
                     : a.status === "rejected"
                     ? "bg-danger"
                     : a.status === "cancelled"
                     ? "bg-secondary"
                     : ""
                     }`}
                     >
                     {a.status}
                     </span>
                  </td>
                  {/* ⭐ Action Buttons */}
                  <td>
                     {(() => {
                     const today = new Date();
                     today.setHours(0, 0, 0, 0);
                     const appDate = new Date(a.appDate);
                     appDate.setHours(0, 0, 0, 0);
                     const isPast = appDate < today;
                     // ❌ If past → no actions
                     if (isPast) {
                     return <span className="text-muted">Expired</span>;
                     }
                     // ❌ Already cancelled
                     if (a.status === "cancelled") {
                     return (
                     <button className="btn btn-secondary btn-sm" disabled>
                     Cancelled
                     </button>
                     );
                     }
                     // ✅ Allow actions
                     if (a.status === "pending" || a.status === "confirmed") {
                     return (
                     <>
                     <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => rescheduleAppointment(a._id)}
                     >
                     Reschedule
                     </button>
                     <button
                        className="btn btn-danger btn-sm"
                        onClick={() => cancelAppointment(a._id)}
                     >
                     Cancel
                     </button>
                     </>
                     );
                     }
                     return <span className="text-muted">—</span>;
                     })()}
                  </td>
               </tr>
               ))
               ) : (
               <tr>
                  <td colSpan="7" className="text-center">
                     No appointments found
                  </td>
               </tr>
               )}
            </tbody>
         </table>
         </>
         )}
      </div>
   </div>
</div>
);
};
export default PatientDashboard;