var db = require('../config/connection')
var collection = require('../config/colletions')
var objectId = require('mongodb').ObjectId

module.exports = {
    addProduct: (product) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product)
                .then((data) => {
                    console.log(data, data.insertedId);
                    resolve(data.insertedId);
                })
                .catch((err) => reject(err));
        });
    },
    getAllproducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
            // const plainproducts = JSON.parse(JSON.stringify(products));
            resolve(products);

        })

    },
    deleteproduct: (proid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: new objectId(proid) }).then((response) => {
                // console.log(response);
                resolve(response);
            });
        });
    },
    getProductDetails: (proid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: new objectId(proid) }).then((product) => {
                resolve(product);
            });
        });
    },
    updateProduct: ((proid, productDetails) => {
        return new Promise((resolve, reject) => {
            const updateFields = {};
            if (productDetails.name) updateFields.name = productDetails.name;
            if (productDetails.category) updateFields.category = productDetails.category;
            if (productDetails.price) updateFields.price = productDetails.price;
            if (productDetails.description) updateFields.description = productDetails.description;
            if (productDetails.image) updateFields.image = productDetails.image;

            db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                { _id: new objectId(proid) },
                { $set: updateFields }
            ).then(() => resolve());
        });
    }),

    updateProductImage: (proId, url) => {
        return db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({ _id: new objectId(proId) }, { $set: { image: url } });
    },

    getAllOrders: () => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find().toArray();
            resolve(orders);
        });
    },

    shipOrder: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).updateOne(
                { _id: new objectId(orderId) },
                { $set: { status: 'shipped' } }
            ).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }
}