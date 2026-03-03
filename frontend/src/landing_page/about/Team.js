import React from "react";
function Team() {
  return (
    <div className="container">
      <div className="row p-3 mt-3 border-top ">
        <h1 className="text-center"></h1>
      </div>
      <div
        className="row p-3 mt-3 text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.1em"}}
      >
        <div className="col-6 p-3 text-center text-muted ">
          <img
            src="media/images/harshali.jpeg"
            style={{ borderRadius: "100%", width: "60%" }}
            alt="harshali"
          />
          <h4 className="mt-3">Harshali Kasurde</h4>
          <h6>Founder & Developer</h6>
        </div>
        <div className="col-6 p-3">
          <p>
            Finora was developed by Harshali as part of a college project with
            the vision of creating a modern, efficient, and easy-to-use platform
            for students and beginners entering the world of stock trading. The
            aim is not just to build an app, but to understand how fintech
            platforms work in real life - from design and development to user
            experience and financial concepts.
          </p>
          <p>
            Harshali is passionate about technology and financial markets, and
            Finora represents the intersection of both interests. Through this
            project, she is exploring how digital solutions can make trading
            more accessible and less intimidating for new users.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;
