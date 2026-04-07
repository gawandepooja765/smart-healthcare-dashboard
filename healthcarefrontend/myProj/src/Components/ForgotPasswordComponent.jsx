import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const API_URL = "https://smart-healthcare-dashboard-b1wk.onrender.com"

  // Send OTP
  const handleSendOTP = async () => {
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      alert("OTP sent");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // Reset Password
  const handleReset = async () => {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });

      alert("Password reset successful");
      setStep(1); // reset flow
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="theme-auth-page">
      <div className="theme-auth-card">
      {/* STEP 1 */}
      {step === 1 && (
        <>
          <h4 className="mb-3">Forgot password</h4>
          <p className="text-muted small mb-3">Enter your email to receive an OTP.</p>
          <input
            type="email"
            placeholder="Enter email"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-primary w-100" onClick={handleSendOTP}>
            Send OTP
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h4 className="mb-3">Reset password</h4>
          <input
            type="text"
            placeholder="Enter OTP"
            className="form-control mb-3"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            className="form-control mb-3"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="btn btn-success w-100" onClick={handleReset}>
            Reset password
          </button>
        </>
      )}
      </div>
    </div>
  );
}