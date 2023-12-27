const db = require("../model/index");
const User = db.user;
const Up = db.user_privilege;
const Op = db.Sequelize.Op;
const logUserActivity = require("../utils/logHelper");
var bcrypt = require("bcryptjs");
exports.updateUserInfo = (req, res) => {
  let date = new Date();
  date = date.toISOString();
  if (
    !req.body.username ||
    !req.body.email ||
    !req.body.status ||
    !req.body.company ||
    !req.body.user_id
  ) {
    return res
      .status(400)
      .send({ message: "Request data cannot be empty!", resid: 0 });
  }
  User.findByPk(req.body.user_id, {
    attributes: { exclude: ["user_password"] },
  }).then((user) => {
    User.findOne({
      where: {
        [Op.and]: [
          {
            user_id: {
              [Op.ne]: req.body.user_id,
            },
          },
          {
            [Op.or]: [{ user_username: req.body.username }],
          },
        ],
      },
    })
      .then((user) => {
        if (user) {
          if (user.user_username === req.body.username) {
            return res.status(400).send({
              message: "Failed! Username is already in use!",
              resid: 1,
            });
          }
        }
        User.update(
          {
            user_username: req.body.username,
            user_email: req.body.email,
            user_status: req.body.status,
            user_updated_at: date,
            user_company: req.body.company,
          },
          {
            where: {
              user_id: req.body.user_id,
            },
          }
        )
          .then((user) => {
            logUserActivity(
              19,
              "update user info for username: " +
                req.body.username +
                " and email: " +
                req.body.email +
                ""
            );
            res.send({ message: "User was updated successfully!", resid: 3 });
          })
          .catch((err) => {
            console.log("err", err);
            res.status(500).send({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  });
};

exports.changePassword = (req, res) => {
  let date = new Date();
  date = date.toISOString();
  if (!req.body.user_id || !req.body.password) {
    return res
      .status(400)
      .send({ message: "Password cannot be empty!", resid: 0 });
  }

  if (req.body.password != req.body.confirmPassword) {
    return res.status(401).send({
      resid: 1,
      message: "Password and Confirm Password are not same!",
    });
  }
  User.update(
    {
      user_password: bcrypt.hashSync(req.body.password, 8),
      user_updated_at: date,
    },
    {
      where: {
        user_id: req.body.user_id,
      },
    }
  ).then((user) => {
    User.findByPk(req.body.user_id, {
      attributes: ["user_username", "user_email"],
    }).then((user) => {
      logUserActivity(
        19,
        "change password for username: " +
          user.user_username +
          " and email: " +
          user.user_email +
          ""
      );
      res.send({ message: "User was updated successfully!", resid: 3 });
    });
  });
};

exports.updateUserPlan = async (req, res) => {
  const up_data = req.body.plan_info;
  let updatePromises = Object.entries(up_data).map(([up_id, [status, expired_date]]) => {
    if(!status){
      expired_date = null;
    }
    else{
      expired_date = new Date(expired_date);
      expired_date = expired_date.toISOString();
    }
    return Up.update(
      {
        up_status: status ? 1 : 0,
        up_expired_at: expired_date,
      },
      {
        where: {
          user_id: req.body.user_id,
          p_id: up_id,
        },
      }
    );
  });

  try {
    await Promise.all(updatePromises);
    const user = await User.findByPk(req.body.user_id, {
      attributes: ["user_username", "user_email"],
    });
    logUserActivity(
      19,
      "update user plan for username: " +
        user.user_username +
        " and email: " +
        user.user_email
    );
    res.status(200).send({ message: "User plan updated successfully.", resid:3 });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
