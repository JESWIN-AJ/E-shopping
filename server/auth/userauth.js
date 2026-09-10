const db = require('../config/connection');
const collection = require('../config/colletions');
const bcrypt = require('bcrypt');

module.exports = {
  doLogin: (req, res) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, password } = req.body;
        const user = await db.get().collection(collection.USER_COLLECTION).findOne({ email });
        if (!user) return resolve({ status: false, error: 'Invalid email or password' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return resolve({ status: false, error: 'Invalid email or password' });

        req.session.user = { _id: user._id, email: user.email, name: user.name };
        req.session.save((err) => {
          if (err) return resolve({ status: false, error: 'Session save failed' });
          resolve({ status: true, user: req.session.user });
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  doSignup: (req, res) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { firstname, lastname, email, phone, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const result = await db.get().collection(collection.USER_COLLECTION).insertOne({
          firstname, lastname, email, phone, password: hashed
        });
        req.session.user = { _id: result.insertedId, email, name: firstname };
        req.session.save((err) => {
          if (err) return resolve({ status: false, error: 'Session save failed' });
          resolve({ status: true, user: req.session.user });
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  doLogout: (req, res) => {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie('sid', { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
        res.clearCookie('csrf-token', { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
        resolve({ status: true });
      });
    });
  },

  getMe: (req) => {
    return new Promise((resolve) => {
      if (req.session.user) {
        resolve({ status: true, user: req.session.user });
      } else {
        resolve({ status: false, error: 'Not authenticated' });
      }
    });
  },

   
  
};