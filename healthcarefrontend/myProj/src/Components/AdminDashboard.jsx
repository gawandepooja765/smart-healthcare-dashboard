import React, { useState,useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserMd, FaUsers, FaCalendarAlt,FaSearch, FaSignOutAlt, FaCalendarDay } from "react-icons/fa";
import "../admindashboard.css";
import axios from "axios"
import { toast } from "react-toastify";
import AddDoctorByAdmin from "./AddDoctorByAdmin";
const AdminDashboard = () => { 
const API_URL = "https://smart-healthcare-dashboard-b1wk.onrender.com"
const doctorUrl = `${API_URL}/auth/get/doctors`;
const patientUrl = `${API_URL}/auth/get/patients`;
const appointmentUrl = `${API_URL}/auth/get/appointments`;
const deleteUrl = `${API_URL}/auth/delete_record`;
const navigate = useNavigate();
const [activePage, setActivePage] = useState("dashboard");
const[doctor,setDoctor]=useState([])
const[patient,setPatient]=useState([])
const[appointments,setAppointments]=useState([])
const [showModal,setShowModal] =useState(false)
const [query, setQuery] = useState("");
const [result, setResult] = useState({
doctors: [],
patients: [],
appointments: []
});
useEffect(()=>{
fetchDoctors();
fetchPatients();
fetchAppointments();
},[])
async function fetchDoctors(){
const res = await axios.get(doctorUrl);
setDoctor(res.data.doctors)
}
async function fetchPatients(){
const res = await axios.get(patientUrl);
setPatient(res.data.users)
}
async function fetchAppointments(){
const res = await axios.get(appointmentUrl);
setAppointments(res.data.appointments)
}
function handleEdit(id){
navigate(`/edit_doctor/${id}`)
}
function handleDelete(id){
confirm("Are you sure want to delete")
axios.delete(`${deleteUrl}/${id}`)
navigate("/admin_dashboard") 
}
const today = new Date().toISOString().split("T")[0];
const todayAppointments = appointments.filter(
(appt) => appt.appDate.split("T")[0] === today
)
function logout(){
localStorage.clear();
delete axios.defaults.headers.common["Authorization"];
navigate("/login");
}
const handleSearch = async (e) => {
const value = e.target.value;
setQuery(value);
if (!value) return;
const res = await axios.get(`http://localhost:3000/auth/admin/search?q=${value}`);
setResult(res.data);
console.log(res)
};
const isSearching = query.trim() !== "";
return (
<div className="container-fluid bg-light vh-100">
   {/* Top Navbar */}
   <nav className="navbar navbar-dark bg-info px-4">
      <span className="navbar-brand h4">👑 Admin Panel</span>
      <button className="btn btn-danger btn-sm" onClick={() =>
         {
         localStorage.clear();
         delete axios.defaults.headers.common["Authorization"];
         navigate("/login")}}>
         <FaSignOutAlt />
         Logout
      </button>
   </nav>
   <div className="row">
      {/* Sidebar */}
      <div className="col-md-2 sidebar p-3">
         <h5 className="text-center mb-4 fw-bold">
            👑 Admin Panel
         </h5>
         <button
         className={`menu-item ${
         activePage === "dashboard" ? "active" : ""
         }`}
         onClick={() => setActivePage("dashboard")}
         >
         📊 Dashboard
         </button>
         <button
         className={`menu-item ${
         activePage === "addDoctor" ? "active" : ""
         }`}
         onClick={() => setShowModal(true)}
         >
         👨‍⚕️ Add Doctor
         </button>
         <AddDoctorByAdmin
            show={showModal}
            handleClose={() =>
         setShowModal(false)}
         />
         <button
         className={`menu-item ${
         activePage === "doctors" ? "active" : ""
         }`}
         onClick={() => setActivePage("doctors")}
         >
         🩺 Doctors List
         </button>
         <button
         className={`menu-item ${
         activePage === "patients" ? "active" : ""
         }`}
         onClick={() => setActivePage("patients")}
         >
         🧑 Patients
         </button>
         <button
         className={`menu-item ${
         activePage === "appointments" ? "active" : ""
         }`}
         onClick={() => setActivePage("appointments")}
         >
         📅 Appointments
         </button>
         <hr />
         <button className="menu-item logout" onClick={()=>logout}>
         🚪 Logout
         </button>
      </div>
      {/* Main Content */}
      <div className="col-md-10 p-4">
         <div className="input-group mb-4 shadow-sm">
            <span className="input-group-text bg-primary text-white">
               <FaSearch />
            </span>
            <input
               type="text"
               className="form-control"
               placeholder="Search doctors, patients, appointments..."
               value={query}
               onChange={handleSearch}
               />
         </div>
         {/* ================= DASHBOARD ================= */}
         <h3>Dashboard Overview</h3>
         <div className="row my-4">
            <div className="col-md-3">
               <div className="card shadow text-center p-3">
                  <FaUserMd size={40} className="text-primary m-auto" />
                  <h5 className="mt-2">Doctors</h5>
                  <h2>{doctor.length}</h2>
               </div>
            </div>
            <div className="col-md-3">
               <div className="card shadow text-center p-3">
                  <FaUsers size={40} className="text-success m-auto" />
                  <h5 className="mt-2">Patients</h5>
                  <h2>{patient.length}</h2>
               </div>
            </div>
            <div className="col-md-3">
               <div className="card shadow text-center p-3">
                  <FaCalendarAlt size={40} className="text-danger m-auto" />
                  <h5 className="mt-2">Appointments</h5>
                  <h2>{appointments.length}</h2>
               </div>
            </div>
            <div className="col-md-3">
               <div className="card shadow text-center p-3">
                  <FaCalendarDay size={40} className="text-info m-auto" />
                  <h5 className="mt-2">Today's Appointments</h5>
                  <h2>{todayAppointments.length}</h2>
               </div>
            </div>
         </div>
         {activePage === "dashboard" && (
         <>
         <h4 className="mb-3 fw-bold">Today's Appointments</h4>
         <div className="card shadow border-0 rounded-4 mt-4">
            <div className="card-body">
               <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle text-center">
                     <thead className="bg-primary text-white">
                        <tr>
                           <th>#</th>
                           <th>Patient</th>
                           <th>Doctor</th>
                           <th>Date</th>
                           <th>Time</th>
                           <th>Status</th>
                        </tr>
                     </thead>
                     <tbody>
                        {todayAppointments.length > 0 ? (
                        todayAppointments.slice(0, 5).map((appt, index) => (
                        <tr key={appt._id}>
                           <td>{index + 1}</td>
                           <td className="fw-semibold">
                              {appt.patientName || "N/A"}
                           </td>
                           <td>
                              {appt.docName || "N/A"}
                           </td>
                           <td>
                              {new Date(appt.appDate).toLocaleDateString("en-IN")}
                           </td>
                           <td>{appt.appTime}</td>
                           <td>
                              <span className={`badge ${
                              appt.status === "confirmed"
                              ? "bg-success"
                              : appt.status === "pending"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                              }`}>
                              {appt.status}
                              </span>
                           </td>
                        </tr>
                        ))
                        ) : (
                        <tr>
                           <td colSpan="6" className="text-muted py-4">
                              No appointments today
                           </td>
                        </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
         </>)};
         {/* ================= DOCTORS LIST ================= */}
         {activePage === "doctors" && (
         <>
         <h3>All Doctors</h3>
         <table className="table table-hover shadow bg-white mt-3">
            <thead className="table-dark">
               <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th colSpan={2}>Action</th>
               </tr>
            </thead>
            <tbody>
               {
               doctor.map((e,index)=>{
               return(
               <tr key={e._id}>
                  <td>{index + 1}</td>
                  <td>Dr.{e.fullName}</td>
                  <td>{e.authDoctorId?.email}</td>
                  <td>{e.specialization}</td>
                  <td>{e.exp}</td>
                  <td><button className="btn btn-warning" onClick={() => handleEdit(e._id)}>Edit</button></td>
                  <td><button className="btn btn-danger" onClick={()=>handleDelete(e._id)}>Delete</button></td>
               </tr>
               )
               })
               }
            </tbody>
         </table>
         </>
         )}
         {/* ================= PATIENTS ================= */}
         {activePage === "patients" && (
         <>
         <h3>All Patients</h3>
         <table className="table table-striped shadow bg-white mt-3">
            <thead className="table-primary">
               <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                  <th>Phone</th>
               </tr>
            </thead>
            <tbody>
               {patient.map((e,index)=>{
               return(
               <tr key={e._id}>
                  <td>{index + 1}</td>
                  <td>{e.patientName}</td>
                  <td>{e.email}</td>
                  <td>{e.gender}</td>
                  <td>{e.dob}</td>
                  <td>{e.phNo}</td>
               </tr>
               )
               })}
            </tbody>
         </table>
         </>
         )}
         {/* ================= APPOINTMENTS ================= */}
         {activePage === "appointments" && (
         <>
         <h3>All Appointments</h3>
         <table className="table table-bordered shadow bg-white mt-3">
            <thead className="table-success">
               <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
               </tr>
            </thead>
            <tbody>
               {appointments.map((e,index)=>{
               return(
               <tr key={e._id}>
                  <td>{index + 1}</td>
                  <td>{e.patientId?.patientName|| "-"}</td>
                  <td>{e.doctorId?.fullName|| "-"}
                  </td>
                  <td>
                     {new Date(e.appDate).toLocaleDateString("en-GB")}
                  </td>
                  <td>{e.appTime}</td>
                  <td>{e.status}</td>
               </tr>
               )
               })}
            </tbody>
         </table>
         </>
         )}
      </div>
   </div>
</div>
);
};
export default AdminDashboard;