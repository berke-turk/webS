const express = require("express");
const User = require("../../services/user");
const router = express.Router();

router.route("/").get(User.getWithID).post(User.getWithID);

router
    .route("/:id")
    .get(User.getWithID)
    .put(User.getWithID)
    .delete(User.getWithID);
module.exports = router;