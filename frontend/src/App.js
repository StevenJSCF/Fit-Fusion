import './App.css';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
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
              <Link className="nav-link" to="/My_meals">
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



      <div className="welcome-box">
        <h2>Welcome</h2>
        <p>website info</p>
        <button className="btn btn-primary">Quick Start</button>
      </div>
    </div>
  );
}

export default App;