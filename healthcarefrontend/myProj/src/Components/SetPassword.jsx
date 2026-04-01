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
    <div className="w-50 m-auto py-5 text-center">
    <form onSubmit={submitHandler} className="bg-light p-5">
      <input
        type="password"
        placeholder="Enter new password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Set Password</button>
    </form>
  
  </div>
  )
};

export default SetPassword;
