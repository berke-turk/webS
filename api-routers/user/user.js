const express = require("express");
const User = require("../../services/user");
const router = express.Router();

//router.route("/").get(User.getWithID).post(User.getWithID);
router
    .route("/:userID")
    .get(User.loadID, User.getWithID)
    .put(User.authorization, User.putWithID);
router
    .route('/isActive/')
    .put(User.authorization, User.updateIsActive);
module.exports = router;