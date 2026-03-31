import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
function EditdoctorComponent() {
const { _id } = useParams();
const navigate = useNavigate();
const docurl = `http://localhost:3000/auth/edit_record/${_id}`;
const docgetById = `http://localhost:3000/auth/get/doctors/${_id}`
// const[getDoctor,setDoctor]=useState({})
const [editData, setEditdata] = useState({
fullName: "",
specialization: "",
mobNum: "",
exp: "",
email: "",
address: "",
docImg: ""
});
const [preview, setPreview] = useState('');
useEffect(() => {
fetchApi();
}, []);
async function fetchApi() {
try {
const resById = await axios.get(docgetById)
setEditdata(resById.data.doctor)
// const res = await axios.put(`${docurl}/${_id}`);
// console.log(res.data.editDoctors)
// setEditdata(res.data.editDoctors); // adjust if backend returns {doctor: {...}}
// if (res.data.editDoctors.docImg) {
//   setPreview(`http://localhost:3000/${res.data.editDoctorsdocImg}`);
// }
} catch (error) {
console.error('Error fetching doctor:', error);
}
}
function inputHandler(e) {
const { name, value } = e.target;
setEditdata({ ...editData, [name]: value });
}
function handleFileChange(e) {
const file = e.target.files[0];
if (file) {
const previewUrl = URL.createObjectURL(file);
setEditdata({ ...editData, docImg: file });
setPreview(previewUrl);
}
}
async function submitHandler(e) {
e.preventDefault();
try {
//   const formData = new FormData();
//   for (const key in formData) {
//     formData.append(key, editData[key]);
//   }
//   await axios.put(`${docurl}/${_id}`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
await axios.put(docurl,editData).then((res)=>{
})
toast.success("Doctor updated successfully");
navigate("/");
} catch (err) {
console.error("Update failed:", err);
alert("Something went wrong!");
}
}
return (
<div className="container mt-5 w-50 m-auto">
   <div className="card shadow-lg border-0 rounded-4">
      <div className="card-body p-4">
         <h3 className="text-center text-primary mb-4">Edit Doctor Details</h3>
         <form onSubmit={submitHandler}>
            <div className="mb-3">
               <label className="form-label">Full Name</label>
               <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={editData.fullName}
                  onChange={inputHandler}
                  required
                  />
            </div>
            <div className="mb-3">
               <label className="form-label">Specialization</label>
               <select
                  className="form-select"
                  name="specialization"
                  value={editData.specialization}
                  onChange={inputHandler}
                  required
                  >
                  <option value="">Select Specialization</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Neurologist">Neurologist</option>
               </select>
            </div>
            <div className="mb-3">
               <label className="form-label">Experience (Years)</label>
               <input
                  type="number"
                  className="form-control"
                  name="exp"
                  value={editData.exp}
                  onChange={inputHandler}
                  required
                  />
            </div>
            <div className="mb-3">
               <label className="form-label">Contact Number</label>
               <input
                  type="tel"
                  className="form-control"
                  name="mobNum"
                  value={editData.mobNum}
                  onChange={inputHandler}
                  required
                  />
            </div>
            {/* 
            <div className="mb-3">
               <label className="form-label">Email ID</label>
               <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={editData.email}
                  onChange={inputHandler}
                  required
                  />
            </div>
            */}
            <div className="mb-3">
               <label className="form-label">Clinic Address</label>
               <textarea
                  className="form-control"
                  name="address"
                  rows="3"
                  value={editData.address}
                  onChange={inputHandler}
                  ></textarea>
            </div>
            <div className="mb-3">
               <label className="form-label">Upload Photo</label>
               <input
                  type="file"
                  className="form-control"
                  name="docImg"
                  onChange={handleFileChange}
                  accept="image/*"
                  />
               {preview && (
               <div className="mt-3 text-center">
                  <img
                  src={preview}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
               </div>
               )}
            </div>
            <div className="d-grid">
               <input
                  type="submit"
                  className="btn btn-primary btn-lg"
                  value="Update Record"
                  />
            </div>
         </form>
      </div>
   </div>
</div>
);
}
export default EditdoctorComponent;