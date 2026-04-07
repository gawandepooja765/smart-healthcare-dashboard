import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { toast } from "react-toastify";
function Home() {
const API_URL = "https://smart-healthcare-dashboard-b1wk.onrender.com";
const loginUrl = `${API_URL}/auth/login`;
const navigate = useNavigate();
const [homeLoginData, setHomeLoginData] = useState({
   email: "",
   password: ""
});
const [loading, setLoading] = useState(false);

function handleHomeInputChange(e){
   setHomeLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
   }));
}

function handleUseDemoAdmin(){
   setHomeLoginData({
      email: "admin123@demo.com",
      password: "admin123"
   });
}

function scrollToHomeLogin(){
   const loginCard = document.getElementById("home-login-form");
   if (loginCard){
      loginCard.scrollIntoView({ behavior: "smooth", block: "center" });
   }
}

async function handleHomeSignIn(e){
   e.preventDefault();
   if (loading) return;

   try{
      setLoading(true);
      const res = await axios.post(loginUrl, homeLoginData);
      const { token, user } = res.data;

      if (!token){
         toast.error("Token not received");
         return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Login successful");

      if (user.role === "doctor"){
         navigate("/doctor-dashboard");
      } else if (user.role === "admin"){
         navigate("/admin_dashboard");
      } else {
         navigate("/patient_dashboard");
      }
   } catch (error){
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
   } finally{
      setLoading(false);
   }
}

return (
<div className='container mb-5'>
   <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
         <Link className="navbar-brand" to="/" style={{color:"#0D47A1",fontWeight:"700"}}>
         CareLink</Link>
         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
         <span className="navbar-toggler-icon"></span>
         </button>
         <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
            <ul className="navbar-nav">
               <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="login">
                  Login </Link>
               </li>
               <li className="nav-item">
                  <Link className="nav-link" to="register">
                  Register </Link>
               </li>
              
            </ul>
         </div>
      </div>
   </nav>
   <section>
      <div className='container my-4'>
         <div className="row justify-content-center home-hero-card">
            <div className="col-lg-7 home-hero-left">
               <p className='hero-badge mb-2'>Smart Healthcare Platform</p>
               <h1 className='text-primary pt-2 pb-2'>Welcome to <br /> Healthcare Dashboard</h1>
               <h6 className='fw-3'>Book appointments, manage profiles, and access trusted doctors from one secure place.</h6>
               <div className="hero-cta-group">
                  <button className='btn btn-info mt-2' onClick={scrollToHomeLogin}>Get Started</button>
                  <Link to='register'>
                     <button className='btn btn-outline-primary mt-2 ms-2'>Create Account</button>
                  </Link>
               </div>
            </div>
            <div className="col-lg-5 home-login-panel">
               <form className="login-form-card" id="home-login-form" onSubmit={handleHomeSignIn}>
                  <h3 className="mb-2">Login</h3>
                  <p className="login-help mb-3">Enter your credentials to continue.</p>
                  <div className="mb-3">
                     <label className="form-label">Email</label>
                     <input type="email" className="form-control" name="email" value={homeLoginData.email} onChange={handleHomeInputChange} placeholder="name@example.com" required />
                  </div>
                  <div className="mb-2">
                     <label className="form-label">Password</label>
                     <input type="password" className="form-control" name="password" value={homeLoginData.password} onChange={handleHomeInputChange} placeholder="Enter password" required />
                  </div>
                  <button type="button" className="btn btn-warning btn-demo-admin mb-3" onClick={handleUseDemoAdmin}>
                     Use Demo Admin
                  </button>
                  <div className="login-links mb-3">
                     <Link to="/forgot-password">Forgot Password?</Link>
                  </div>
                  <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                     {loading ? "Signing In..." : "Sign In"}
                  </button>
                  <p className="mt-3 mb-0">
                     Don&apos;t have an account? <Link to="/register">Sign Up</Link>
                  </p>
               </form>
            </div>
         </div>
      </div>
   </section>
</div>
)
}
export default Home