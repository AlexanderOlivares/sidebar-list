import React, { useState, useEffect } from "react";
///howw????
// import "./index.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import GuestRegister from "./components/GuestRegister";
import Login from "./components/Login";
import Landing from "./components/Landing";
import ResetPassword from "./components/ResetPassword";

toast.configure();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function isAuth() {
    try {
      const response = await fetch(`http://localhost:5000/auth/is-verified`, {
        method: "POST",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
      console.log(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  }, []);

  const setAuth = Boolean => setIsAuthenticated(Boolean);

  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={props =>
              !isAuthenticated ? (
                <Landing {...props} />
              ) : (
                <Redirect to="/dashboard" />
              )
            }
          ></Route>
          <Route
            exact
            path="/login"
            render={props =>
              !isAuthenticated ? (
                <Login {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/dashboard" />
              )
            }
          ></Route>
          <Route
            exact
            path="/register"
            render={props =>
              !isAuthenticated ? (
                <Register {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/login" />
              )
            }
          ></Route>
          <Route
            exact
            path="/dashboard"
            render={props =>
              isAuthenticated ? (
                <Dashboard {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/login" />
              )
            }
          ></Route>
          <Route
            exact
            path="/guest-register/:guestsemail/:guestsname"
            render={props =>
              !isAuthenticated ? (
                <GuestRegister {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/dashboard" />
              )
            }
          ></Route>
          <Route
            exact
            path="/reset-password/:id/:token"
            render={props =>
              !isAuthenticated ? (
                <ResetPassword {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/dashboard" />
              )
            }
          ></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
