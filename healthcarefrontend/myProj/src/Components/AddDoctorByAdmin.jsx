import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
function AddDoctorByAdmin({ show, handleClose }) {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const handleSubmit = async (e) => {
e.preventDefault();
try {
const token = localStorage.getItem("token");
const API_URL = "https://smart-healthcare-dashboard-b1wk.onrender.com"
const res = await axios.post(
`${API_URL}/auth/admin/doctor`,
{ name, email },
{
headers: {
Authorization: `Bearer ${token}`
}
}
);
// ✅ show success properly
if (res.data?.success) {
toast.success(res.data.message || "Doctor added successfully");
} else {
toast.warning(res.data.message || "Something happened");
}
setName("");
setEmail("");
handleClose();
} catch (err) {
// ✅ use toast instead of alert
const message = err.response?.data?.message || "Error";
toast.error(message);
}
};
if (!show) return null;
return (
<>
<div className="modal-backdrop fade show"></div>
<div className="modal show d-block">
   <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
         <div className="modal-header">
            <h5 className="modal-title">Add Doctor</h5>
            <button className="btn-close" onClick={handleClose}></button>
         </div>
         <div className="modal-body">
            <form onSubmit={handleSubmit}>
               <input
                  className="form-control mb-3"
                  placeholder="Doctor Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
               required
               />
               <input
                  className="form-control mb-3"
                  type="email"
                  placeholder="Doctor Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               required
               />
               <button className="btn btn-primary w-100">
               Send Invite
               </button>
            </form>
         </div>
      </div>
   </div>
</div>
</>
);
}
export default AddDoctorByAdmin;