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
        message: `Email already exsited`,
      });

    const hashedStrength = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, hashedStrength);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
      role: "users",
      profile: null,
    });

    const secretKey = "DWF20VBFK_wow";
    const token = jwt.sign(
      {
        id: User.id,
      },
      secretKey
    );

    const email = req.body.email;

    res.send({
      status: "Success",
      data: {
        user: {
          email,
          token,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

