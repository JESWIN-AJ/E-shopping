const db = require('../config/connection');
const collection = require('../config/colletions');
const bcrypt = require('bcrypt');

module.exports = {
  doLogin: (req, res) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, password } = req.body;
        const admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email });
        if (!admin) return resolve({ status: false, error: 'Invalid email or password' });

        const match = await bcrypt.compare(password, admin.password);
        if (!match) return resolve({ status: false, error: 'Invalid email or password' });

        req.session.admin = { _id: admin._id, email: admin.email, isAdmin: true };
        req.session.save((err) => {
          if (err) return resolve({ status: false, error: 'Session save failed' });
          resolve({ status: true, admin: req.session.admin });
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
      if (req.session.admin) {
        resolve({ status: true, admin: req.session.admin });
      } else {
        resolve({ status: false, error: 'Not authenticated' });
      }
    });
  },

  addAdmin: (adminData) => {
    return new Promise(async (resolve, reject) => {
      try {
        adminData.password = await bcrypt.hash(adminData.password, 10);
        const data = await db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData);
        resolve({ status: true, admin: { ...adminData, _id: data.insertedId } });
      } catch (err) {
        reject(err);
      }
    });
  },

  getAllUsers: () => {
    const db = require('../config/connection');
    const collection = require('../config/colletions');
    return db.get().collection(collection.USER_COLLECTION).find().toArray();
  },
  getAllAdmins: () => {
    const db = require('../config/connection');
    const collection = require('../config/colletions');
    return db.get().collection(collection.ADMIN_COLLECTION).find().toArray();
  },
};