const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// midlewere
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wueeg5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const coffeeCollection = client.db('coffeeDB').collection('coffee')
    const userCollection = client.db('coffeeDB').collection('user')


    // coffee management ------------
    app.get('/coffee', async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result)
    })
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })
    app.post('/coffee', async (req, res) => {
      const coffee = req.body;
      const result = await coffeeCollection.insertOne(coffee)
      res.send(result)
    })
    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee = {
        $set: {
          name: coffee.name,
          chef: coffee.chef,
          supplier: coffee.supplier,
          taste: coffee.taste,
          category: coffee.category,
          details: coffee.details,
          photo: coffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(query, updateCoffee, options)
      res.send(result)
    })
    // coffee management ------------



    // user management -----------
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    })

    app.get('/user', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const cursor = userCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.patch('/user/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = {
        $set: {
          role: 'admin'
        }
      }
      const result = await userCollection.updateOne(filter, update, options)
      res.send(result)
    })

    app.post('/user', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'user exists', insertedId: null })
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })
    // user management -----------




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('everything is okey')
})

app.listen(port, () => {
  console.log(`coffee-shop is running from: ${port}`);
})