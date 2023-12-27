const db = require("../model/index");
const User = db.user;
const Log = db.log;
const Up = db.user_privilege;
exports.getAllUsers = (req, res) => {
  User.findAll({
    attributes: { exclude: ['user_password'] },
    order: [['user_created_at', 'DESC']],
  })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getNewLog = async (req, res) => {
  try {
    const limit = 5;
    const logs = await Log.findAll({
      limit: limit,
      order: [['log_created_at', 'DESC']],
    });

    const logsWithUsernames = await Promise.all(
      logs.map(async (log) => {
        const user = await User.findByPk(log.user_id);
        return {
          ...log.toJSON(),
          username: user ? user.user_username : null,
        };
      })
    );

    res.send(logsWithUsernames);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getUserInfoByID = (req, res) => {
  const user_id = req.query.id;
  User.findByPk(user_id, {
    attributes: { exclude: ["user_password"] },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getUserPlanByID = (req, res) => {
  const user_id = req.query.id;
  Up.findAll({
    attributes:['p_id','up_status' ,'user_id', 'up_expired_at'],
    where: { user_id: user_id },
  })
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(404).send({ message: "User Not found." });
      }
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};


exports.getNewUser = (req,res) => {
  // get 5 new user 
  User.findAll({
    attributes: { exclude: ['user_password','user_status','user_updated_at','user_level'] },
    limit: 5,
    order: [['user_created_at', 'DESC']]
  })
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(404).send({ message: "User Not found." });
      }
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

exports.getTotalUser = (req,res) => {
  User.count()
    .then((users) => {
      if (!users) {
        return res.status(404).send({ message: "User Not found." });
      }
      res.send({totalUser:users});
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

exports.getTotalLog = (req,res) => {
  Log.count()
    .then((logs) => {
      if (!logs) {
        res.send({totalLog:0});
      }else{
        res.send({totalLog:logs});
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

exports.getAllLog = async (req, res) => {
  try {
    const logs = await Log.findAll({});

    const logsWithUsernames = await Promise.all(
      logs.map(async (log) => {
        const user = await User.findByPk(log.user_id);
        return {
          ...log.toJSON(),
          username: user ? user.user_username : null,
        };
      })
    );

    res.send(logsWithUsernames);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};