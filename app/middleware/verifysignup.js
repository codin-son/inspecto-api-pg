const db = require("../model/index");
const user = db.user;
checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  user
    .findOne({
      where: {
        user_username: req.body.username,
      },
    })
    .then((userWithUsername) => {
      if (userWithUsername) {
        res.status(400).send({
          message: "Failed! Username is already in use!",
          resid:1,
        });
        return;
      }
        next();
    });
};
const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};
module.exports = verifySignUp;
