
const MongoClient = require('mongodb').MongoClient;

const state = {
    db: null
};

module.exports.connect = function(done) {
    const url = process.env.DB_COLLECTION; // ✅ updated to use localhost and default port
    const dbname = process.env.DB_NAME;

    MongoClient.connect(url)
        .then((client) => {
            state.db = client.db(dbname);
            done();
        })
        .catch((err) => {
            done(err);
        });
};

module.exports.get = function() {
    return state.db;
};