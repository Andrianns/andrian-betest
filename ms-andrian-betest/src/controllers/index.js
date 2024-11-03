const { query } = require('express');
const { getDB } = require('../internal/db');
const { ObjectId } = require('mongodb');
const { createToken } = require('../helper/jwt');
const redis = require('../helper/redis');

class Controller {
  static async findAllUser(req, res) {
    const userCache = await redis.get('app:users');
    if (userCache) {
      console.log('READ FROM REDIS');
      return res.status(200).json({
        data: JSON.parse(userCache),
      });
    } else {
      const db = getDB();
      const userCollection = db.collection('users');

      try {
        const data = await userCollection.find().toArray();
        await redis.set('app:users', JSON.stringify(data)); // Move this line here
        return res.status(200).json({
          data,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: 'Internal Server Error',
        });
      }
    }
  }
  static async findSpecificUser(req, res) {
    const db = getDB();
    const userKey = `app:user-${JSON.stringify(req.query)}`;
    const userCache = await redis.get(userKey);
    console.log(userCache);
    // const userCache = await redis.get(`app:user-${req.query}`);
    if (userCache) {
      // console.log('READ FROM REDIS');
      return res.status(200).json({
        data: JSON.parse(userCache),
      });
    } else {
      try {
        let query = req.query;
        const user = await db.collection('users').findOne(query);

        if (!user) {
          return res.status(404).json({ message: 'User  Not Found' });
        }
        await redis.set(userKey, JSON.stringify(user), 'EX', 3600);

        // User found, return the user data
        res.status(200).json({ data: user });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error', details: err });
      }
    }
  }
  static async createUser(req, res) {
    const db = getDB();

    const user = await db.collection('users');

    const { userName, accountNumber, emailAddress, identityNumber } = req.body;

    if (!userName || !accountNumber || !emailAddress || !identityNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    try {
      const newUser = {
        userName,
        accountNumber,
        emailAddress,
        identityNumber,
      };
      const result = await user.insertOne(newUser);

      if (result.insertedId) {
        const createdUser = {
          _id: result.insertedId,
          ...newUser,
        };
        return res
          .status(201)
          .json({ message: 'User  created', data: createdUser });
      } else {
        return res.status(500).json({ error: 'Failed to create user' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error', details: err });
    }
  }
  static async updateUserById(req, res) {
    const db = getDB();
    const userId = req.params._id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      });
    }

    const { userName, accountNumber, emailAddress, identityNumber } = req.body;

    //find user by id
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: 'User  Not Found' });
    }

    if (!userName && !accountNumber && !emailAddress && !identityNumber) {
      return res
        .status(400)
        .json({ error: 'At least one field is required for update' });
    }

    try {
      const result = await db
        .collection('users')
        .updateOne({ _id: new ObjectId(userId) }, { $set: req.body });

      res
        .status(200)
        .json({ message: 'User  updated successfully', user: user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error', details: err });
    }
  }

  static async deleteUserById(req, res) {
    const db = getDB();
    const userId = req.params._id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      });
    }

    try {
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return res.status(404).json({ message: 'User  Not Found' });
      }
      const result = await db
        .collection('users')
        .deleteOne({ _id: new ObjectId(userId) });

      res
        .status(200)
        .json({ message: 'User  deleted successfully', user: user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error', details: err });
    }
  }

  static async generateToken(req, res) {
    const db = getDB();
    const { accountNumber, userName } = req.body; // Get accountNumber and userName from the request body

    // Validate input
    if (!accountNumber || !userName) {
      return res
        .status(400)
        .json({ message: 'accountNumber and userName are required' });
    }

    try {
      // Find user by accountNumber and userName
      const user = await db.collection('users').findOne({
        accountNumber: accountNumber,
        userName: userName,
      });

      if (!user) {
        return res.status(404).json({ message: 'User  Not Found' });
      }

      const payload = {
        accountnumber: user.accountNumber,
        username: user.userName,
      };

      const access_token = createToken(payload);

      res.status(200).json({
        message: `Successfully login as ${user.userName}`,
        access_token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error', details: err });
    }
  }
}

module.exports = Controller;
