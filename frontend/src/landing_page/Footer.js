import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{ backgroundColor: "rgb(250,250,250)" }}>
      <div className="container border-top mt-2">
        <div className="row mt-3">
          <div className="col">
            {/* Clickable Logo */}
            <Link to="/">
              <img
                src="media/images/Logo.svg"
                alt="Finora Logo"
                style={{ width: "60%", cursor: "pointer" }}
              />
            </Link>
            <p>© 2025 Finora</p>
          </div>

          <div className="col">
            <p>Account</p>
            <ul className="list-unstyled">
              <li>Open Demat account</li>
              <li>Investment account</li>
            </ul>
          </div>

          <div className="col">
            <p>Support</p>
            <ul className="list-unstyled">
              <li>Contact support</li>
              <li>Help center</li>
            </ul>
          </div>

          <div className="col">
            <p>Company</p>
            <ul className="list-unstyled">
              <li>About Finora</li>
            </ul>
          </div>
        </div>

        <div className="mt-3 text-small text-muted">
          <p>
            All information on this website is for academic and demonstration
            purposes only. All trading and investment references are fictional.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
