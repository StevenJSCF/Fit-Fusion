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
          // Check if it's an array before using forEach
          if (Array.isArray(myFood.food[category][subcategory])) {
            myFood.food[category][subcategory].forEach((food) =>
              displayFood(food, mainContainer)
            );
          } else {
            // Handle non-array case here if needed
            console.error("Expected array, but found:", myFood.food[category][subcategory]);
          }
        }
      }
    }
  } else {
    if (Array.isArray(myFood.food[selectedFood])) {
      myFood.food[selectedFood].forEach((food) =>
        displayFood(food, mainContainer)
      );
    } else {
      for (let subcategory in myFood.food[selectedFood]) {
        // Check if it's an array before using forEach
        if (Array.isArray(myFood.food[selectedFood][subcategory])) {
          myFood.food[selectedFood][subcategory].forEach((food) =>
            displayFood(food, mainContainer)
          );
        } else {
          // Handle non-array case here if needed
          console.error("Expected array, but found:", myFood.food[selectedFood][subcategory]);
        }
      }
    }
  }

  if (selectedFood === "all") {
    for (let category in myFood.food) {
      let categoryData = myFood.food[category];
      if (category === "url") {
        displayFood(categoryData, mainContainer);
      } else {
        for (let foodItem in categoryData) {
          if (foodItem === "url") {
            displayFood(categoryData[foodItem], mainContainer);
          } else {
            categoryData[foodItem].forEach((food) =>
              displayFood(food, mainContainer)
            );
          }
        }
      }
    }
  } else {
    let selectedCategory = myFood.food[selectedFood];
    if (selectedCategory.url) {
      displayFood(selectedCategory.url, mainContainer);
    } else {
      for (let foodItem in selectedCategory) {
        if (foodItem === "url") {
          displayFood(selectedCategory[foodItem], mainContainer);
        } else {
          selectedCategory[foodItem].forEach((food) =>
            displayFood(food, mainContainer)
          );
        }
      }
    }
  }
  
}

function displayFood(food, container) {
  if (Array.isArray(food)) {
    // If food is an array, loop through each item and display it
    food.forEach(item => displayFood(item, container));
  } else if (typeof food === 'string') {
    // If food is a string (URL), create an image element
    let image = document.createElement("img");
    image.src = food;
    container.appendChild(image);
  } else {
    // If food is an object, display its details
    let type = food.type;
    let serving_size_in_g = food.serving_size_in_g;
    let protein = food.protein;
    let calories = food.calories;
    let carbs = food.carbs;
    let url;

    let division = document.createElement("div");
    division.innerHTML = `
        <h3>${type}</h3>
        <strong>Servings in grams: </strong>${serving_size_in_g}<br>
        <strong>Protein: </strong>${protein}<br>
        <strong>Calories: </strong>${calories}<br>
        <strong>Carbs: </strong>${carbs}<br>
        

    `;
    container.appendChild(division);
  }
}