import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PateintProfile = () => {

  const [formData, setFormData] = useState({
    phone: "",
    gender: "",
    dob: ""
  });

  const navigate = useNavigate();
  const API_URL = "https://smart-healthcare-dashboard-b1wk.onrender.com"

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/auth/complete-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Profile completed successfully");

    } catch (error) {
      console.error(error);
      alert("Error completing profile");
    }

    navigate("/patient_dashboard")
    window.location.reload()
  };

  return (
    <div className="theme-auth-page">
    <div className="container" style={{ maxWidth: 560, margin: "0 auto" }}>
      <div className="theme-auth-card">
      <h2 className="mb-3">Complete profile</h2>
      <p className="text-muted small mb-4">Add your details to finish setup.</p>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            className="form-control"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            className="form-control"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Date of birth</label>
          <input
            className="form-control"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Save profile</button>

      </form>
      </div>
    </div>
    </div>
  );
};

export default PateintProfile;