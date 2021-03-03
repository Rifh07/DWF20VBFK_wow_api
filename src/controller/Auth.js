const { User } = require("../../models");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// User Registration
exports.userRegistration = async (req, res) => {
  try {
    const schema = Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      phone: Joi.number().required(),
      gender: Joi.string().required(),
      address: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        message: error.details[0].message,
      });

    const checkEmail = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (checkEmail)
      return res.status(400).send({
        status: "unsuccess",
        message: `Email already exists`,
      });

    const hashedStrength = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, hashedStrength);

    const user_create = await User.create({
      ...req.body,
      password: hashedPassword,
      role: "users",
      profile: null,
    });

    const secretKey = "DWF20VBFK_wow";
    const token = jwt.sign(
      {
        id: user_create.id,
      },
      secretKey
    );

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
        status: "success",
        data: {
          user,
          token
        },
      });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// User Login
exports.userLogin = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        message: error.details[0].message,
      });

    const user_find = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user_find)
      return res.status(400).send({
        status: "unsuccess",
        message: "Your Credentials is not valid",
      });

    const validPass = await bcrypt.compare(req.body.password, user_find.password);

    if (!validPass)
      return res.status(400).send({
        status: "unsuccess",
        message: "Your Credentials is not valid",
      });

    const secretKey = "DWF20VBFK_wow";
    const token = jwt.sign(
      {
        id: user_find.id,
      },
      secretKey
    );

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
        status: "success",
        data: {
          user,
          token
        },
      });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      message: "User Valid",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "Server Error",
    });
  }
};