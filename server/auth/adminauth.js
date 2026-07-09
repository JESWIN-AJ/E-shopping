var db = require('../config/connection')
var collection = require('../config/colletions')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  doLogin: (adminData) => {
    return new Promise(async (resolve, reject) => {
      try {
        let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email })
        if (!admin) return resolve({ status: false, error: 'Invalid email or password' })

        const match = await bcrypt.compare(adminData.password, admin.password)
        if (!match) return resolve({ status: false, error: 'Invalid email or password' })

        const token = jwt.sign(
          { _id: admin._id, email: admin.email, isAdmin: true },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        )
        resolve({ status: true, token, admin })
      } catch (err) {
        reject(err)
      }
    })
  },


  addAdmin: (adminData) => {
    return new Promise(async (resolve, reject) => {
      try {
        adminData.password = await bcrypt.hash(adminData.password, 10)
        const data = await db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData)
        const token = jwt.sign(
          { _id: data.insertedId, email: adminData.email, isAdmin: true },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        )
        resolve({ status: true, token, admin: { ...adminData, _id: data.insertedId } })
      } catch (err) {
        reject(err)
      }
    })
  },

  
  getAllUsers: () => {
    return db.get().collection(collection.USER_COLLECTION).find().toArray()
  },
  getAllAdmins: () => {
    return db.get().collection(collection.ADMIN_COLLECTION).find().toArray()
  }
}