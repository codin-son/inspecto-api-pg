const db = require("../model/index");
const User = db.user;
const Up = db.user_privilege;
var jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenkey = process.env.TOKEN_KEY;
module.exports.userVerification = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      console.log("err", err);
      return res.json({ status: false });
    } else {
      const user = await User.findByPk(data.uid, {
        attributes: ["user_id"],
      });
      if (user) {
        const up = await Up.findAll({
          attributes: ["p_id", "up_status"],
          where: { user_id: user.user_id },
        });
        if (up) {
          return res.json({ status: true, up: up });
        }
      } else {
        return res.json({ status: false });
      }
    }
  });
};
