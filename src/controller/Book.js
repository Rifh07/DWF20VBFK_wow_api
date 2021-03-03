const { Book, ListBook } = require("../../models");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// Get All Book
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "Success",
      data: {
        books,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Get Book Detail
exports.getBooksDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!book) {
      return res.send({
        status: "unsuccess",
        message: `Book with id ${id} Not Existed`,
      });
    }
    res.send({
      status: "Success",
      data: {
        book,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Add Book
exports.addBooks = async (req, res) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      publicationDate: Joi.string().required(),
      pages: Joi.string().required(),
      publicationDate: Joi.string().required(),
      author: Joi.string().required(),
      isbn: Joi.string().required(),
      about: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "unsuccess",
        message: error.details[0].message,
      });

      const book = await Book.create({
        ...req.body,
        coverFile: req.files.coverFile[0].filename,
        bookFile: req.files.bookFile[0].filename,
      });

      if (!book)
        return res.status(400).send({
          status: "unsuccess",
          message: "Upload Book Unsuccess",
        });

    const secretKey = "DWF20VBFK_wow";
    const token = jwt.sign(
      {
        id: book.id,
      },
      secretKey
    );

    res.send({
      status: "Success",
      data: {
        book,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Edit Book
exports.editBooks = async (req, res) => {
  try {
    const { id } = req.params;

    const books = await Book.findOne({
      where: {
        id,
      },
    });

    if (!books) {
      return res.send({
        status: "unsuccess",
        message: `Book with id ${id} Not Existed`,
      });
    }

    const schema = Joi.object({
      title: Joi.string().required(),
      publicationDate: Joi.string().required(),
      pages: Joi.number().required(),
      publicationDate: Joi.string().required(),
      author: Joi.string().required(),
      isbn: Joi.number().required(),
      about: Joi.string().required(),
      bookFile: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "unsuccess",
        message: error.details[0].message,
      });

    const book = await Book.update(req.body, {
      where: {
        id,
      },
    });

    const booksUpdated = await Book.findOne({
      where: {
        id,
      },
    });

    const secretKey = "DWF20VBFK_wow";
    const token = jwt.sign(
      {
        id: book.id,
      },
      secretKey
    );

    res.send({
      status: "Success",
      data: {
        booksUpdated,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Delete Book By ID
exports.deleteBooks = async (req, res) => {
  try {
    const { id } = req.params;

    const books = await Book.findOne({
      where: {
        id,
      },
    });

    if (!books) {
      return res.send({
        status: "unsuccess",
        message: `Book with id ${id} Not Existed`,
      });
    }

    await Book.destroy({
      where: {
        id,
      },
    });
    res.send({
      status: "Success",
      data: {
        id: id,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Get List Books
exports.getListBooks = async (req, res) => {
  try {
    const { id } = req.params;

    const books = await ListBook.findAll({
      where: {
        usersId: id,
      },
      include: {
        model: Book,
        as: "books",
        attributes: {
          exclude: ["publicationDate", "pages", "isbn", "about", "bookFile", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["id", "usersId", "BookId", "UserId", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Success",
      data: {
        books
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Server Error",
    });
  }
}

// Add List Book
exports.addListBooks = async (req, res) => {
  try {
    const schema = Joi.object({
      usersId: Joi.number().required(),
      booksId: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "unsuccess",
        message: error.details[0].message,
      });

    const { usersId, booksId} = req.body;
    const book = await ListBook.findOne({
      where: {
        usersId,
        booksId,
      },
      attributes: {
        exclude: ["BookId", "UserId"],
      },
    });

    if (book)
      return res.send({
        status: "unsuccess",
        message: "The book is already on the list",
      });

      const addList = await ListBook.create({
        ...req.body,
        usersId,
        booksId,
      });

      if (!addList)
        return res.send({
          status: "unsuccess",
          message: "Add List Book Unsuccess",
        });

    res.send({
      status: "Success",
      data: {
        addList,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Server Error",
    });
  }
};