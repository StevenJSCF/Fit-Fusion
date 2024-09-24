// Import necessary components and CSS
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Container, Row, Col, Card, Dropdown, Form } from "react-bootstrap"; // Import Bootstrap components
import { Link } from "react-router-dom";

function Workout_plan({ exercise, handleSelectExercise }) {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row>
          <Col xs={3}></Col>
          <Col xs={9}>
            <Row>
              <Col xs={3}>
                <img src={exercise.url} alt="image" className="img-fluid" />
              </Col>
              <Col xs={9}>
                <h5>
                  <strong>{exercise.name}</strong>
                </h5>
                <p>{exercise.description}</p>
                {/* Add a dropdown to select the day */}
                <Dropdown className="mb-3">
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Select Day
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {daysOfWeek.map((day) => (
                      <Dropdown.Item
                        key={day}
                        onClick={() => handleSelectExercise(exercise, day)}
                      >
                        {day}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

function WorkoutDay({ day, exercises, handleUpdateReps,handleDeleteExercise  }) {
  const [updatedExercises, setUpdatedExercises] = useState(exercises || []);

  useEffect(() => {
    if (exercises) {
      setUpdatedExercises(exercises);
    }
  }, [exercises]);

  const handleRepsChange = (index, newReps) => {
    const newExercises = [...updatedExercises];
    newExercises[index].reps = newReps;
    setUpdatedExercises(newExercises);
  };

  //Save the changes made in the plan for each day
  const handleSave = () => {
    updatedExercises.forEach((exercise) => {
      fetch(`http://localhost:8081/${day}/${exercise.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reps: exercise.reps }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

    // Update the workoutSchedule state with the updated exercises
    handleUpdateReps(day, updatedExercises);
  };

  if (!exercises || exercises.length === 0) {
    return <p>No exercises available for {day}</p>;
  }

  if (!updatedExercises) {
    return null; // or return a loading spinner
  }

  const deleteProduct = (exerciseId) => {
    fetch(`http://localhost:8081/deleteProduct/${day}/${exerciseId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((deleteResponse) => {
        console.log('Product deleted:', deleteResponse);
        // Remove the deleted exercise from the updatedExercises state
        const newExercises = updatedExercises.filter(exercise => exercise.id !== exerciseId);
        setUpdatedExercises(newExercises);
        // Call the handleDeleteExercise function passed as prop
        handleDeleteExercise(day, newExercises);
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };
  

  return (
    <div
      style={{
        margin: "10px",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ display: "flex", justifyContent: "flex-start" }}>
        <span style={{ width: "370px" }}>{day}</span>
        <span>Reps</span>
      </h3>
      {updatedExercises.map((exercise, index) => (
        <div
          key={index}
          style={{
            marginBottom: "8px",
            padding: "8px",
            backgroundColor: "#fff",
            borderRadius: "4px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p
            style={{
              margin: 0,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <strong>{exercise.name}</strong>
            <input style = {{}}
              type="number"
              value={exercise.reps}
              onChange={(e) => handleRepsChange(index, e.target.value)}
            />
<button onClick={() => deleteProduct(exercise.id)}>x</button>

          </p>
        </div>
      ))}
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

const Workout = () => {
  const [exercises, setExercises] = useState([]);
  const [workoutSchedule, setWorkoutSchedule] = useState({});
  const [display, setDisplay] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [selectedType, setSelectedType] = useState("All");


  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const getExercisesForDay = (day) => {
    return workoutSchedule[day];
  };

  useEffect(() => {
    fetch("http://localhost:8081/exercises")
      .then((response) => response.json())
      .then((data) => {
        setExercises(data);
        setDisplay(new Array(data.length).fill(true));
      });

    // Fetch exercises for each day
    daysOfWeek.forEach((day) => {
      fetch(`http://localhost:8081/${day}`)
        .then((response) => response.json())
        .then((data) => {
          setWorkoutSchedule((prevSchedule) => ({
            ...prevSchedule,
            [day]: data, // Add exercises for this day to the schedule
          }));
        })
        .catch((error) => {
          console.error(`Error fetching exercises for ${day}:`, error);
        });
    });
  }, []);

  const toggleDisplay = (index) => {
    const newDisplay = [...display];
    newDisplay[index] = !newDisplay[index];
    setDisplay(newDisplay);
  };

  const handleSelectExercise = (exercise, day) => {
    // Check if the exercise already exists for this day
    if (!workoutSchedule[day].find((ex) => ex.id === exercise.id)) {
      fetch(`http://localhost:8081/${day}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exercise),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          // Update the workoutSchedule state with the new exercise
          setWorkoutSchedule((prevSchedule) => ({
            ...prevSchedule,
            [day]: [...prevSchedule[day], data], // Add the new exercise to the existing day's exercises
          }));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  

  // Add this function in the Workout component
  const handleUpdateReps = (day, updatedExercises) => {
    setWorkoutSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: updatedExercises, // Update the exercises for this day
    }));
  };

  const handleDeleteExercise = (day, updatedExercises) => {
    setWorkoutSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: updatedExercises, // Update the exercises for this day
    }));
  };

    //For filtering the exercises by bodyPart
  const filterExercisesByType = (bodyPart) => {
    setSelectedType(bodyPart);
    if (bodyPart === "All") {
      setDisplay(new Array(exercises.length).fill(true));
    } else {
      const newDisplay = exercises.map((exercise) => exercise.bodyPart === bodyPart);
      setDisplay(newDisplay);
    }
  };

      // Get unique food types from the Exercises array
      const exerciseTypes = [
        ...new Set(exercises.map((exercise) => exercise.bodyPart)),
      ].filter(Boolean);


  //For filtering the exercises by name
  const filterExercisesByName = (query) => {
    setSearchQuery(query);
    const filteredExercises = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(query.toLowerCase())
    );
    const newDisplay = exercises.map((exercise) =>
      filteredExercises.includes(exercise)
    );
    setDisplay(newDisplay);
  };

  return (
    <div className="container">
      <div className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          {/* Navbar of the page */}
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

      <div className="flex flex-row">
        <div className="flex flex-[1]">
          <Container>

            <Row>
              <h1>Search exercise</h1>
              {/* Search bar */}
              <Form inline>
                <Form.Control
                  type="text"
                  placeholder="Search exercise..."
                  value={searchQuery}
                  onChange={(e) => filterExercisesByName(e.target.value)}
                />
              </Form>

              <Dropdown className="mb-3">
          <div className="left-text">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Filter by Body Part: {selectedType}
            </Dropdown.Toggle>
          </div>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => filterExercisesByType("All")}>
              All
            </Dropdown.Item>
            {exerciseTypes.map((type) => (
              <Dropdown.Item
                key={type}
                onClick={() => filterExercisesByType(type)}
              >
                {type}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

              {exercises.map(
                (exercise, index) =>
                  display[index] && (
                    <Workout_plan
                      key={index}
                      exercise={exercise}
                      toggleDisplay={() => toggleDisplay(index)}
                      handleSelectExercise={handleSelectExercise} // Pass the function as a prop
                    />
                  )
              )}
            </Row>
          </Container>
        </div>

        <div className="flex flex-[1]" style={{ marginLeft: "100px" }}>
          {/* Map through daysOfWeek and display exercises for each day */}
          <Container>
            <Row>
              <h1>Workout Plan</h1>
              {daysOfWeek.map((day) => (
                <WorkoutDay
                key={day}
                day={day}
                exercises={getExercisesForDay(day)}
                handleUpdateReps={handleUpdateReps}
                handleDeleteExercise={handleDeleteExercise} // new prop
              />
              ))}
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Workout;
