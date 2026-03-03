import React from "react";
function Hero() {
  return (
    <div className="container">
      <div className="row p-5 mt-5">
        <h1 className="fs-3 text-center">
          We reimagined the way brokerage works in India.
          <br />
          Finora is pushing the next big shift & combining simplified investing
        </h1>
      </div>

      <div
        className="row p-5 text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.1em" }}
      >
        <div className="col-6 mb-2 p-5">
          <h4>About Finora</h4>
          <p>
            Finora was created with one clear goal - to make investing and
            trading simple, transparent, and accessible for everyone. In a world
            where most platforms still charge high fees and rely on outdated
            systems, Finora takes a fresh, modern approach.
          </p>
          <p>
            Launched with the belief that technology can empower every investor,
            Finora aims to remove all the barriers that stop people from
            confidently participating in the markets. Even our name reflects
            that spirit - Finora stands for the future of finance, where
            innovation and simplicity go hand in hand.
          </p>
        </div>
        <div className="col-6 mb-2 p-5">
          <h4>Built for the New Age Investor</h4>
          <p>
            Finora combines powerful technology, modern design, and a
            customer-first pricing model to give traders and investors a
            seamless experience. Whether you are a beginner or a market
            professional, Finora provides the tools and insights you need to
            make smarter decisions.
          </p>
          <p>
            Today, users trust Finora to invest, trade, learn, and manage their
            portfolios - all from one unified platform.
          </p>
        </div>
        <div className="row p-2 mt-2 mb-5 text-center">
          <h4>Driving the Future of Finance</h4>
          <p>
            Finora is also committed to supporting innovation in fintech and
            helping shape the next generation of financial products in India.
          </p>
          <p>
            And this is only the beginning. We are constantly building,
            improving, and innovating - creating a platform that matches the
            speed, needs, and ambitions of modern investors.
          </p>
          <p>Welcome to Finora.</p>
          <h6>Finance for everyone, without barriers.</h6>
        </div>
      </div>
    </div>
  );
}

export default Hero;
