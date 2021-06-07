import React from "react";
import { Link } from "react-router-dom";
import footerBg from "../assets/footerBg.jpeg";
import splashpageBg from "../assets/splashpageBg.jpeg";
import AOS from "aos";
import "aos/dist/aos.css";
import { globalStyles } from "./GlobalStyles";

AOS.init();

const splashPageStyles = {
  ...globalStyles,
  backgroundImage: `url(${splashpageBg})`,
};

const footerStyles = {
  ...splashPageStyles,
  backgroundImage: `url(${footerBg})`,
};

export default function Landing() {
  return (
    <>
      <div style={splashPageStyles} className="styles">
        <div className="d-flex px-4 mt-n2 justify-content-end">
          <Link to="/login" className="btn-sm btn-primary mr-3">
            Login
          </Link>
          <Link to="/register" className="btn-sm btn-primary">
            Register
          </Link>
        </div>
        <div
          data-aos="fade-left"
          data-aos-delay="500"
          className="display-4 pt-2 text-center"
        >
          Sidebar
        </div>
        <div
          data-aos="zoom-in"
          data-aos-delay="1000"
          className="mx-auto text-center"
        >
          <h4>A list making app</h4>
        </div>
        <div
          data-aos="fade-right"
          data-aos-delay="500"
          className="card mt-5 mx-auto text-center"
          style={{ width: "18rem" }}
        >
          <div className="card-body">
            <h5 className="card-title">Share Your Ideas</h5>
            <p className="card-text">
              Create your own private list or invite a friend to a "sidebar
              list". You and your sidebar list-buddy will be able create, edit
              and delete items from your shared list.
            </p>
            <Link className="btn btn-primary" to="/register">
              Create Account
            </Link>
          </div>
        </div>
      </div>
      <div className="styles" style={footerStyles}>
        <div className="d-flex align-self-center" style={{ height: "50vh" }}>
          <div
            data-aos="fade-left"
            data-aos-delay="400"
            className="card m-auto text-center"
            style={{ width: "18rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">May I approach the List?</h5>
              <p className="card-text">
                Share the grocery list with your significant other. Let your
                travel partner know what you're packing. Sidebar lets you stay
                up-to-date with changes by allowing you and your list-buddy to
                independently add and edit items on your list.
              </p>
              <Link className="btn btn-primary" to="/register">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
