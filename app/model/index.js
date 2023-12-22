const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  },
  
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.log = require("./log.model.js")(sequelize, Sequelize);
db.privilege = require("./privilege.model.js")(sequelize, Sequelize);
db.user_privilege = require("./user_privilege.model.js")(sequelize, Sequelize);

db.user.belongsToMany(db.privilege, { through: db.user_privilege, foreignKey: "user_id" });
db.privilege.belongsToMany(db.user, { through: db.user_privilege, foreignKey: "p_id" });
db.log.belongsTo(db.user, { foreignKey: 'user_id' });
db.user.hasMany(db.log, { foreignKey: 'user_id' });
module.exports = db;