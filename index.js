
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 3001;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const taskCollection = client.db("taskmange").collection("CreateTask");

    app.post('/tasks', async (req, res) => {
      try {
        const taskData = req.body;
    
        const result = await taskCollection.insertOne(taskData);
    
        res.status(201).send(result) // Send the inserted task document back to the client
      } catch (err) {
        res.status(500).json({ message: err.message }); // Handle server errors
      }
    });
    
    app.get('/tasks', async (req, res) => {
      try {
        const tasks = await taskCollection.find().toArray();
        res.send(tasks);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    
    app.put('/tasks/:id', async (req, res) => {
      try {
        const taskId = req.params.id;
        const taskData = req.body;
        const result = await taskCollection.updateOne(
          { _id: new ObjectId(taskId) },
          { $set: taskData }
        );
        res.send(result);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
    
    
    app.delete('/tasks/:id', async (req, res) => {
      try {
        const taskId = req.params.id;
        const result = await taskCollection.deleteOne({ _id: new ObjectId(taskId) });
        if (result.deletedCount === 1) {
          res.send({ message: 'Task deleted' });
        } else {
          res.status(404).send({ message: 'Task not found' });
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log(`Server is running on port ,${port}`);
});
