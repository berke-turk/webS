const express = require('express');
const router = express.Router();
require('dotenv').config();
const funcs = require('../../functions/functions');
var db = require('../../my_modules/db');

// Check Version
router.post('/user/check/version', (request, response) => {
    let body = request.body;
    if (body.version != null) {
        body.version = parseFloat(body.version);
        if (isNaN(body.version)) return;

        db.query(`SELECT min,max FROM version WHERE app_name = 'user'`, (err, result) => {
            if (err || result[0] == null) { response.status(400).json({ success: true }); return; }

            let app_version = result[0];

            if (body.version >= parseFloat(app_version.min) && body.version <= parseFloat(app_version.max))
                response.status(200).json({ success: true });
            else
                response.status(200).json({ success: false, app_user_version: app_version.max });
        });
    }
});

// Check Version
router.post('/restaurant/check/version', (request, response) => {
    let body = request.body;
    if (body.version != null) {
        body.version = parseFloat(body.version);
        if (isNaN(body.version)) return;

        db.query(`SELECT min,max FROM version WHERE app_name = 'restaurant'`, (err, result) => {
            if (err || result[0] == null) { response.status(400).json({ success: true }); return; }

            let app_version = result[0];

            if (body.version >= parseFloat(app_version.min) && body.version <= parseFloat(app_version.max))
                response.status(200).json({ success: true });
            else
                response.status(200).json({ success: false, app_restaurant_version: app_version.max });
        });
    }
});

// Version Update
router.get('/update/restaurant/max/:max_version/min/:min_version', (request, response) => {
    let max_version = request.params.max_version;
    let min_version = request.params.min_version;
    if (max_version != null || min_version != null) {
        max_version = parseFloat(max_version);
        min_version = parseFloat(min_version);
        if (isNaN(max_version) || isNaN(min_version)) { response.status(400).json({ success: true }); return; }

        db.query(`UPDATE version SET max=${max_version},min=${min_version} WHERE app_name = 'restaurant'`, (err) => {});
        response.status(200).json({ success: true, max_version: max_version, min_version: min_version });
    }
});

// Version Update
router.get('/update/user/max/:max_version/min/:min_version', (request, response) => {
    let max_version = request.params.max_version;
    let min_version = request.params.min_version;
    if (max_version != null || min_version != null) {
        max_version = parseFloat(max_version);
        min_version = parseFloat(min_version);
        if (isNaN(max_version) || isNaN(min_version)) { response.status(400).json({ success: true }); return; }

        db.query(`UPDATE version SET max=${max_version},min=${min_version} WHERE app_name = 'user'`, (err) => {});
        response.status(200).json({ success: true, max_version: max_version, min_version: min_version });
    }
});

// Info Server
router.get('/server', (request, response) => {
    response.status(200).json({ success: true, serverPort: funcs.port, systemTime: Date.now() });
});

// 
router.get('/send-mail/:email', (request, response) => {
    try {
        let mailOptions = {
            from: 'destek@yemekall.net',
            to: request.params.email,
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };

        funcs.destek_mail().sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                response.status(200).json({ success: true });
            }
        });
    } catch (error) {
        console.log("asd");
    }
});

module.exports = router;