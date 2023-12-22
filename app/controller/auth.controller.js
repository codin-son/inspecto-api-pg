const db = require("../model/index");
const Log = db.log;
const User = db.user;
const Up = db.user_privilege;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
require("dotenv").config();
const tokenkey = process.env.TOKEN_KEY;
const logUserActivity = require("../utils/logHelper");
exports.signup = (req, res) => {
  let date = new Date();
  date = date.toISOString();

  const pw = req.body.password;
  const con_pw = req.body.confirm_password;
  if (req.body.password.length < 8) {
    return res.status(400).send({
      message: "Failed! Password must be at least 8 characters!",
      resid: 2,
    });
  } else if (pw != con_pw) {
    return res.status(401).send({
      resid: 0,
      message: "Password and Confirm Password are not same!",
    });
  } else {
    User.create({
      user_username: req.body.username,
      user_email: req.body.email,
      user_password: bcrypt.hashSync(req.body.password, 8),
      user_status: 1,
      user_created_at: date,
      user_updated_at: date,
      user_company: req.body.company,
    })
      .then((user) => {
        logUserActivity(
          19,
          "sign up new user for username: " +
            user.user_username +
            " and email: " +
            user.user_email +
            ""
        );
        res.send({ message: "User was registered successfully!", resid: 4 });
        for (let i = 1; i <= 5; i++) {
          Up.create({
            user_id: user.user_id,
            p_id: i,
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).send({ message: err.message });
      });
  }
};

exports.signin = async (req, res, next) => {
  try {
    User.findOne({
      where: {
        user_username: req.body.username,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.user_password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }
        if (user.user_status == 1) {
          const token = jwt.sign(
            { uid: user.user_id, level: user.user_level },
            process.env.TOKEN_KEY,
            {
              algorithm: "HS256",
              allowInsecureKeySizes: true,
              expiresIn: "24h", // 24 hours
            }
          );

          res
            .cookie("token", token, {
              maxAge: 86400 * 1000, // 24 hours in milliseconds
              withCredentials: true,
              httpOnly: false,
            })
            .status(200)
            .send({
              id: user.user_id,
              status: user.user_status,
              accessToken: token,
              success: true,
              message: "Login Success!",
            });
        }else{
          res.status(401).send({
            accessToken: null,
            message: "User is not active!",
          });
        }
        logUserActivity(user.user_id, "Login inspecto ui");
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (error) {
    console.error("error", error);
  }
};

exports.signinAdmin = async (req, res, next) => {
  try {
    User.findOne({
      where: {
        user_username: req.body.username,
        user_level: 0,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.user_password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }
        console.log(tokenkey);

        const token = jwt.sign(
          { uid: user.user_id, level: user.user_level },
          process.env.TOKEN_KEY,
          {
            algorithm: "HS256",
            allowInsecureKeySizes: true,
            expiresIn: "24h", // 24 hours
          }
        );
        logUserActivity(user.user_id, "Login inspecto user manager");
        res
          .cookie("token", token, {
            maxAge: 86400 * 1000,
            withCredentials: true,
            httpOnly: false,
          })
          .status(200)
          .send({
            id: user.user_id,
            accessToken: token,
            success: true,
            message: "Login Success!",
          });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (error) {
    console.error("error", error);
  }
};

exports.signout = (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (data) {
      // get date
      let date = new Date();
      date = date.toISOString();
      const log = await Log.create({
        user_id: data.uid,
        log_activity: "Logout",
        log_created_at: date,
      });
      if (log) {
        res.clearCookie("token");
        return res.json({ status: true });
      }
    }
  });
};
