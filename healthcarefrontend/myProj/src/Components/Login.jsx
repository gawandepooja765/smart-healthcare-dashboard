import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const apiUrl = "http://localhost:3000/auth/login";

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function inputHandler(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  async function submitHandler(e) {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.post(apiUrl, formData);
      const { token, user } = res.data;

      if (!token) {
        toast.error("Token not received");
        return;
      }

      // ✅ store data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);

      toast.success("Login successful ✅");

      // ✅ role-based navigation
      if (user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin_dashboard");
      } else {
        navigate("/patient_dashboard");
      }

    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "";

        // 🔴 1. USER NOT FOUND → REGISTER
        if (message.includes("User not found")) {
          toast.warning("User not found. Please register.");
          navigate("/register");
        }

        // 🔴 2. TOO MANY ATTEMPTS → FORGOT PASSWORD
        else if (message.includes("Too many attempts")) {
          toast.error("3 attempts done. Redirecting to Forgot Password...");
          setTimeout(() => {
            navigate("/forgot-password");
          }, 1500);
        }

        // 🔴 3. INVALID PASSWORD
        else if (message.includes("Invalid password")) {
          toast.warning(message); // shows attempts left
        }

        // 🔴 4. ACCOUNT LOCKED
        else if (message.includes("Account locked")) {
          toast.error("Account locked. Use Forgot Password.");
          navigate("/forgot-password");
        }

        // 🔴 DEFAULT
        else {
          toast.error(message || "Login failed");
        }

      } else {
        toast.error("Server error");
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container w-50 m-auto my-5">
      <h2 className="text-info text-center mb-4">Login Form</h2>

      <form className="border p-5" onSubmit={submitHandler}>
        
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={inputHandler}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={inputHandler}
            required
          />
        </div>

        <input
          type="submit"
          value={loading ? "Logging in..." : "Login"}
          className="btn btn-primary me-2"
          disabled={loading}
        />

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/register")}
        >
          Register
        </button>

        <p className="mt-3">Don't have an account? Register now</p>

        <p className="text-center mt-2">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

      </form>
    </div>
  );
};

export default Login;