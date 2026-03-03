import React from "react";
import { useNavigate } from "react-router-dom";

function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="row p-5">
        <div className="col-4">
          <h1 className="mb-3">Pricing</h1>
          <p>
            Finora promotes transparent pricing with simple and straightforward
            charges. Users can access services without worrying about hidden
            costs or complicated fee structures.
          </p>
        </div>

        <div className="col-2"></div>

        <div className="col-6">
          <div className="row text-center">
            <div className="col p-3 border">
              <h1>&#8377;0</h1>
              <p>Free account opening</p>
            </div>
            <div className="col p-3 border">
              <h1>&#8377;0</h1>
              <p>Free stock delivery</p>
            </div>
          </div>
          </div>
        </div>
      </div>
  );
}

export default Pricing;
