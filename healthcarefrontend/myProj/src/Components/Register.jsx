import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../register.css';
function Register() {
   const API_URL = "https://smart-healthcare-dashboard-b1wk.onrender.com"
const apiUrl = `${API_URL}/auth/register`
const navigate = useNavigate()
const [formData,setFormData] = useState(
{
patientName : "",
email : "",
password :"",
}
)
function inputHandler(e){
setFormData({...formData,[e.target.name]:e.target.value})
}
async function submitHandler(e){
e.preventDefault();
try{
await axios.post(apiUrl,formData)
console.log(formData)
toast.success("Register successfully..");
navigate('/login')
}  
catch(err){
console.log(err)
toast.warning("Email already exist..")
}
}
return (
<div className='register-page'>
   <div className='register-card'>
      <div className='register-header'>
         <h2>Registration Form</h2>
         <p>Create your account to access the healthcare dashboard.</p>
      </div>
      <form className='register-form' onSubmit={submitHandler}>
         <div className="mb-3">
            <label htmlFor="patientName" className="form-label">Enter full name</label>
            <input id="patientName" type="text" className="form-control" name='patientName' onChange={inputHandler} />
         </div>
         <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input id="email" type="email" className="form-control" name='email' onChange={inputHandler} />
         </div>
         <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" type="password" className="form-control" name='password' onChange={inputHandler}/>
         </div>
         <div className='register-actions'>
            <input type="submit" value="Register" className="btn btn-primary me-2" />
            {/* //<Link to='/add_doctorDetails'>
               <button type='button' className='btn btn-outline-primary'>Add Profile</button>
            </Link>// */}
         </div>
      </form>
   </div>
</div>
)
}
export default Register