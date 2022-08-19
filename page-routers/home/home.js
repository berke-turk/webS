const express = require('express');
const router = express.Router();
require('dotenv').config();
const funcs = require('../../functions/functions');
var db = require('../../my_modules/db');

// Get
router.get('/', (request, response) => {
    response.status(200).json({ success: true });
});

module.exports = router;