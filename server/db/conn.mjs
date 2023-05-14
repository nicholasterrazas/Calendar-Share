import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log('Succesfully connected to MongoDB');
} catch(e) {
  console.error(e);
}

let db = conn.db("calendar_share");

export default db;