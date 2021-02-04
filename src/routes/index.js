const express = require("express");
const router = express.Router();

const {
  getUsers,
  deleteUsers,
} = require("../controller/Users");

router.get("/users", getUsers);
router.delete("/users/:id", deleteUsers);

module.exports = router;