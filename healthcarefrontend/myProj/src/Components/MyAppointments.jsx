import React, { useEffect, useState } from "react";
import axios from "axios";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const API_URL = "https://smart-healthcare-dashboard-b1wk.onrender.com";

  const fetchAppointments = async () => {
    const res = await axios.get(`${API_URL}/patient/all-appointments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setAppointments(res.data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = appointments.filter((a) => {
    const appDate = new Date(a.appDate);
    if (activeTab === "upcoming")
      return appDate >= today && a.status !== "cancelled";
    if (activeTab === "past") return appDate < today;
    return true;
  });

  const statusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "confirmed") return "text-success fw-semibold";
    if (s === "pending") return "text-warning fw-semibold";
    return "text-danger fw-semibold";
  };

  return (
    <div className="theme-my-appts">
      <h2>My appointments</h2>
      <div className="mb-3">
        {["upcoming", "past", "all"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`theme-tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((a) => (
                <tr key={a._id}>
                  <td>{a.fullName}</td>
                  <td>{a.specialization}</td>
                  <td>{new Date(a.appDate).toLocaleDateString()}</td>
                  <td>{a.appTime}</td>
                  <td className={statusClass(a.status)}>{a.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAppointments;
