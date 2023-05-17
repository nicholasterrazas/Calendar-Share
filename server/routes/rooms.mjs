import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This generate Room IDs for us, the format is a 6 uppercase letters
function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}


// This section will help you get a list of all the rooms.
router.get("/", async (req, res) => {
  let collection = await db.collection("rooms");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single room by id
router.get("/:room_id", async (req, res) => {
    try {
      let collection = await db.collection("rooms");
      let query = {room_id: req.params.room_id};
      let result = await collection.findOne(query);
  
      if (!result) {
        res.send("Not found").status(404);
      } else {
        res.send(result).status(200);
      }        
    } catch (err) {
      res.send("Invalid Room ID").status(400);
    }
});

// This section will help you create a new room.
router.post("/", async (req, res) => {
  let newDocument = {
    room_id: generateRoomCode(), // Generate a unique room code
    title: req.body.title,
    host_id: req.body.host_id,
    participants: req.body.participants,
  };

  let collection = await db.collection("rooms");
  let existingRoom = await collection.findOne({ room_id: newDocument.room_id });

  // Check if the generated code is already in use
  while (existingRoom) {
    newDocument.room_id = generateRoomCode();
    existingRoom = await collection.findOne({ room_id: newDocument.room_id });
  }

  let result = await collection.insertOne(newDocument);
  res.send({ result, room_id: newDocument.room_id }).status(201);
});


// This section will help you update a room by id.
router.patch("/:room_id", async (req, res) => {
  const query = { room_id: req.params.room_id };
  const updates =  {
    $set: {
      title: req.body.title,
      host_id: req.body.host_id,
      participants: req.body.participants,
    }
  };

  let collection = await db.collection("rooms");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// This section will help you delete a room
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("rooms");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;