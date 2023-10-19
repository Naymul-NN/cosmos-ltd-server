const express = require('express')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config()

const cors = require('cors')
const app = express()


//middelware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000

//ScjBMc7HwbegInFi
//my_mongodb


const uri = `mongodb+srv://${process.env.ESER_LAM}:${process.env.PRIVET_PASSWORD}@cluster0.4kfubsh.mongodb.net/?retryWrites=true&w=majority`;




const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// uri.system.users.updateOne(
//   { "user": "my_mongodb" }, // Filter to find the document to update
//   { $set: { "user": "myMongodb" } } // Update the "user" field
// )


async function run() {
  try {
    await client.connect();

    const userCollection = client.db("myDB").collection("users");
    const brandCollection = client.db("myDB").collection("brands");
    const productCollection = client.db("myDB").collection("products");
    const cartCollection = client.db("myDB").collection("carts");

    //  get the  single data

     app.get ('/product/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
  })

  
    //get
    app.get('/users',async(req,res)=>{
      const result = await userCollection.find().toArray();
      res.send(result)
  })
  app.get('/brands',async(req,res)=>{
      const result = await brandCollection.find().toArray();
      res.send(result)
  })

  app.get('/products',async(req,res)=>{
      const result = await productCollection.find().toArray();
      res.send(result)
  })

  // get the products
  app.get('/products/:coty', async(req, res) => {
    const coty = req.params.coty;
    const products = await productCollection.find({brand:coty}).toArray();
    res.send(products);
  });

  //get the cart
  app.get('/carts',async(req,res)=>{
      const result = await cartCollection.find().toArray();
      res.send(result)
  })

  //


    //post
    // app.post('/users', async(req,res)=>{
    //     const user = req.body;
    //     console.log(user);
    //     const result = await userCollection.insertOne(user);
    //     res.send(result);

    // })
    
    app.post('/products', async(req,res)=>{
        const product = req.body;
        console.log(product);
        const result = await productCollection.insertOne(product);
        res.send(result);

    })

    app.post('/carts', async(req,res)=>{
        const cart = req.body;
        console.log(cart);
        const result = await cartCollection.insertOne(cart);
        res.send(result);

    })

    //update

    app.put('/product/:id',async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedproduct= req.body
      const product ={
          $set: {
              name: updatedproduct.name,
              brand: updatedproduct.brand,
              price: updatedproduct.price,
              rating: updatedproduct.rating,
              type: updatedproduct.type,
              details: updatedproduct.details,
              photo: updatedproduct.photo,
          }
      }
    const result = await productCollection.updateOne(filter,product,options);
    res.send(result);
     })

  //cart delete

    app.delete("/carts/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {
          _id: id,
      };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
  })
   
    


    // delete

    app.delete("/users/:id", async(req,res)=>{
        const id = req.params.id;
        const query = {
            _id: new ObjectId(id),
        };
        const result = await userCollection.deleteOne(query);
        res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})