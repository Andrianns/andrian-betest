const { MongoClient } = require('mongodb');

const uri = process.env.URI;

const client = new MongoClient(uri);
let getConnection;
async function connectMongo() {
  try {
    await client.connect();
    const db = client.db('db_andrian_betest');
    getConnection = db;
    console.log('Connected to MongoDB', getConnection);
    return db;
  } catch (error) {
    console.log(error);
    await client.close();
  }
}

function getDB() {
  return getConnection;
}

module.exports = {
  connectMongo,
  getDB,
};
