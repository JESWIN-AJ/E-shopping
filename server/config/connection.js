const collection = require('./colletions');
const MongoClient = require('mongodb').MongoClient;

const state = {
    db: null
};

module.exports.connect = function (done) {
    const url = process.env.MONGODB_URI; // ✅ updated to use localhost and default port
    const dbname = process.env.DB_NAME;

    MongoClient.connect(url)
        .then(async (client) => {
            state.db = client.db(dbname);

            await state.db
                .collection(collection.USER_COLLECTION)
                .createIndex(
                    { email: 1 },
                    { unique: true }
                );

            await state.db
                .collection(collection.ADMIN_COLLECTION)
                .createIndex(
                    { email: 1 },
                    { unique: true }
                );

            done();
        })

        .catch((err) => {
            done(err);
        });
};

module.exports.get = function () {
    return state.db;
};