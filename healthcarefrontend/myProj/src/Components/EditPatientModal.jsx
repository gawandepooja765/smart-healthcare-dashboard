import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const EditPatientModal = ({ show, handleClose, patientData, refreshData }) => {
const [formData, setFormData] = useState({
patientName: "",
email: "",
phNo: "",
gender: "",
dob: "",
address: ""
});

const API_URL = "https://smart-healthcare-dashboard-b1wk.onrender.com"

// fill form when modal opens
useEffect(() => {
if (patientData) {
setFormData(patientData);
}
}, [patientData]);
const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value
});
};
const handleUpdate = async () => {
try {
await axios.put(
`${API_URL}/auth/patient/update/${patientData._id}`,
formData
);
toast.success("Profile updated");
refreshData(); // reload profile
handleClose();
} catch (err) {
console.error(err);
toast.danger("Update failed");
}
};
const formatDate = (date) =>
date ? new Date(date).toISOString().split("T")[0] : "";
if (!show) return null;
return (
<>
<div className="modal-backdrop fade show "></div>
<div className="modal show fade d-block" tabIndex="-1">
   <div className="modal-dialog">
      <div className="modal-content">
         <div className="modal-header">
            <h5 className="modal-title">Edit Profile</h5>
            <button className="btn-close" onClick={handleClose}></button>
         </div>
         <div className="modal-body">
            <input className="form-control mb-2" name="patientName" value={formData.patientName} onChange={handleChange} placeholder="Name" />
            <input className="form-control mb-2" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input className="form-control mb-2" name="phNo" value={formData.phNo} onChange={handleChange} placeholder="Phone" />
            <select className="form-control mb-2" name="gender" value={formData.gender} onChange={handleChange}>
               <option value="">Select Gender</option>
               <option>Male</option>
               <option>Female</option>
            </select>
            <input className="form-control mb-2" type="date" name="dob" value={formatDate(formData.dob)} onChange={handleChange} />
         </div>
         <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>Close</button>
            <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
         </div>
      </div>
   </div>
</div>
</>
);
};
export default EditPatientModal;