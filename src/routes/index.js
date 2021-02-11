const express = require("express");
const router = express.Router();

// middleware
const { Authorization } = require("../middlewares/Authorization");

// controller
const { userRegistration, userLogin } = require("../controller/Auth");
const { getUsers, deleteUsers } = require("../controller/Users");
const { getBooks, getBooksDetail, addBooks, editBooks, deleteBooks } = require("../controller/Book");
const { addTransaction, editTransaction, getTransactionDetail, getTransaction } = require("../controller/Transaction");

// router Auth
router.post("/register", userRegistration);
router.post("/login", userLogin);

// router Users
router.get("/users", getUsers);
router.delete("/users/:id", deleteUsers);

// router Book
router.get("/books", getBooks);
router.get("/books/:id", getBooksDetail);
router.post("/books", Authorization, addBooks);
router.put("/books/:id", Authorization, editBooks);
router.delete("/books/:id", Authorization, deleteBooks);

// router Transaction
router.post("/transaction", Authorization, addTransaction);
router.patch("/transaction/:id", Authorization, editTransaction);
router.get("/transaction/:id", Authorization, getTransactionDetail);
router.get("/transaction", Authorization, getTransaction);

module.exports = router;
