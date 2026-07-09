var db = require('../config/connection')
var collection = require('../config/colletions')
const { ObjectId } = require('mongodb')

const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = {
    addToCart: (proId, userId) => {
        let proObj = {
            item: new ObjectId(proId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            try {
                let userCart = await db.get().collection(collection.CART_COLLECTION)
                    .findOne({ user: new ObjectId(userId) })

                if (userCart) {
                    let proExist = userCart.products.findIndex(product => product.item.toString() === proId)
                    console.log(proExist)
                    if (proExist != -1) {
                        await db.get().collection(collection.CART_COLLECTION)
                            .updateOne(
                                { user: new ObjectId(userId), 'products.item': new ObjectId(proId) },
                                { $inc: { 'products.$.quantity': 1 } }
                            ).then(() => {
                                resolve()
                            })
                    }

                    else {
                        await db.get().collection(collection.CART_COLLECTION)
                            .updateOne(
                                { user: new ObjectId(userId) },
                                { $push: { products: proObj } }
                            )
                        resolve()
                    }
                } else {
                    // No cart yet — create one
                    let cartObj = {
                        user: new ObjectId(userId),
                        products: [proObj]
                    }
                    await db.get().collection(collection.CART_COLLECTION).insertOne(cartObj)
                    resolve()
                }
            } catch (err) {
                reject(err)
            }
        })
    },
    getCartProducts: (userId) => {

        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    // ✅ Stage 1 — just unwrap product array to object
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    // ✅ Stage 2 — now product is object, so product.price works
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: 1,
                        total: {
                            $multiply: ['$quantity', { $toDouble: '$product.price' }]
                        }
                    }
                }
            ]).toArray()

            let grandTotal = cartItems.reduce((acc, item) => acc + item.total, 0)


            resolve({ cartItems, grandTotal })
        })



    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: new ObjectId(userId) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },

    changeProductQuantity: (details) => {
        count = parseInt(details.count)
        console.log('in  process')
        return new Promise(async (resolve, reject) => {

            await db.get().collection(collection.CART_COLLECTION)
                .updateOne(
                    { _id: new ObjectId(details.cart), 'products.item': new ObjectId(details.product) },
                    { $inc: { 'products.$.quantity': count } }
                ).then((response) => {
                    resolve(response)
                })

        })
    },
    removeFromCart: (details) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.CART_COLLECTION)
                .updateOne(
                    { _id: new ObjectId(details.cart) },
                    { $pull: { products: { item: new ObjectId(details.product) } } }
                ).then((response) => {
                    resolve(response)
                });
        });
    },
    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {

                    $match: { user: new ObjectId(userId) }


                }, {

                    $unwind: '$products'
                }, {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }

                }, {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                }, {
                    $project: {
                        item: 1, quantity: 1, product: 1, price: { $toDouble: '$product.price' },
                        total: { $multiply: ['$quantity', { $toDouble: '$product.price' }] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        grandtotal: { $sum: '$total' }    // ✅ sum of all totals
                        // items: {
                        //     $push: {  
                        //         price: '$price',
                        //         quantity: '$quantity',
                        //         total: '$total'
                        //     }
                        // }
                    }
                }

            ]).toArray()


            resolve(total[0].grandtotal)

        })

    },

    placeOrder: (order, products, total) => {
        return new Promise((resolve, reject) => {
            // console.log(order, products, total);
            let status = order.payment === 'cod' ? 'placed' : 'pending'
            let orderObj = {
                deliveryDetails: {
                    mobile: order.mobile,
                    pincode: order.pincode,
                    address: order.address
                },
                userId: new ObjectId(order.userId),
                paymentmethod: order.payment,
                products: products,
                totalAmount: total,
                status: status,
                Date: new Date()

            }
            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
                db.get().collection(collection.CART_COLLECTION).deleteOne({ user: new ObjectId(order.userId) })
                resolve(response.insertedId)
            })
        })


    },

getCartProlist: (userId) => {
    return new Promise(async (resolve, reject) => {
        let cart = await db.get().collection(collection.CART_COLLECTION).aggregate([
            { $match: { user: new ObjectId(userId) } },
            { $unwind: '$products' },
            { $project: { item: '$products.item', quantity: '$products.quantity' } },
            {
                $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    localField: 'item',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $project: { item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] } } },
            {
                $project: {
                    item: 1,
                    name: '$product.name',
                    quantity: 1,
                    price: { $toDouble: '$product.price' },                              // ✅ unit price
                    total: { $multiply: ['$quantity', { $toDouble: '$product.price' }] } // ✅ item total
                }
            }
        ]).toArray()

        resolve(cart)
    })
},

    getUserOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({ userId: new ObjectId(userId) }).toArray()
            resolve(orders)
        })
    },

    genraterazorpay: (orderId,totalpay) => {
        return new Promise((resolve, reject) => {
           var option = {
            amount:totalpay*100,
            currency:"INR",
            receipt:orderId.toString(orderId)
           };
           instance.orders.create(option,function(err,order){
            if(err){
                console.log(err);
                reject(err)
                
            }else{
                console.log('New Order:',order);
                resolve(order)
            }   
           });


        })
    },
     
    
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            const crypto = require('crypto');
            const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);            hmac.update(details["razorpay_order_id"] + '|' + details["razorpay_payment_id"]);
            hmac = hmac.digest('hex');
            if (hmac === details["razorpay_signature"]) {
                resolve()
            }   else {  
                reject()
            }
        })
    },

    changePaymentStatus: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION)
                .updateOne(
                    { _id: new ObjectId(orderId) },
                    { $set: { status: 'placed' } }
                ).then(() => {
                    resolve()
                })  
        })
    }






}
