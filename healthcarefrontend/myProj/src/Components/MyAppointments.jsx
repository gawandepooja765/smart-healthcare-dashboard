import React, { useEffect, useState } from "react";
import axios from "axios";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const API_URL = "https://smart-healthcare-dashboard-b1wk.onrender.com"

  const fetchAppointments = async () => {
    const res = await axios.get(
        `${API_URL}/patient/all-appointments`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    setAppointments(res.data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 🔥 Filter logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = appointments.filter((a) => {
    const appDate = new Date(a.appDate);

    if (activeTab === "upcoming")
      return appDate >= today && a.status !== "cancelled";

    if (activeTab === "past")
      return appDate < today;

    return true; // all
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Appointments</h2>

      {/* 🔥 Tabs */}
      <div style={{ marginBottom: "15px" }}>
        {["upcoming", "past", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              background:
                activeTab === tab ? "#4CAF50" : "#e0e0e0",
              color: activeTab === tab ? "white" : "black",
              border: "none",
              cursor: "pointer"
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🔥 Table */}
      <table border="1" cellPadding="8" width="100%">
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
                <td>
                  {new Date(a.appDate).toLocaleDateString()}
                  
                </td>
                <td>{a.appTime}</td>

                {/* ⭐ Status Color */}
                <td
                  style={{
                    color:
                      a.status === "confirmed"
                        ? "green"
                        : a.status === "pending"
                        ? "orange"
                        : "red"
                  }}
                >
                  {a.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No appointments found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyAppointments;