import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!email) return alert("Email missing. Please signup again.");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3002/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      });

      const data = await res.json();

      if (res.status === 409) {
        alert("Already verified. Redirecting to login...");
        return navigate("/login");
      }

      if (!res.ok) {
        setLoading(false);
        return alert(data.message || "Invalid OTP");
      }

      alert("✅ Verification Successful!");
      
      // Store token and user object consistently
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data.user.id || data.user._id,
        name: data.user.name,
        role: data.user.role || "USER"
      }));

      navigate("/dashboard"); // Redirect to dashboard root
    } catch (err) {
      alert("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h4 className="text-center mb-3">Verify OTP</h4>
        <p className="text-center text-muted">Sent to: <strong>{email}</strong></p>
        <input
          className="form-control mb-3 text-center"
          style={{ letterSpacing: "5px", fontSize: "1.5rem", fontWeight: "bold" }}
          placeholder="000000"
          maxLength="6"
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}

export default OtpVerify;