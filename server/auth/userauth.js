var db = require('../config/connection')
var collection = require('../config/colletions')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        userData.password = await bcrypt.hash(userData.password, 10)
        const data = await db.get().collection(collection.USER_COLLECTION).insertOne(userData)
        const token = jwt.sign(
          { _id: data.insertedId, email: userData.email, name: userData.name },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        )
        resolve({ status: true, token, user: { ...userData, _id: data.insertedId } })
      } catch (err) {
        reject(err)
      }
    })
  },
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
        if (!user) return resolve({ status: false, error: 'Invalid email or password' })

        const match = await bcrypt.compare(userData.password, user.password)
        if (!match) return resolve({ status: false, error: 'Invalid email or password' })

        const token = jwt.sign(
          { _id: user._id, email: user.email, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        )
        resolve({ status: true, token, user })
      } catch (err) {
        reject(err)
      }
    })
  }
}