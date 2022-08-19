var mysql = require('mysql2/promise');
const bluebird = require('bluebird');
require('dotenv').config();

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PWD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


module.exports.pool = pool;


async function connect() {
    connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PWD,
        database: process.env.DATABASE_NAME,
        dateStrings: 'date',
        multipleStatements: true
    });

    connection.connect((err) => {
        if (err) {
            console.log("Hata var, tekrar deneniyor...");
            connect();
            return;
        };

        connection.on('error', function(err) {
            console.log('db error', err);
            console.log("Hata var, tekrar deneniyor...");
            try {
                connection.end();
                connection.destroy();
            } catch (error) {

            }
            connect();
        });

        console.log("Is connected to database");
    });
}

connect();