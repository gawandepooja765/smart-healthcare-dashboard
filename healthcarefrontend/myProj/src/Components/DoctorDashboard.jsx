import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import AppointmentTable from "./AppointmentTable";
import {
FaCalendarCheck,
FaUserInjured,
FaBell,
FaSearch,
FaSignOutAlt,
FaCalendarAlt,
FaDashcube,
FaUserEdit,
} from "react-icons/fa";
import axios, { all } from "axios";
import "../custom_table.css";
const DoctorDashboard = () => {

const navigate = useNavigate();
const token = localStorage.getItem("token");
const API_URL = "https://smart-healthcare-dashboard-b1wk.onrender.com"
const loggedUrl = `${API_URL}/auth/logged_user`;
const appointmentUrl = `${API_URL}/auth/doctor-appointments`;
const [loggedData, setLoggedData] = useState(null);
const [appointments, setAppointments] = useState([]);
const [upcomingAppointments, setUpcomingAppointments] = useState([]);
const [activeTab, setActiveTab] = useState("dashboard");
const [showProfileSettings, setShowProfileSettings] = useState(false);
const [query, setQuery] = useState("");
const [searchData, setSearchData] = useState([]);
const [totalAppointments, setTotalAppointments] = useState([]);
const [todayCount, setTodayCount] = useState(0);
const [upcomingCount, setUpcomingCount] = useState(0);
const [totalPatients, setTotalPatients] = useState([]);
useEffect(() => {
if (!token) return;
getLoggedUser();
getAppointments();
}, []); // no need for loggedData in deps
// 🔹 Get logged doctor profile
const getLoggedUser = async () => {
try {
const res = await axios.get(loggedUrl, {
headers: { Authorization: `Bearer ${token}` },
});
setLoggedData({
user: res.data.user,
profile: res.data.profile,
});

} catch (err) {
console.error(err);
}
};
// 🔹 Get appointments + compute today/upcoming + unique patients
const getAppointments = async () => {
try {
const res = await axios.get(appointmentUrl, {
headers: { Authorization: `Bearer ${token}` },
});
const allAppointments = res.data.appointments || [];
setTotalAppointments(allAppointments);
const today = new Date().toISOString().slice(0, 10);
const todayAppointments = allAppointments.filter(
(a) => a.appDate?.slice(0, 10) === today
);
const upcomingAppointments = allAppointments.filter(
(a) => a.appDate?.slice(0, 10) > today
);
setAppointments(todayAppointments);
setUpcomingAppointments(upcomingAppointments);
setTodayCount(todayAppointments.length);
setUpcomingCount(upcomingAppointments.length);
// Unique patients
const uniquePatients = Array.from(
new Map(
allAppointments
.map((a) => [a.patientId?._id, a.patientId])
.filter(([, v]) => v)
).values()
);
setTotalPatients(uniquePatients);
} catch (err) {
console.error(err);
}
};
// 🔹 Update appointment status
const handleStatusChange = async (id, newStatus) => {
try {
await axios.put(
`${API_URL}/auth/appointment-status/${id}`,
{ status: newStatus },
{ headers: { Authorization: `Bearer ${token}` } }
);
getAppointments();
} catch {
alert("Error updating status");
}
};
// 🔹 Deactivate doctor account
const handleDeactivate = async () => {
if (!window.confirm("Are you sure you want to deactivate your account?"))
return;
try {
await axios.put(
`${API_URL}/auth/doctor/deactivate`,
{},
{ headers: { Authorization: `Bearer ${token}` } }
);
alert("Account deactivated");
localStorage.clear();
navigate("/login");
} catch {
alert("Error deactivating account");
}
};
// 🔹 Search handler
const handleSearch = async (e) => {
const value = e.target.value;
setQuery(value);
if (!value) return setSearchData([]);
try {
const res = await axios.get(
`${API_URL}/auth/doctor/search?q=${value}`,
{ headers: { Authorization: `Bearer ${token}` } }
);
setSearchData(res.data);
} catch (err) {
console.error(err);
}
};
const dataToShow = query ? searchData : totalAppointments;
return (
<div className="container-fluid bg-light vh-100">
   {/* Navbar */}
   <nav className="navbar navbar-light bg-white shadow-sm px-4">
      <span className="navbar-brand mb-0 h4">👨‍⚕️ Doctor Dashboard</span>
      <div>
         <FaBell className="me-4 fs-4 text-secondary" />
         <Link to="/add_doctorDetails">
         <button className="btn btn-primary btn-sm me-4">Add Profile</button>
         </Link>
         <button
            className="btn btn-danger btn-sm"
            onClick={() =>
            {
            localStorage.clear();
            delete axios.defaults.headers.common["Authorization"];
            navigate("/login");
            }}
            >
            <FaSignOutAlt />
            Logout
         </button>
      </div>
   </nav>
   <div className="row mt-4 px-4">
      {/* Sidebar */}
      <div className="col-md-3">
         {/* Profile Card */}
         <div className="card shadow-sm">
            {loggedData?.profile && (
            <div className="card-body text-center">
               {loggedData.profile.docImg && (
               <img
                  src={`${API_URL}${loggedData.profile.docImg}`}
                  alt="doctor"
                  className="rounded-circle mb-3"
                  width="120"
                  height="120"
                  />
               )}
               <h5>Dr. {loggedData.profile.fullName}</h5>
               <p className="text-muted">
                  {loggedData.profile.specialization || "No profile added"}
               </p>
            </div>
            )}
         </div>
         {/* Sidebar Menu */}
         <div className="card mt-3 shadow-sm">
            <div className="list-group list-group-flush">
               <button
               className={`list-group-item list-group-item-action ${
               activeTab === "dashboard" ? "active" : ""
               }`}
               onClick={() => setActiveTab("dashboard")}
               >
               <FaDashcube />
               Dashboard
               </button>
               <button
               className={`list-group-item list-group-item-action ${
               activeTab === "appointments" ? "active" : ""
               }`}
               onClick={() => setActiveTab("appointments")}
               >
               <FaCalendarCheck />
               Appointments
               </button>
               <button
               className={`list-group-item list-group-item-action ${
               activeTab === "patients" ? "active" : ""
               }`}
               onClick={() => setActiveTab("patients")}
               >
               <FaUserInjured />
               Patients List
               </button>
               <button
                  className="list-group-item list-group-item-action"
                  onClick={() =>
                  setShowProfileSettings((prev) => !prev)}
                  >
                  <FaUserEdit />
                  Profile Settings
               </button>
               {showProfileSettings && (
               <div className="p-3 border-top">
                  <button
                     className="btn btn-secondary btn-sm w-100 mb-2"
                     onClick={() =>
                  navigate(`/edit_doctor/${loggedData?.profile?._id}`)
                  }
                  >
                  Edit Profile
                  </button>
                  <button
                     className="btn btn-warning btn-sm w-100"
                     onClick={handleDeactivate}
                     >
                  Deactivate Account
                  </button>
               </div>
               )}
            </div>
         </div>
      </div>
      {/* Main Content */}
      <div className="col-md-9">
         {/* Search */}
         <div className="input-group mb-4 shadow-sm">
            <span className="input-group-text bg-primary text-white">
               <FaSearch />
            </span>
            <input
               type="text"
               placeholder="Search patients, date, time..."
               value={query}
               onChange={handleSearch}
               className="form-control"
               />
         </div>
         {/* Dashboard Cards */}
         <div className="row text-center mb-4">
            <div className="col-md-3">
               <div className="card p-3 shadow d-flex flex-row align-items-center justify-content-between border-bottom-0 border-end-0 rounded-start rounded-top border-primary">
                  <div>
                     <h6>Total Patients</h6>
                     <h4>{totalPatients.length}</h4>
                  </div>
                  <FaUserInjured className="fs-1 text-primary" />
               </div>
            </div>
            <div className="col-md-3">
               <div className="card p-3 shadow d-flex flex-row align-items-center justify-content-between border-bottom-0 border-end-0 rounded-start rounded-top border-primary">
                  <div>
                     <h6>Total Appointments</h6>
                     <h4>{totalAppointments.length}</h4>
                  </div>
                  <FaCalendarAlt className="fs-1 text-dark" />
               </div>
            </div>
            <div className="col-md-3">
               <div className="card p-3 shadow d-flex flex-row align-items-center justify-content-between border-bottom-0 border-end-0 rounded-start rounded-top border-primary">
                  <div>
                     <h6>Today</h6>
                     <h4>{todayCount}</h4>
                  </div>
                  <FaCalendarCheck className="fs-1 text-success" />
               </div>
            </div>
            <div className="col-md-3">
               <div className="card p-3 shadow d-flex flex-row align-items-center justify-content-between border-bottom-0 border-end-0 rounded-start rounded-top border-primary">
                  <div>
                     <h6>Upcoming</h6>
                     <h4>{upcomingCount}</h4>
                  </div>
                  <FaBell className="fs-1 text-warning" />
               </div>
            </div>
         </div>
         {/* Appointment Tables */}
         <AppointmentTable
            title="Today's Appointments"
            data={appointments}
            handleStatusChange={handleStatusChange}
            />
         {activeTab === "dashboard" && (
         <AppointmentTable
            title="Upcoming Appointments"
            data={upcomingAppointments}
            handleStatusChange={handleStatusChange}
            />
         )}
         {activeTab === "appointments" && (
         <AppointmentTable
            title="Total Appointments"
            data={dataToShow}
            handleStatusChange={handleStatusChange}
            />
         )}
         {/* Patients Table */}
         {activeTab === "patients" && (
         <div>
            <h4 className="mb-3">Total Patients</h4>
            <table className="table table-striped table-hover shadow-sm custom-table">
               <thead className="table-primary">
                  <tr>
                     <th>#</th>
                     <th>Name</th>
                     <th>Email</th>
                     <th>Phone No</th>
                     <th>Dob</th>
                  </tr>
               </thead>
               <tbody>
                  {totalPatients.length > 0 ? (
                  totalPatients.map((p, i) => (
                  <tr key={p._id}>
                     <td>{i + 1}</td>
                     <td>{p.patientName}</td>
                     <td>{p.email}</td>
                     <td>{p.phNo}</td>
                     <td>{new Date(p.dob).toLocaleDateString("en-GB")}</td>
                  </tr>
                  ))
                  ) : (
                  <tr className="text-center">
                     <td colSpan={5} className="text-danger fs-6">
                        No patient has booked an appointment yet
                     </td>
                  </tr>
                  )}
               </tbody>
            </table>
         </div>
         )}
         {/* Profile Settings */}
         {activeTab === "profile" && (
         <div className="card shadow-sm p-4">
            <h4 className="mb-3">Profile Settings</h4>
            <button
               className="btn btn-primary me-3"
               onClick={() =>
            navigate(`/edit_doctor/${loggedData?.profile?._id}`)
            }
            >
            Edit Profile
            </button>
            <button className="btn btn-danger" onClick={handleDeactivate}>
            Deactivate Profile
            </button>
         </div>
         )}
      </div>
   </div>
</div>
);
};
export default DoctorDashboard;