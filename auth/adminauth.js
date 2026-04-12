var db = require('../config/connection')
var collection = require('../config/colletions')
const bcrypt = require('bcrypt')
const { get } = require('../app')


module.exports = {


    doLogin: (adminData) => {


        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email })
            if (admin) {
                bcrypt.compare(adminData.password, admin.password).then((status) => {
                    if (status) {
                        console.log("Login success");
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("wrong password, failed");
                        resolve({ status: false })
                    }
                })

            }else {
                console.log("Login failed")
                resolve({ status: false })
            }   
        })
    },
    

        addAdmin: (adminData) => {
            return new Promise(async (resolve, reject) => {
                adminData.password = await bcrypt.hash(adminData.password, 10)
                console.log(adminData)
                db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data) => {
                    let response = {}
                    response.admin = adminData
                    response.status = true
                    resolve(response)
                }).catch((err) => {
                    reject(err)
                })
            })
        },


        getAllUsers:() => {
            return new Promise(async (resolve,reject) =>{
                let User= db.get().collection(collection.USER_COLLECTION).find().toArray();
                resolve(User)
            })


        },
        getAllAdmins:() => {
            return new Promise(async (resolve,reject) =>{
                let Admin= db.get().collection(collection.ADMIN_COLLECTION).find().toArray();
                resolve(Admin)
            })
        }







}