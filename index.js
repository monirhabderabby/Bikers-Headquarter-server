const express = require('express')
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

const port = process.env.PORT || 8080;

//use middleware
app.use(cors());
app.use(express.json());

//mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@biker-headquarter.3zbd9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        const ProductCollection = client.db("ProductCollection").collection("Products");
        
        //POST API
        //Add single product to mongodb
        app.post('/addProduct', async (req, res)=>{
            const product = req.body;
            const result = await ProductCollection.insertOne(product);
            res.send(result)

        })

        //GET API
        //Get all products from DB
        app.get('/allProducts', async (req, res)=>{
            const query = {};
            const cursor = ProductCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        //Get signel product filterirng by params id

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ProductCollection.findOne(query);
            res.send(result)
        })


        //PUT API
        app.put('/product/:id', async (req, res)=>{
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = {_id: ObjectId(id)};
            const option = { upsert : true };
            console.log(updatedQuantity);
            const updateDoc = {
                $set: {
                    quantity: updatedQuantity.quantity
                }
            };
            const result = await ProductCollection.updateOne(filter, updateDoc, option);
            res.send(result)


        })





    }
    finally{

    }
    
}
run().catch(console.dir)

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(port, ()=>{
    console.log("server is running!");
})