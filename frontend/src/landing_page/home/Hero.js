import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="container mb-2">
      <div className="row text-center">
        <img
          src="media/images/homeHero.png"
          alt="Hero image"
          className="mb-2"
        />

        <h2 className="mt-3">
          Online platform to invest in stocks
        </h2>

        <button
          className="p-2 btn btn-primary fs-5 mb-2 mt-3"
          style={{ width: "20%", margin: "0 auto" }}
          onClick={() => navigate("/signup")}
        >
          Sign up for free
        </button>
      </div>
    </div>
  );
}

export default Hero;