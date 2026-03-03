import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Invalid credentials");

      // 1. Store token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("uid", data.user.id);
      localStorage.setItem("username", data.user.name);

      // 2. Redirect to internal Dashboard path
      navigate("/dashboard");
    } catch (err) {
      alert("Server error. Ensure backend is on 3002.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleLogin}>
          <input type="email" name="email" className="form-control mb-3" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" className="form-control mb-3" placeholder="Password" onChange={handleChange} required />
          <button className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}
export default Login;