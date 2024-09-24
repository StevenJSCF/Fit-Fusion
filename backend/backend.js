var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "localhost";
app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});

// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms319_final";
const client = new MongoClient(url);
const db = client.db(dbName);



///////////////////////////////////////// Workout Functions /////////////////////////////////////////
////////////// GET /////////////////

//This is for fetching the all the stored exercises in the database
app.get("/exercise", async (req, res) => {
  await client.connect();
  console.log("Node connected successfully to GET MongoDB");
  const query = {};
  const results = await db.collection("exercises").find(query).limit(100).toArray();
  console.log(results);
  res.status(200);
  res.send(results);
});

//This is for fetching the exercises of each day of the workout plan
app.get("/:day", async (req, res) => {
try{
  await client.connect();
  console.log("Node connected successfully to GET MongoDB");
  const query = {};
  const day = req.params.day;

  const results = await db.collection(day).find(query).limit(100).toArray();
  console.log(results);
  res.status(200).send(results);
} catch (error) {
  console.error("An error occurred:", error);
  res.status(500).send({ error: "An internal server error occurred" });  
}
});

////////////// POST ////////////////

//This is for adding the exercises to the workout plan and it creates a new collection for each day
app.post("/:day", async (req, res) => {
  try {
    await client.connect();
    const day = req.params.day;
    const exercise = req.body;

    // Add the reps property to the exercise object
    exercise.reps = 0;

    const results = await db.collection(day).insertOne(exercise);

    res.status(200).send(exercise);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});


/////////////// PUT /////////////////

//This is for updating the reps of the exercises in the workout plan
app.put("/:day/:exerciseId", async (req, res) => {
  try {
    await client.connect();
    const day = req.params.day;
    const exerciseId = req.params.exerciseId;
    const newReps = req.body.reps;

    const results = await db.collection(day).updateOne(
      { id: parseInt(exerciseId) },
      { $set: { reps: newReps } }
    );

    if (results.modifiedCount === 0) {
      res.status(404).send({ error: "Exercise not found" });
    } else {
      res.status(200).send({ message: "Exercise updated successfully" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

////////////// DELETE /////////////////
app.delete("/deleteProduct/:day/:id", async (req, res) => {
  try {
    const day = req.params.day;
    const id = Number(req.params.id);
    await client.connect();
    console.log("Product to delete :", id);
    const query = { id: id };
    // delete
    const results = await db.collection(day).deleteOne(query);

    // read data from robot to delete to send it to frontend
    // const productDeleted = await db.collection("fakestore_catalog").findOne(query);
    // res.send(productDeleted);

    res.status(200);
    res.send(results);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


///////////////////////////////////////// Mealplan Functions /////////////////////////////////////////

////////////// GET /////////////////
app.get("/food", async (req, res) => {
  await client.connect();
  console.log("Node connected successfully to GET MongoDB");
  const query = {};
  const results = await db.collection("food").find(query).limit(100).toArray();
  console.log(results);
  res.status(200);
  res.send(results);
});

////////////// POST /////////////////
app.post("/meals", async (req, res) => {
  try {
    const { mealName, mealItems } = req.body
    await client.connect();

    // Check if a collection with the same name already exists
    const existingCollections = await db.listCollections({ name: mealName }).toArray();
    if (existingCollections.length > 0) {
      return res.status(400).json({ error: "A meal with this name already exists." });
    }

    const collection = db.collection(mealName);
    const result = await collection.insertMany(mealItems);

    res.status(201).json({
      message: "Meal items saved successfully",
      insertedItems: result.ops,
    });
  } catch (error) {
    console.error("Error saving meal items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
