var db = require('../config/connection')
var collection = require('../config/colletions')
const bcrypt = require('bcrypt')

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            console.log(userData)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                let response = {}
                
                response.user = userData

                response.status = true
                resolve(response)
            }).catch((err) => {
                reject(err)
            })
        })



    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("Login success");
                        response.user = user
                        response.status = true
                        resolve(response)

                    } else {
                        console.log("wrong password, failed");
                        resolve({ status: false })
                    }
                })


            } else {
                console.log("Login failed")
                resolve({ status: false })
            }
        })

    }
}