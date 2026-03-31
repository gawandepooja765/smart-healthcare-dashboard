import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function Register() {
const apiUrl = "http://localhost:3000/auth/register"
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
<div className='container w-50 m-auto my-5'>
   <h2 className='text-info text-center mb-4'> Registration Form </h2>
   <form className='border p-5' onSubmit={submitHandler}>
      <div class="mb-3">
         <label for="exampleInputEmail1" className="form-label"> Enter full name </label>
         <input type="text" className="form-control" name='patientName' onChange={inputHandler} />
      </div>
      <div class="mb-3">
         <label for="exampleInputEmail1" className="form-label">Email address</label>
         <input type="email" className="form-control" name='email' onChange={inputHandler} />
      </div>
      {/* 
      <div class="mb-3">
         <label for="exampleInputEmail1" className="form-label">Role</label>
         <select name='role' className='form-control' onChange={inputHandler}>
            <option value="">Select role</option>
            <option value="admin"> Admin </option>
            <option value="doctor"> Doctor </option>
         </select>
      </div>
      */}
      <div class="mb-3">
         <label for="exampleInputPassword1" class="form-label">Password</label>
         <input type="password" className="form-control" name='password' onChange={inputHandler}/>
      </div>
      <input type="submit" class="btn btn-primary me-4" />
      <Link to='/add_doctorDetails'>
      <button className='btn btn-primary'> Add Profile</button></Link>
   </form>
</div>
)
}
export default Register