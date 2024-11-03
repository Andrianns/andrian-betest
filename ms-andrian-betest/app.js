require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.port || 3000;
const router = require('./src/routes');
const { connectMongo } = require('./src/internal/db');
const Controller = require('./src/controllers');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authentication = require('./src/middleware/authentication');

app.get('/', (req, res) => {
  res.status(200).send('hi');
});
app.post('/generate-token', Controller.generateToken);
app.use(authentication);
app.use('/users', router);

connectMongo()
  .then((db) => {
    // console.log(db);
    app.listen(port, () => {
      console.log('app listen on port: ', port);
    });
  })
  .catch(console.log);
