import React from 'react'
import { Link} from 'react-router-dom'
function Home() {
return (
<div className='container mb-5'>
   <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
         <Link className="navbar-brand" to="/" style={{color:"#0D47A1",fontWeight:"700"}}>
         CareLink</Link>
         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
         <span class="navbar-toggler-icon"></span>
         </button>
         <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
            <ul class="navbar-nav">
               <li class="nav-item">
                  <Link className="nav-link active" aria-current="page" to="login">
                  Login </Link>
               </li>
               <li class="nav-item">
                  <Link className="nav-link" to="register">
                  Register </Link>
               </li>
              
            </ul>
         </div>
      </div>
   </nav>
   <section>
      <div className='container my-3'>
         <div className="row justify-content-center">
            <div className="col-lg-6">
               <h1 className='text-primary pt-5 pb-3' style={{fontSize:"50px"}}> Your Health, <br /> Simlified </h1>
               <h6 className='fw-3'> Connecting you with expert doctors and <br /> seamless healthcare.</h6>
               {/* <button className='btn btn-primary mt-3'> Login </button>
               <button className='btn  mt-3'> Register </button> */}
               <Link to='login'>
               <button className='btn btn-info  mt-3'> Book Appointment </button></Link>
            </div>
            <div className="col-lg-6">
               <img className='img-fluid' src="https://file.aiquickdraw.com/imgcompressed/img/compressed_54c74f012037151e8139bfefe2775a17.webp" alt="img" />
            </div>
         </div>
      </div>
   </section>
</div>
)
}
export default Home