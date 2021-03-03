const express = require("express");
const router = express.Router();

// middleware
const { Authorization } = require("../middlewares/Authorization");
const { uploadBook } = require("../middlewares/UploadBook");
const { uploadTransaction } = require("../middlewares/UploadTransaction");

// controller
const { userRegistration, userLogin, checkAuth } = require("../controller/Auth");
const { getUsers, editUsers } = require("../controller/Users");
const { getBooks, getBooksDetail, addBooks, editBooks, deleteBooks, getListBooks, addListBooks } = require("../controller/Book");
const { addTransaction, editTransaction, getTransactionDetail, getTransaction, getTransactionByIdUserDesc } = require("../controller/Transaction");

// router Auth
router.post("/register", userRegistration);
router.post("/login", userLogin);
router.get("/check-auth", Authorization, checkAuth);

// router Users
router.get("/users", getUsers);
router.put("/users/:id", Authorization, editUsers);

// router Book
router.get("/books", getBooks);
router.get("/books/list/:id", getListBooks);
router.post("/books/list", Authorization, addListBooks);
router.get("/books/:id", getBooksDetail);
router.post("/books", Authorization, uploadBook("coverFile", "bookFile"), addBooks);
router.put("/books/:id", Authorization, editBooks);
router.delete("/books/:id", Authorization, deleteBooks);

// router Transaction
router.post("/transaction", Authorization, uploadTransaction("transferProof"), addTransaction);
router.patch("/transaction/:id", Authorization, editTransaction);
router.get("/transaction/:id", getTransactionDetail);
router.get("/transaction/user/:id", getTransactionByIdUserDesc);
router.get("/transaction", Authorization, getTransaction);

module.exports = router;
