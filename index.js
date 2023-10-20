const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mrshammo2018:XZXsvFkrbBOJCTAJ@cluster0.1u0fohl.mongodb.net/?retryWrites=true&w=majority";

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
    const latestCollection = client.db('TechDB').collection('latest')
    const productCollection = client.db('TechDB').collection('product');
    const cartCollection = client.db('TechDB').collection('cart');

    app.get('/latest', async (req, res) => {
      const product = latestCollection.find();
      const result = await product.toArray();
      res.send(result);
    })

    app.get('/cart', async (req, res) => {
      const product = cartCollection.find();
      const result = await product.toArray();
      res.send(result);
    })

    app.get('/products', async (req, res) => {
      const product = productCollection.find();
      const result = await product.toArray();
      res.send(result);
    })

    app.get('/products/:brand', async (req, res) => {
      const targetBrand = req.params.brand;
      const query = { brand : targetBrand }
      const product = productCollection.find(query);
      const result = await product.toArray();
      res.send(result);
    })

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    app.post('/products', async (req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
    })

    app.post('/cart', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await cartCollection.insertOne(newProduct);
      res.send(result);
    })

    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };      

      const product = {
          $set: {
              name: updateProduct.name,
              brand: updateProduct.brand,
              image: updateProduct.image,
              type: updateProduct.type,
              rating: updateProduct.rating,
              price: updateProduct.price
          }
        }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);
      });

  
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) =>{
    res.send('tech-park server is running')
});

app.listen(port, () =>{
    console.log(`tech-park is running at port ${port}`)
});