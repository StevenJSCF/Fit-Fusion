import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Workout_plan from "./Workout_plan.js";
import Meal_plan from "./Meal_plan.js";
import My_calories from "./My_calories.js";
import Contact from "./contact.js";
import CreatedMeals  from "./created_meals.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="/Workout_plan" element={<Workout_plan />} />
      <Route path="/Meal_plan" element={<Meal_plan />} />
      <Route path="/My_calories" element={<My_calories />} />
      <Route path="/created_meals" element={<CreatedMeals />} />
      <Route path="/contact" element={<Contact />} /> 
    </Routes>
  </BrowserRouter>
);
