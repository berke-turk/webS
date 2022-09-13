const db = require('../db/db');

class Database {
    dbConnection(callback) {
        db.pool.getConnection().then(async(con) => {
            callback(con);
        });
    }
}

module.exports = new Database();