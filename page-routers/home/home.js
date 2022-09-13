const express = require('express');
const router = express.Router();
require('dotenv').config();
const funcs = require('../../functions/functions');
var db = require('../../my_modules/db');
var path = require('path'),
    __parentDir = path.dirname(process.mainModule.filename);

// Get
router.get('/', (request, response) => {
    response.status(200).json({ success: true, parent: __parentDir, dirname: __dirname });
});

module.exports = router;