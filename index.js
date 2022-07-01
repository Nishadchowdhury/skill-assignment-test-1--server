const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors({
    origin: "*",
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.x1j6m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// console.log(uri);

async function run() {
    try {
        await client.connect();
        const tasksCollection = client.db("task-of-todo").collection("tasks");

        app.get('/tasks', async (req, res) => {
            const tasks = await tasksCollection.find({}).toArray();

            res.send(tasks)
        })

        app.put('/tasks/:id', async (req, res) => {

            const id = req.params.id; //getting id
            const data = req.body;

            console.log(data);
            console.log(id);
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    isDone: data
                },
            };
            const result = await tasksCollection.updateOne(query, updateDoc, options);

            res.send(result)
        })

        app.put('/tasksEdit/:id', async (req, res) => {

            const id = req.params.id; //getting id
            const data = req.body;

            // return

            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    taskDes: data.taskDes,
                },
            };
            const result = await tasksCollection.updateOne(query, updateDoc, options);

            res.send(result)
        })


        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);

            return res.send({ success: true, result: 'task Upload' });
        })

        app.delete('/tasks/:id', async (req, res) => {

            const id = req.params.id; //getting id
            const query = { _id: ObjectId(id) };

            const result = await tasksCollection.deleteOne(query);

            res.send(result);
        })



    } finally {

    }

}

run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('hello world tasks server')
})
app.listen(port, () => {
    console.log(`server is running ${port} `);
})