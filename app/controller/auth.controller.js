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

  let date = req.body.date;
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
          1,
          "sign up new user for username: " +
            user.user_username +
            " and email: " +
            user.user_email +
            "",
            date
        );
        res.send({ message: "User was registered successfully!", resid: 4 });
        for (let i = 1; i <= 6; i++) {
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
    let date = new Date();
    if(req.body.date){
      date = req.body.date;
    }
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
            tokenkey,
            {
              algorithm: "HS256",
              allowInsecureKeySizes: true,
              expiresIn: "24h", // 24 hours
            }
          );

          res
            .cookie("token_app", token, {
              sameSite: "Lax",
              maxAge: 86400 * 1000, // 24 hours in milliseconds
              httpOnly: false,
              
            })
            .status(200)
            .send({
              id: user.user_id,
              status: user.user_status,
              usernameVld: user.user_username,
              email: user.user_email,
              success: true,
              message: "Login Success!",
            });
        } else {
          res.status(401).send({
            accessToken: null,
            message: "The user account is currently deactivated by the admin.",
          });
        }
        logUserActivity(user.user_id, "Login inspecto ui", date);
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
    let date = new Date();
    if(req.body.date){
      date = req.body.date;
    }
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

        const token = jwt.sign(
          { uid: user.user_id, level: user.user_level },
          tokenkey,
          {
            algorithm: "HS256",
            allowInsecureKeySizes: true,
            expiresIn: "24h", // 24 hours
          }
        );
        logUserActivity(user.user_id, "Login inspecto user manager", date);
        res
          .cookie("token_manager", token, {
            sameSite: "Lax",
            maxAge: 86400 * 1000,
            httpOnly: false,
          })
          .status(200)
          .send({
            id: user.user_id,
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
  let token = req.headers["x-access-token"];
  let token_name = "";
  if (req.cookies.token_app) {
    token = req.cookies.token_app;
    token_name = "token_app";
  } else if (req.cookies.token_manager) {
    token = req.cookies.token_manager;
    token_name = "token_manager";
  }
  let date = req.body.date;
  jwt.verify(token, tokenkey, async (err, data) => {
    if (data) {
      const log = await Log.create({
        user_id: data.uid,
        log_activity: "Logout",
        log_created_at: date,
      });
      if (log) {
        res.clearCookie(token_name);
        return res.json({ status: true });
      }
    }
  });
};
