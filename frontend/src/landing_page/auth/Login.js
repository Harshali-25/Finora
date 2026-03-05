import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

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

      // Save consistent keys
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data.user.id || data.user._id,
        name: data.user.name,
        role: data.user.role || "USER"
      }));

      navigate("/dashboard"); // Go to Dashboard
    } catch (err) {
      alert("Server error.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleLogin}>
          <input type="email" name="email" className="form-control mb-3" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" className="form-control mb-3" placeholder="Password" onChange={handleChange} required />
          <button className="btn btn-primary w-100">Login</button>
        </form>
        <p className="text-center mt-3">
          New user? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/signup")}>Create Account</span>
        </p>
      </div>
    </div>
  );
}

export default Login;