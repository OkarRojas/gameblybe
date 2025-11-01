const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri = "mongodb+srv://Okar76:5j5JD1QjmT6G8VTt@gamebly.tbrvjby.mongodb.net/?appName=Gamebly";


const connectDB = async () => {
  const client = new MongoClient(uri, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // Connect the client to the server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
    
    return client;  // Retorna el cliente para usarlo después
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    process.exit(1);
  }
};

module.exports = connectDB;  // ← EXPORTA LA FUNCIÓN
