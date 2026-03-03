import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Send registration data to backend
      const res = await fetch("http://localhost:3002/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // Handle user already exists
      if (res.status === 409) {
        alert("User already exists. Redirecting to login...");
        navigate("/login");
        return;
      }

      // Handle other registration errors
      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      // ✅ Success: Alert and redirect to verification
      alert("Registration successful! Please verify your email.");
      // Pass the email to the next page to know who is verifying
      // Changed path from "/verify-otp" to "/otp" to match App.js
      navigate("/otp", { state: { email: formData.email } });

    } catch (err) {
      console.error(err);
      alert("Server error. Ensure backend is running on port 3002.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Create Account</h3>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            className="form-control mb-3"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            className="form-control mb-3"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <span
            style={{ color: "#0d6efd", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;