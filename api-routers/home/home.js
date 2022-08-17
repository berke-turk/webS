const express = require('express');
const router = express.Router();
var path = require('path'),
    __parentDir = path.dirname(process.mainModule.filename);
var db = require('../../my_modules/db');
const funcs = require('../../functions/functions');
const DataTypes = require('../../models/dataTypes');
const fs = require('fs');
const md5 = require('md5');
const passwordHash = require('password-hash');


module.exports = router;