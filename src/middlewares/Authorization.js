const jwt = require("jsonwebtoken");

//Dummy Authorization  middleware
exports.Authorization  = (req, res, next) => {
  let header, token;

  if (
    !(header = req.header("Authorization")) ||
    !(token = header.replace("Bearer ", ""))
  )
    return res.status(400).send({
      message: "Access Denied",
    });

  try {
    const secretKey = "DWF20VBFK_wow";
    const verified = jwt.verify(token, secretKey);

    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({
      message: "Invalid Token",
    });
  }
};