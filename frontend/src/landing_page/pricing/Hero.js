import React from 'react';
function Hero() {
    return ( 
        <div className="container p-5">
      <div className="row text-center">
        <h1 className="mb-3">Pricing</h1>
          <p>
            Finroa promotes transparent pricing with simple and straightforward
            charges. Users can access services without worrying about hidden
            costs or complicated fee structures.
          </p>
          <div className="row text-center">
            <div className="col p-3 border">
              <h1>&#8377;0</h1>
              <p>Free account opening</p>
            </div>
            <div className="col p-3 border">
              <h1>&#8377;0</h1>
              <p>
                Free stock delivery
              </p>
            </div>
          </div>
        </div>
      </div>
     );
}

export default Hero;