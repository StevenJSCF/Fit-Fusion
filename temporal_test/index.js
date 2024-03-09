// File: exercises.js

function getInputValue() {
  let exerciseName = document.getElementById("inputExerciseName");
  let selectedExercise = exerciseName.value;

  fetch("data.json")
    .then((response) => response.json())
    .then((myExercises) => loadExercises(myExercises, selectedExercise))
    .catch((error) => console.error("Error fetching data:", error));
}

function loadExercises(myExercises, selectedExercise) {
  var mainContainer = document.getElementById("exercises-container");
  mainContainer.innerHTML = ""; // Clear the container

  if (selectedExercise === "all") {
    for (let category in myExercises.exercises) {
      if (Array.isArray(myExercises.exercises[category])) {
        myExercises.exercises[category].forEach((exercise) =>
          displayExercise(exercise, mainContainer)
        );
      } else {
        for (let subcategory in myExercises.exercises[category]) {
          myExercises.exercises[category][subcategory].forEach((exercise) =>
            displayExercise(exercise, mainContainer)
          );
        }
      }
    }
  } else if (Array.isArray(myExercises.exercises[selectedExercise])) {
    myExercises.exercises[selectedExercise].forEach((exercise) =>
      displayExercise(exercise, mainContainer)
    );
  } else {
    for (let subcategory in myExercises.exercises[selectedExercise]) {
      myExercises.exercises[selectedExercise][subcategory].forEach((exercise) =>
        displayExercise(exercise, mainContainer)
      );
    }
  }
}

function displayExercise(exercise, container) {
  let name = exercise.name;
  let description = exercise.description;
  let url = exercise.url;

  let division = document.createElement("div");
  division.className = "exercise-item"; // Add a class to the div
  division.innerHTML = `
  <h3 class="exercise-name">${name}</h3>
  <p class="exercise-description">${description}</p>
  <img class="exercise-image" src=${url} width = "200" />
    `;
  container.appendChild(division);
}

// File: meal-plan.js

function getFoodValue() {
  let foodName = document.getElementById("inputFoodKind");
  let selectedFood = foodName.value;

  fetch("data.json")
    .then((response) => response.json())
    .then((myFood) => loadFood(myFood, selectedFood))
    .catch((error) => console.error("Error fetching data:", error));
}

function loadFood(myFood, selectedFood) {
  var mainContainer = document.getElementById("food-container");
  mainContainer.innerHTML = ""; // Clear the container

  if (selectedFood === "all") {
    for (let category in myFood.food) {
      if (Array.isArray(myFood.food[category])) {
        myFood.food[category].forEach((food) =>
          displayFood(food, mainContainer)
        );
      } else {
        for (let subcategory in myFood.food[category]) {
          myFood.food[category][subcategory].forEach((food) =>
            displayFood(food, mainContainer)
          );
        }
      }
    }
  } else if (Array.isArray(myFood.food[selectedFood])) {
    myFood.food[selectedFood].forEach((food) =>
      displayFood(food, mainContainer)
    );
  } else {
    for (let subcategory in myFood.food[selectedFood]) {
      myFood.food[selectedFood][subcategory].forEach((food) =>
        displayFood(food, mainContainer)
      );
    }
  }
}

function displayFood(food, container) {
  let type = food.type;
  let serving_size_in_g = food.serving_size_in_g;
  let protein = food.protein;
  let calories = food.calories;
  let carbs = food.carbs;
  let url;

  switch (food.category) {
    case "protein":
      url = food.protein.url; // Assuming the first item in the array contains the URL
      break;
    case "carbs":
      url = food.carbs.url;
      break;
    case "veggies":
      url = food.veggies.url;
      break;
    case "fats":
      url = food.fats.url;
      break;
    case "fruits":
      url = food.fruits.url;
      break;
    default:
      // If category is not provided or recognized, set a default URL
      url = "default-url.jpg";
      break;
  }

  let division = document.createElement("div");
  division.innerHTML = `
        <h3>${type}</h3>
        <strong>Servings in grams: </strong>${serving_size_in_g}<br>
        <strong>Protein: </strong>${protein}<br>
        <strong>Calories: </strong>${calories}<br>
        <strong>Carbs: </strong>${carbs}<br>
        <img src="${url}" alt="${type}" width = "200"/>   
        
    `;
  container.appendChild(division);
}
