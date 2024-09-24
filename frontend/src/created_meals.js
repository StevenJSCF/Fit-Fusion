import React, { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreatedMeals() {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <Container>
      <h1>Created Meals Page</h1>
      <Button variant="secondary" onClick={() => navigate("/Meal_plan")}>
        Go back to Meal Plan
      </Button>
    </Container>
  );
}

export default CreatedMeals;
