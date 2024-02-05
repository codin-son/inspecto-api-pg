module.exports = (sequelize, Sequelize) => {
  const Log = sequelize.define("log", {
    log_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    log_activity: {
      type: Sequelize.STRING
    },
    log_created_at: {
      type: Sequelize.DATE
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
  },    {
    timestamps: false,
  });

  return Log;
};