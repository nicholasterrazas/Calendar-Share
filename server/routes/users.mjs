import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the users.
router.get("/", async (req, res) => {
  let collection = await db.collection("users");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single user by id
router.get("/:user_id", async (req, res) => {
  let collection = await db.collection("users");
  let query = {user_id: req.params.user_id.toString() };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you get a single user's rooms
router.get("/:user_id/rooms", async (req, res) => {
  try {
    const userId = req.params.user_id.toString();
    
    // Find the user document with the specified user_id
    const userCollection = await db.collection("users");
    const user = await userCollection.findOne({ user_id: userId });
  
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
  
    // Get the room_ids from the user document
    const roomIds = user.rooms;
  
    // Find the room documents with the specified room_ids
    const roomCollection = await db.collection("rooms");
    const rooms = await roomCollection.find({ room_id: { $in: roomIds } }).toArray();
  
    res.status(200).send(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// This section will help you create a new user.
router.post("/", async (req, res) => {
  let newDocument = {
    user_id: req.body.user_id,
    name: req.body.name,
    email: req.body.email,
    rooms: req.body.rooms
  };
  let collection = await db.collection("users");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// This section will help you update a user by id.
router.patch("/:user_id", async (req, res) => {
  const query = { user_id: req.params.user_id.toString() };
  const updates =  {
    $set: {
      user_id: req.body.user_id,
      name: req.body.name,
      email: req.body.email,
      rooms: req.body.rooms    
    }
  };

  let collection = await db.collection("users");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// This section will help you delete a user
router.delete("/:user_id", async (req, res) => {
  const query = { user_id: req.params.user_id.toString() };

  const collection = db.collection("users");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;