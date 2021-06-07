import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import primaryBg from "../assets/primaryBg.jpeg";
import { globalStyles } from "./GlobalStyles";
import useMediaQuery from "./useMediaQuery";
import mobileBg from "../assets/mobileBg.jpeg";

export default function GuestRegister({ setAuth }) {
  const mobileViewPort = useMediaQuery("(max-width: 500px)");

  const styles = {
    ...globalStyles,
    backgroundImage: mobileViewPort ? `url(${mobileBg})` : `url(${primaryBg})`,
  };

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
    guests_email: "",
  });

  let { guestsemail, guestsname } = useParams();
  guestsemail = atob(guestsemail);

  const { email, name, password } = inputs;

  const handleInput = e => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const isValidPassword = password => /.{6,30}/.test(password);

  const handleFormSubmit = async e => {
    e.preventDefault();

    if (!isValidPassword(password)) {
      toast.error("Password must be between 6 and 30 characters");
      return;
    }

    try {
      const body = { email, name, password, guestsemail, guestsname };
      const response = await fetch(
        `http://localhost:5000/auth/guest-register/${guestsemail}/${guestsname}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        toast.success("Successfully registered. Welcome!");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
      toast.error("An error occured. Retry via link from the invite email.");
    }
  };

  return (
    <div style={styles}>
      <div className="container">
        <h1 className="text-center my-5">Register</h1>
        <form
          className="text-center justify-content-center"
          onSubmit={handleFormSubmit}
        >
          <input
            className="form-control my-2 mx-auto col-xs-4 col-sm-8 col-md-5"
            type="email"
            name="email"
            placeholder="email"
            value={email}
            onChange={handleInput}
            required
          ></input>
          <input
            className="form-control my-2 mx-auto col-xs-4 col-sm-8 col-md-5"
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={handleInput}
            required
          ></input>
          <input
            className="form-control my-2 mx-auto col-xs-4 col-sm-8 col-md-5"
            type="text"
            name="name"
            placeholder="your name"
            value={name}
            onChange={handleInput}
            required
          ></input>
          <input type="hidden" name="guest_name" value={guestsname}></input>
          <input type="hidden" name="guest_email" value={guestsemail}></input>
          <button className="btn btn-success form-control my-3 mx-1 col-xs-2 col-sm-4 col-md-5">
            sign up
          </button>
        </form>
        <div className="text-center mt-2">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}
