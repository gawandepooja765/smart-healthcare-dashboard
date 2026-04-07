import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const API_URL = "https://smart-healthcare-dashboard-b1wk.onrender.com"

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/auth/set-password`,
        {
          token,
          password
        }
      );

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="theme-auth-page">
      <div className="theme-auth-card">
        <h4 className="text-center mb-3">Set password</h4>
        <p className="text-muted text-center small mb-4">Choose a secure password for your account.</p>
        <form onSubmit={submitHandler}>
          <label className="form-label">New password</label>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-100">Set password</button>
        </form>
      </div>
    </div>
  )
};

export default SetPassword;
