const db = require('../config/connection');
const collection = require('../config/colletions');
const bcrypt = require('bcrypt');
const { createAdminToken, deleteAdminToken, getAdminByToken } = require('../middleware/adminTokenAuth');


module.exports = {
 

  doLogin: (req, res) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, password } = req.body;
        const admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email });
        if (!admin) return resolve({ status: false, error: 'Invalid email or password' });

        const match = await bcrypt.compare(password, admin.password);
        if (!match) return resolve({ status: false, error: 'Invalid email or password' });

        const adminData = { _id: admin._id, email: admin.email, isAdmin: true };
        const token = await createAdminToken(adminData);

        resolve({ status: true, admin: adminData, token });
      } catch (err) {
        reject(err);
      }
    });
  },

  doLogout: (req, res) => {
    return new Promise(async (resolve) => {
      await deleteAdminToken(req.adminToken);
      resolve({ status: true });
    });
  },

  getMe: (req) => {
    return new Promise((resolve) => {
      if (req.admin) {
        resolve({ status: true, admin: req.admin });
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