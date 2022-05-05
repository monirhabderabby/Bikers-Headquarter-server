const express = require('express')
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        const ProductCollection = client.db("PCollection").collection("Products");
        
        //POST API
        app.post('/addProduct', async (req, res)=>{
            const product = req.body;

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