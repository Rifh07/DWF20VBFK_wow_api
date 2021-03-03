const { User } = require("../../models");
const Joi = require("joi");

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "Success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Edit Users By ID
exports.editUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!users) {
      return res.send({
        status: "unsuccess",
        message: `User with id ${id} Not Existed`,
      });
    }

    const schema = Joi.object({
      fullName: Joi.string().required(),
      gender: Joi.string().required(),
      phone: Joi.number().required(),
      address: Joi.string().required(),
    });
    
    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "unsuccess",
        message: error.details[0].message,
      });

    await User.update(req.body, {
      where: {
        id,
      },
    });

    const user = await User.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};