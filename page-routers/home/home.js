const express = require('express');
const router = express.Router();
require('dotenv').config();
const funcs = require('../../functions/functions');
var db = require('../../db/db');
var path = require('path'),
    __parentDir = path.dirname(process.mainModule.filename);

// Get
router.get('/', (request, response) => {
    response.status(200).json({ success: true });
});

module.exports = router;