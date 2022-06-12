const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();
const port = process.env.PORT || 5000;

// madelware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9id2w.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
console.log("db add");

const run = async () => {
  try {
    await client.connect();

    const portfolioCollaction = client
      .db("naimul_portfolio")
      .collection("portfolio");
    const usercollaction = client.db("naimul_portfolio").collection("user");

    app.get("/portfolio", async (req, res) => {
      const result = await portfolioCollaction.find().toArray();
      res.send(result);
    });

    app.get("/singal/:id", async (req, res) => {
      const id = req.params.id;

      const quaty = { _id: ObjectId(id) };
      const result = await portfolioCollaction.findOne(quaty);
      res.send(result);
    });

    app.put("/post/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usercollaction.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } finally {
    // await client.close()
  }
};

run().catch(console.dir());

app.get("/", (req, res) => {
  res.send("How Are You?");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
