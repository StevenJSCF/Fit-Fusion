import React from "react";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import "./App.css"; // Import custom CSS for layout

// Navbar component
function Contact() {
  return (
    <div className="container">
      <div className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Fit Fusion
          </Link>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/workout_plan">
                Workout Plan
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/meal_plan">
                My meals
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my_calories">
                My Calories
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="myDiv">
        <h1>
          <b> Student info Page</b>
        </h1>
        <h2>
          SE 319 <br />
          <b> Date: </b> 4/28/24 <br />
          <b> Professor Name:</b> Aldaco Abraham <br />
          <b> Names: </b> Steven Chiang -- Andy Fung <br />
          <b> Emails: </b> chiang04@iastate.edu --- fung04@iastate.edu <br />
        </h2>
      </div>
    </div>
  );
}

export default Contact;
