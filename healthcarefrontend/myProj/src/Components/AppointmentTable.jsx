import React from "react";
const AppointmentTable = ({ title, data, handleStatusChange }) => {
if (!Array.isArray(data)) return null;
return (
<div className="mb-4">
   <h4 className="mb-3">{title}</h4>
   <table className="table table-hover shadow-sm bg-white">
      <thead className="table-primary">
         <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
         </tr>
      </thead>
      <tbody>
         {data.length > 0 ? (
         data.map((a, index) => (
         <tr key={a._id}>
            <td>{index + 1}</td>
            <td>{a.patientId?.patientName || "-"}</td>
            <td>{a.patientId?.email || "-"}</td>
            <td>
               {new Date(a.appDate).toLocaleDateString("en-IN")}
            </td>
            <td>{a.appTime}</td>
            <td>
               <span
               className={`badge ${
               a.status?.toLowerCase() === "pending"
               ? "bg-warning"
               : a.status?.toLowerCase() === "confirmed"
               ? "bg-success"
               : a.status?.toLowerCase() === "completed"
               ? "bg-primary"
               : "bg-danger"
               }`}
               >
               {a.status}
               </span>
            </td>
            <td>
               {/* Pending */}
               {a.status?.toLowerCase() === "pending" && (
               <>
               <button
                  className="btn btn-success btn-sm"
                  onClick={() =>
               handleStatusChange(a._id, "confirmed")
               }
               >
               Accept
               </button>
               <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() =>
               handleStatusChange(a._id, "rejected")
               }
               >
               Reject
               </button>
               </>
               )}
               {/* Confirmed */}
               {a.status?.toLowerCase() === "confirmed" && (
               <>
               <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
               if (
               window.confirm(
               "Mark this appointment as completed?"
               )
               ) {
               handleStatusChange(a._id, "completed");
               }
               }}
               >
               Complete
               </button>
               <button
                  className="btn btn-warning btn-sm ms-2"
                  onClick={() =>
               handleStatusChange(a._id, "cancelled")
               }
               >
               Cancel
               </button>
               </>
               )}
               {/* Rejected */}
               {a.status?.toLowerCase() === "rejected" && (
               <button
                  className="btn btn-outline-danger btn-sm"
                  disabled
                  >
               Rejected ✗
               </button>
               )}
               {/* Completed */}
               {a.status?.toLowerCase() === "completed" && (
               <button
                  className="btn btn-outline-success btn-sm"
                  disabled
                  >
               Completed ✓
               </button>
               )}
               {/* Cancelled */}
               {a.status?.toLowerCase() === "cancelled" && (
               <button
                  className="btn btn-outline-warning btn-sm"
                  disabled
                  >
               Cancelled
               </button>
               )}
            </td>
         </tr>
         ))
         ) : (
         <tr>
            <td colSpan="7" className="text-center">
               No results found
            </td>
         </tr>
         )}
      </tbody>
   </table>
</div>
);
};
export default AppointmentTable;