const express = require("express");
const router = express.Router();


const {
  getUsers,
  deleteUsers,
} = require("../controller/Users");
const {
    getBooks,
    getBooksDetail,
    addBooks,
    editBooks,
    deleteBooks,
  } = require("../controller/Book");
const { Authorization } = require("../middlewares/Authorization");

router.get("/users", getUsers);
router.delete("/users/:id", deleteUsers);

router.get("/books", getBooks);
router.get("/books/:id", getBooksDetail);
router.post("/books", Authorization, addBooks);
router.put("/books/:id", Authorization, editBooks);
router.delete("/books/:id", Authorization, deleteBooks);

module.exports = router;