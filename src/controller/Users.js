const { User } = require("../../models");

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password", "token", "createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "Success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.log(err);
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Delete Users By ID
exports.deleteUsers = async (req, res) => {
    try {
      const { id } = req.params;
  
      const users = await User.destroy({
        where: {
          id,
        },
        attributes: {
            exclude: ["fullName","password", "token", "createdAt", "updatedAt"],
          },
      });
      res.send({
        status: "Success",
        data: {
          id: id,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "Server Error",
      });
    }
  };
