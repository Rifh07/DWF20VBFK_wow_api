const { Book } = require("../../models");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// Get All Book
exports.getBooks = async (req, res) => {
  try {
    const book = await Book.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "Success",
      data: {
        book,
      },
    });
  } catch (error) {
    console.log(error);
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
    res.send({
      status: "Success",
      data: {
        book,
      },
    });
  } catch (error) {
    console.log(error);
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
        message: error.details[0].message,
      });

    const book = await Book.create(req.body);

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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    res.status(500).send({
      status: "Server Error",
    });
  }
};
