import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

dotenv.config();

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujjwout.mongodb.net/?appName=Cluster0`;

console.log(process.env.BD_USER);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("coffeeDB");
const coffeeCollection = database.collection("coffee");
const userCollection = database.collection("users");

// coffee list api
app.get("/coffee", async (req, res) => {
  const cursor = coffeeCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

// coffee item details
app.get("/coffee/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await coffeeCollection.findOne(query);
  res.send(result);
});

// Add coffee api
app.post("/coffee", async (req, res) => {
  const newCoffee = req.body;
  console.log("post api is hitting", newCoffee);
  const result = await coffeeCollection.insertOne(newCoffee);
  res.send(result);
});

// Update Coffee api
app.put("/coffee/:id", async (req, res) => {
  console.log("Update api is hitting");
  const id = req.params.id;
  const coffeeItem = req.body;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updatedCoffeeItem = {
    $set: {
      category: coffeeItem.category,
      details: coffeeItem.details,
      name: coffeeItem.name,
      photo: coffeeItem.photo,
      quantity: coffeeItem.quantity,
      supplier: coffeeItem.supplier,
      taste: coffeeItem.taste,
    },
  };
  const result = await coffeeCollection.updateOne(
    filter,
    updatedCoffeeItem,
    options
  );
  res.send(result);
});

// Delete Coffee api
app.delete("/coffee/:id", async (req, res) => {
  console.log("Delete api is hitting");
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await coffeeCollection.deleteOne(query);
  res.send(result);
});

// Users list api
app.get("/users", async (req, res) => {
  console.log("User list api is hitting");
  const users = userCollection.find();
  const result = await users.toArray();
  res.send(result);
});

// Create user api
app.post("/users", async (req, res) => {
  console.log("create user api is hitting");
  const user = req.body;
  const result = await userCollection.insertOne(user);
  res.send(result);
});

// Update User
app.patch("/users", async (req, res) => {
  console.log("Update api is hitting");
  const user = req.body;
  const filter = { email: user.email };
  // const options = { upsert: true };
  const updatedDoc = {
    $set: {
      lastLoggedAt: user.lastLoggedAt,
    },
  };
  const result = await userCollection.updateOne(filter, updatedDoc);
  res.send(result);
});

// User Delete api
app.delete("/users/:id", async (req, res) => {
  console.log("Delete api is hitting");
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await userCollection.deleteOne(query);
  res.send(result);
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`server is running port, ${port}`);
});
