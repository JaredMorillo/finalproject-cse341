const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');

let database;

const initDb = (callback) => {
    if (database) {
        console.log('Database is already initialized');
        return callback(null, database);
    }

    MongoClient.connect(process.env.MONGODB_URL, process.env.MONGODB_URL_B)
        .then((client) => {
            database = client.db(); // Guardamos la base de datos directamente
            console.log('Database initialized');
            callback(null, database);
        })
        .catch((err) => {
            callback(err);
        });
};

const getDatabase = () => {
    if (!database) {
        throw new Error('Database not initialized');
    }
    return database;
};

module.exports = { initDb, getDatabase };
