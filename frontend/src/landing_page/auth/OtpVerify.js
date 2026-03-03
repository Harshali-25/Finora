import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email passed from Signup.js state
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!email) {
      setError("Email missing. Please signup again.");
      return;
    }
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3002/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          otp: otp.trim() 
        }),
      });

      const data = await res.json();

      // NEW: Handle users who are already verified (Status 409)
      if (res.status === 409) {
        alert("Account already verified. Redirecting to Login...");
        navigate("/login");
        return;
      }

      // Check for other server errors
      if (!res.ok) {
        setError(data.message || "Invalid OTP. Please try again.");
        setLoading(false);
        return; 
      }

      // Safety Check: Ensure data and data.user exist before accessing .id
      if (data && data.user) {
        alert("✅ OTP Verified Successfully!");

        localStorage.setItem("token", data.token);
        localStorage.setItem("uid", data.user.id || data.user._id); 
        localStorage.setItem("username", data.user.name);

        navigate("/dashboard");
      } else {
        setError("Login successful, but user details are missing from server.");
      }

    } catch (err) {
      console.error("Verification Fetch Error:", err);
      setError("Cannot connect to server. Ensure backend is running on port 3002.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: "400px", border: "none" }}>
        <h4 className="text-center mb-3 fw-bold">Verify OTP</h4>
        <p className="text-center text-muted small">Sent to: <strong>{email}</strong></p>

        {error && (
          <div className="alert alert-danger py-2 text-center" style={{ fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <input
          className="form-control mb-3 text-center"
          style={{ letterSpacing: "5px", fontSize: "1.5rem", fontWeight: "bold" }}
          placeholder="000000"
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={loading}
        />

        <button 
          className="btn btn-primary w-100 fw-bold py-2" 
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center mt-3">
          <small className="text-muted">
            Didn't get the code? <span className="text-primary" style={{cursor:'pointer'}} onClick={() => navigate("/signup")}>Go back to Signup</span>
          </small>
        </div>
      </div>
    </div>
  );
}

export default OtpVerify;