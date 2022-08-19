const express = require('express');
const db = require("../my_modules/db");
const userModel = require("../models/user");

exports.getWithID = async function(req, res, next) {
    // For pool initialization, see above
    db.pool.getConnection().then(async(con) => {
        let [
            [user], queryInfo
        ] = await con.execute(`SELECT * FROM user WHERE id = ?`, [req.params.id]);

        // Model === Qualify
        console.log(userModel.newUserView(user).serialize());

        // Response
        res.status(200).json(userModel.newUserView(user).json());

        // Release connect 
        con.release();
    })
}

module.exports;