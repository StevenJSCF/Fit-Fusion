import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Dropdown,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./App.css"; // Import custom CSS for layout

// Product component
function Product({ product, onAddToMeal }) {
  const handleAddToMeal = () => {
    onAddToMeal(product.id);
  };

  return (
    <Col xs={6} md={4} lg={3}>
      <Card className="mb-3">
        <Card.Body>
          <div className="text-center">
            <h5>
              <strong>{product.name}</strong>
            </h5>
            <p>Servings per gram: {product.serving_size_in_g}g</p>
            <p>Protein: {product.protein}g</p>
            <p>Calories: {product.calories}</p>
            <p>Carbs: {product.carbs}g</p>
            <Button variant="primary" onClick={handleAddToMeal}>
              Add to Meal
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

// MealPlanList component
function MealPlanList() {
  const [products, setProducts] = useState([]);
  const [display, setDisplay] = useState([]);
  const [mealItems, setMealItems] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [mealName, setMealName] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch product data from the JSON file
    fetch("http://localhost:8081/food") // Assuming the JSON file is named data.json and is in the public folder
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setDisplay(new Array(data.length).fill(true));
      });
  }, []);

  const toggleDisplay = (index) => {
    const newDisplay = [...display];
    newDisplay[index] = !newDisplay[index];
    setDisplay(newDisplay);
  };

  // Function to add a food item to the meal
  const addToMeal = (productId) => {
    const selectedFood = products.find((product) => product.id === productId);
    if (selectedFood) {
      const updatedMealItems = [...mealItems];
      const existingItemIndex = updatedMealItems.findIndex(
        (item) => item.id === selectedFood.id
      );
      if (existingItemIndex !== -1) {
        // If the selected food is already in the meal, update its quantity
        updatedMealItems[existingItemIndex].quantity += 1;
      } else {
        // If the selected food is not in the meal, add it as a new meal item
        updatedMealItems.push({
          id: selectedFood.id,
          name: selectedFood.name,
          quantity: 1,
          protein: selectedFood.protein,
          calories: selectedFood.calories,
          carbs: selectedFood.carbs,
        });
      }
      setMealItems(updatedMealItems);
    }
  };

  // Function to delete a meal item
  const deleteMealItem = (id) => {
    setMealItems(mealItems.filter((item) => item.id !== id));
  };

  // This tranfer the users meal and uploads it to the database
  const saveMealToDatabase = () => {
    // Check if meal name is provided
    if (!mealName.trim()) {
      window.alert("Please enter a name for your meal.");
      return;
    }

    // Assuming you have an endpoint to save meal items to the database
    fetch("http://localhost:8081/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mealName, mealItems }), // Include mealName in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Meal saved successfully:", data);
        // Clear the meal items and meal name after saving
        setMealItems([]);
        setMealName("");

        // Show alert box indicating success
        window.alert("Meal saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving meal:", error);
      });
  };
  const filterProductsByType = (type) => {
    setSelectedType(type);
    if (type === "All") {
      setDisplay(new Array(products.length).fill(true));
    } else {
      const newDisplay = products.map((product) => product.type === type);
      setDisplay(newDisplay);
    }
  };

  // Function to filter products based on search query
  const filterProductsByName = (query) => {
    setSearchQuery(query);
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    const newDisplay = products.map((product) =>
      filteredProducts.includes(product)
    );
    setDisplay(newDisplay);
  };

  // Get unique food types from the products array
  const foodTypes = [
    ...new Set(products.map((product) => product.type)),
  ].filter(Boolean);

  return (
    // Navbar of the page
    <div className="App">
      <div className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          {/* Search bar */}
          <Form inline>
            <Form.Control
              type="text"
              placeholder="Search food..."
              value={searchQuery}
              onChange={(e) => filterProductsByName(e.target.value)}
            />
          </Form>

          {/* Navbar links */}
          <ul className="navbar-nav"></ul>

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
              <Link className="nav-link" to="/Meal_plan">
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

      <div className="container">
        {/* Selected items */}
        <div className="selected-items">
          <div className="left-text">
            <h1>My meals</h1>

            {/* New button to navigate to created meals */}
            <Button
              variant="secondary"
              onClick={() => navigate("/created_meals")}
            >
              View Created Meals
            </Button>
          </div>

          {mealItems.length > 0 && (
            <Card>
              <Card.Body>
                <h5>Meal Items:</h5>
                <ul>
                  {mealItems.map((item) => (
                    <li key={item.id}>
                      <strong>{item.name}</strong> - Quantity: {item.quantity},
                      Protein: {item.protein * item.quantity}g, Calories:{" "}
                      {item.calories * item.quantity}, Carbs:{" "}
                      {item.carbs * item.quantity}g
                      <Button
                        variant="danger"
                        onClick={() => deleteMealItem(item.id)}
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* Dropdown for filtering by type */}
        <Dropdown className="mb-3">
          <div className="left-text">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Filtered by Type: {selectedType}
            </Dropdown.Toggle>
          </div>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => filterProductsByType("All")}>
              All
            </Dropdown.Item>
            {foodTypes.map((type) => (
              <Dropdown.Item
                key={type}
                onClick={() => filterProductsByType(type)}
              >
                {type}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Selected items */}
      <div className="selected-items">
        {mealItems.length > 0 && (
          <Card>
            <Card.Body>
              <h5>Meal Items:</h5>
              <ul>
                {mealItems.map((item) => (
                  <li key={item.id}>
                    <strong>{item.name}</strong> - Quantity: {item.quantity},
                    Protein: {item.protein * item.quantity}g, Calories:{" "}
                    {item.calories * item.quantity}, Carbs:{" "}
                    {item.carbs * item.quantity}g
                  </li>
                ))}
              </ul>

              {/* This is where the user have to input the name for its meal*/}
              <Form.Group>
                <Form.Control
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="Enter meal name"
                />
              </Form.Group>

              {/* This is the button to save the created meals */}
              <Button variant="primary" onClick={saveMealToDatabase}>
                Save Meal
              </Button>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Products display */}
      <Container>
        <Row>
          {products.map(
            (product, index) =>
              display[index] && (
                <Product
                  key={index}
                  product={product}
                  display={display[index]}
                  toggleDisplay={() => toggleDisplay(index)}
                  onAddToMeal={addToMeal}
                />
              )
          )}
        </Row>
      </Container>
    </div>
  );
}

export default MealPlanList;


