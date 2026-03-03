import React from "react";
import { useNavigate } from "react-router-dom";

function OpenAccount() {
  const navigate = useNavigate();

  return (
    <div className="container p-5 mb-2">
      <div className="row text-center">
        <h1>Open a Finora account</h1>
        <p>
          Experience modern, intuitive platforms with simple <br />
          and transparent pricing that makes trading more accessible for everyone.
        </p>

        <button
          className="p-2 btn btn-primary fs-5 mb-5"
          style={{ width: "20%", margin: "0 auto" }}
          onClick={() => navigate("/signup")}
        >
          Sign up Now
        </button>
      </div>
    </div>
  );
}

export default OpenAccount;
