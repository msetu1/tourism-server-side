const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// config
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dthbdpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const tourismCollection = client.db("touristsProject");
    const tourists = tourismCollection.collection("tourists");
    const allCountries=tourismCollection.collection("allCountries");

    // all country 
    app.get('/allCountries',async(req,res)=>{
      try {
        const result = await allCountries.find({}).toArray(); // Fetch all tourists
        res.send(result); // Send the result to the client
      } catch (error) {
        console.error("Error fetching tourists:", error);
        res.status(500).send({ message: "Error fetching tourists" });
      }
    })

    // average_cost 
    app.get('/allTourists/descending', async (req, res) => {
      const options = {
            // Sort returned documents in descending order by averageCost
            sort: { average_cost: -1 },
      };
      const result = await tourists.find({}, options).toArray();
      res.send(result);
});

    // details
    app.get("/singleCard/:id", async (req, res) => {
      const result = await tourists.findOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    // update
    app.put("/updateCard/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          tourists_spot_name:req.body.tourists_spot_name,
          img:req.body.img,
          average_cost:req.body.average_cost,
          travel_time:req.body.travel_time,
          totalVisitorsPerYear:req.body.totalVisitorsPerYear,
          seasonality:req.body.seasonality,
          country:req.body.country,
          location:req.body.location,
          description:req.body.description,
          email:req.body.email,
        },
      };
      const result = await tourists.updateOne(query, data);
      res.send(result);
      console.log(result);
    });

    // delete 
app.delete('/delete/:id',async(req,res)=>{
  const result =await tourists.deleteOne({_id: new ObjectId(req.params.id)});
  res.send(result)
  
})

    // GET === Read all tourists
    app.get("/allTourists", async (req, res) => {
      try {
        const result = await tourists.find({}).toArray(); // Fetch all tourists
        res.send(result); // Send the result to the client
      } catch (error) {
        console.error("Error fetching tourists:", error);
        res.status(500).send({ message: "Error fetching tourists" });
      }
    });

    // post ===CREATE
    app.post("/addTourists", async (req, res) => {
      const tourism = req.body;
      const result = await tourists.insertOne(tourism);
      res.send(result);
    });

    // my list
    app.get("/myList/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };

      const result = await tourists.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Basic route
app.get("/", (req, res) => {
  res.send("tourists project for server is running");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
