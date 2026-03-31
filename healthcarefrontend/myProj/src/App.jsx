import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {React,useState,useEffect} from "react"
import { Route,Routes } from "react-router-dom"
import Home from "./Components/Home"
import Register from "./Components/Register"
import Login from "./Components/Login"
import AddDoctorComp from "./Components/AddDoctorComp"
import AdminDashboard from "./Components/AdminDashboard"
import EditdoctorComponent from "./Components/EditdoctorComponent"
import Appointment from "./Components/Appointment"
import DoctorDashboard from "./Components/DoctorDashboard"
import SetPassword from "./Components/SetPassword"
import PatientDashboard from "./Components/PateintDashboard"
import PateintProfile from "./Components/PateintProfile"
import AddDoctorByAdmin from "./Components/AddDoctorByAdmin"
import ForgotPassword from "./Components/ForgotPasswordComponent";

function App() {  

  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  return(
    <>
    
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>      
      <Route path="register" element={<Register></Register>}></Route>
      <Route path="/set-password" element={<SetPassword />} />
      <Route path="add_doctorDetails" element={<AddDoctorComp></AddDoctorComp>}></Route>
      <Route path="login" element={<Login setToken={setToken}></Login>}></Route>
      <Route path="doctor-dashboard" element={<DoctorDashboard></DoctorDashboard>}></Route>
      <Route path="admin_dashboard" element={<AdminDashboard></AdminDashboard>}></Route>    
      <Route path="patient_dashboard" element={<PatientDashboard></PatientDashboard>}></Route>
      <Route path="edit_doctor/:_id" element={<EditdoctorComponent></EditdoctorComponent>}></Route>
      <Route path="appointment/:_id" element={<Appointment></Appointment>}></Route>
      <Route path="complete-profile" element={<PateintProfile></PateintProfile>}></Route>
      <Route path="/add/doctor" element={<AddDoctorByAdmin></AddDoctorByAdmin>}></Route> 
      <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
    </Routes>
     <ToastContainer  position="top-right" autoClose={2000} theme="colored"/>
    </>
 
  )
  
}

export default App
