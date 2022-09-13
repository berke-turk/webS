const express = require('express');
const userModel = require("../models/user");
const functions = require("../functions/functions");

exports.loadID = async function(req, res, next) {
    let id = undefined;
    if (req.params.userID) {
        // Params Check
        if (req.params.userID) {
            id = parseInt(req.params.userID);
        } else {
            next();
            return;
        }
    } else {
        // Body Check
        if (req.body.userID) {
            id = parseInt(req.body.userID);
        } else {
            next();
            return;
        }
    }

    isNaN(id) ? next() :
        functions.dbConnection(async(con) => {
            let [
                [result], // queryInfo
            ] = await con.execute("SELECT id FROM user WHERE id = ?", [id]).catch((err) => {
                res.status(200).json({ success: false, message: "error" });

                // Release connect 
                con.release();
            });

            if (!result) {
                next(new Error("Couldn't find user: " + id));
                // res.status(200).json({ success: false, message: "result is null" });

                // Release connect 
                con.release();
                return;
            }

            req.user = userModel.newUserID(id);

            req.db = { con: con };
            next();
        });
};

exports.authorization = async function(req, res, next) {
    if (req.headers['authorization'] == null) { res.status(500).json(); return; }
    let authorization = req.headers['authorization'].split(' ');
    if (authorization[0] != "Bearer" || authorization[1] == null) { res.status(500).json(); return; }

    dbConnection(async(con) => {
        let [
            [result], // queryInfo
        ] = await con.execute("SELECT id FROM user WHERE token = ?", [authorization[1]]).catch((err) => {
            res.status(200).json({ success: false, message: "error" });

            // Release connect 
            con.release();
        });

        if (!result) {
            next(new Error("Failed to User Authorization"));
            // res.status(200).json({ success: false, message: "result is null" });

            // Release connect 
            con.release();
            return;
        }

        req.user = userModel.newUserID({ id: result.id });

        req.db.con = con;
        next();
    });
}

exports.getWithID = async function(req, res, next) {
    let loadUser = userModel.newUserID(req.user.id); // loadID data

    // For pool initialization, see above
    functions.dbConnection(async(con) => {
        let [
            [user], queryInfo
        ] = await con.execute(`SELECT * FROM user WHERE id = ?`, [loadUser.id]);

        // Response
        res.status(200).json({ success: true, user: userModel.newUserView(user).json() });

        // Release connect 
        con.release();
    })
}

exports.putWithID = async function(req, res, next) {
    let loadUser = userModel.newUserID(req.user); // loadID data

    // For pool initialization, see above
    functions.dbConnection(async(con) => {
        let [
            [result], queryInfo
        ] = await con.execute(`SELECT * FROM user WHERE id = ?`, [loadUser.id]);

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