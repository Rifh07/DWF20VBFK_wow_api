const { User, Transaction } = require("../../models");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// Add Transaction
exports.addTransaction = async (req, res) => {
  try {
    const schema = Joi.object({
      userId: Joi.number().required(),
      transferProof: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "unsuccess",
        message: error.details[0].message,
      });


    const user = await User.findOne({
      where: {
        id: req.body.userId,
      },
      attributes: {
        exclude: ["email", "token", "password", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
        return res.send({
          status: "unsuccess",
          message: `User with id ${req.body.userId} Not Existed`,
        });
      }

      const transaction = await Transaction.create({
        usersId: req.body.userId,
        transferProof: req.body.transferProof,
        remainingActive: 30,
        userStatus: "Active",
        paymentStatus: "Approved",
      });

    const secretKey = "DWF20VBFK_wow";
    const token = jwt.sign(
      {
        id: transaction.id,
      },
      secretKey
    );
    res.send({
      status: "Success",
      data: {
        user,
        transaction
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Edit Transaction
exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId"],
      },
    });

    if (!transaction) {
      return res.send({
        status: "unsuccess",
        message: `Transaction with id ${id} Not Existed`,
      });
    }

    const schema = Joi.object({
      paymentStatus: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "unsuccess",
        message: error.details[0].message,
      });

    const transactionupdate = await Transaction.update(req.body, {
      where: {
        id,
      },
    });

    const transactions = await Transaction.findOne({
      where: {
        id,
      },
      include: {
        model: User,
        as: "users",
        attributes: {
          exclude: ["email", "token", "password", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId"],
      },
    });

    const secretKey = "DWF20VBFK_wow";
    const token = jwt.sign(
      {
        id: transactionupdate.id,
      },
      secretKey
    );

    res.send({
      status: "Success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Get Transaction Detail
exports.getTransactionDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: {
        id,
      },
      include: {
        model: User,
        as: "users",
        attributes: {
          exclude: ["email", "token", "password", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId"],
      },
    });

    if (!transaction) {
      return res.send({
        status: "unsuccess",
        message: `Transaction with id ${id} Not Existed`,
      });
    }
    res.send({
      status: "Success",
      data: {
        transaction,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Get All Transaction
exports.getTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: {
        model: User,
        as: "users",
        attributes: {
          exclude: ["email", "token", "password", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId"],
      },
    });

    if (!transactions) {
      return res.send({
        status: "unsuccess",
        message: "Transactions Not Existed",
      });
    }

    res.send({
      status: "Success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};