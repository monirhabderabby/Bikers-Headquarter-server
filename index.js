const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

const port = process.env.PORT || 5000;

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
        const inventoryCollection = client.db("ProductCollection").collection("status");

        //Token generate ( jwt )
        app.post('/login', async(req, res)=>{
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.accessTokenSecret, {
                expiresIn: "1d"
            });
            res.send({accessToken})
        })
        
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

        //Get all products filtering by email
        app.get('/allproductsByEmail/:email', async (req, res)=>{
            const email = req.params.email;
            const filter = {email : email};
            const cursor = ProductCollection.find(filter)
            const result = await cursor.toArray();
            res.send(result)
        })

        //Get inventory update
        app.get('/totalProduct', async (req, res)=> {
            const filter = {};
            const cursor = inventoryCollection.find(filter);
            const result = await cursor.toArray();
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

        app.put('/restock/:id', async (req, res)=>{
            const id = req.params.id;
            const restockQuantity = req.body;
            const filter = {_id: ObjectId(id)};
            const option = { upsert : true };
            const updateDoc = {
                $set : {
                    quantity: restockQuantity.quantity
                }
            };
            const result = await ProductCollection.updateOne(filter, updateDoc, option);
            res.send(result)
        })

        //stock update
        app.put('/stock', async (req, res)=> {
            const data = req.body;
            const DbData = await inventoryCollection.findOne({});
            const oldTotalProducts = parseInt(DbData.totalProducts);
            const newToalProducts = oldTotalProducts + 1;
            const oldTotalQuantity = parseInt(DbData.totalQuantity);
            const newTotalQuantity = oldTotalQuantity + parseInt (data.quantity);
            const filter = {};
            const updateDoc = {
                $set: {
                    totalProducts: newToalProducts,
                    totalQuantity: newTotalQuantity
                }
            }
            const result = await inventoryCollection.updateOne(filter,updateDoc)
            res.send(result)
        })

        //DELETE API
        app.delete("/product/:id", async (req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ProductCollection.deleteOne(query)
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