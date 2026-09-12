const db = require('../config/connection');
const collection = require('../config/colletions');
const bcrypt = require('bcrypt');

module.exports = {
 doLogin: (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = req.body;

      const admin = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ email });

      if (!admin) {
        return resolve({
          status: false,
          error: 'Invalid email or password'
        });
      }

      const match = await bcrypt.compare(password, admin.password);

      if (!match) {
        return resolve({
          status: false,
          error: 'Invalid email or password'
        });
      }

      // Regenerate session after successful login
      req.session.regenerate((err) => {
        if (err) {
          console.error('Admin session regeneration failed:', err);

          return resolve({
            status: false,
            error: 'Login failed'
          });
        }

        // Create new authenticated admin session
        req.session.admin = {
          _id: admin._id,
          email: admin.email,
          isAdmin: true
        };

        req.session.save((err) => {
          if (err) {
            console.error('Admin session save failed:', err);

            return resolve({
              status: false,
              error: 'Session save failed'
            });
          }

          resolve({
            status: true,
            admin: req.session.admin
          });
        });
      });
    } catch (err) {
      console.error('Admin login error:', err);
      reject(err);
    }
  });
},

 doLogout: (req, res) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Admin session destruction failed:', err);
        return reject(err);
      }

      res.clearCookie('sid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
      });

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
      const { email, password } = adminData;

      const hashedPassword = await bcrypt.hash(password, 10);

      const data = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .insertOne({
          email,
          password: hashedPassword
        });

      resolve({
        status: true,
        admin: {
          _id: data.insertedId,
          email,
          isAdmin: true
        }
      });
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