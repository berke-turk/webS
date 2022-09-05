const express = require('express');
const db = require("../my_modules/db");
const userModel = require("../models/user");
const functions = require("../functions/functions");

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

exports.putWithID = async function(req, res, next) {
    // For pool initialization, see above
    db.pool.getConnection().then(async(con) => {
        let [
            [result], queryInfo
        ] = await con.execute(`SELECT * FROM user WHERE id = ?`, [req.params.id]);

        // Model === Qualify
        let user = userModel.newUserView(result);

        // Response
        res.status(200).json(userModel.newUserView(user).json());

        // Release connect 
        con.release();
    })
}

exports.updateIsActive = async function(req, res, next) {
    if (!req.body.isActive) {
        res.status(200).json({ success: false });
        return;
    }

    let isActive = !!req.body.isActive;

    // Authorization for User
    functions.AuthorizationForUserAndPool(req, res, async(con, user) => {
        con.execute(`UPDATE user SET isActive = ? WHERE id = ?`, [isActive, user.id]);

        // Response
        res.status(200).json({ success: true, userID: user.id, isActive: isActive });

        // Release connect 
        con.release();
    });
    //
}

module.exports;