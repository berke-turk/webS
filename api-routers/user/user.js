const express = require("express");
const User = require("../../services/user");
const router = express.Router();

router.route("/").get(User.a).post(User.createTodo);

router
    .route("/:id")
    .get(User.getTodo)
    .put(User.updateTodo)
    .delete(User.deleteTodo);
module.exports = router;