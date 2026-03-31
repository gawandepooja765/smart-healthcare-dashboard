import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Send OTP
  const handleSendOTP = async () => {
    try {
      await axios.post("http://localhost:3000/auth/forgot-password", { email });
      alert("OTP sent");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // Reset Password
  const handleReset = async () => {
    try {
      await axios.post("http://localhost:3000/auth/reset-password", {
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
    <div className="container mt-5">

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <h4>Forgot Password</h4>
          <input
            type="email"
            placeholder="Enter email"
            className="form-control mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSendOTP}>
            Send OTP
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h4>Reset Password</h4>

          <input
            type="text"
            placeholder="Enter OTP"
            className="form-control mb-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            className="form-control mb-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="btn btn-success" onClick={handleReset}>
            Reset Password
          </button>
        </>
      )}
    </div>
  );
}