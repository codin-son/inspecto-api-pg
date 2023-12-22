module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_username: {
        type: Sequelize.STRING,
      },
      user_email: {
        type: Sequelize.STRING,
      },
      user_password: {
        type: Sequelize.STRING,
      },
      user_created_at: {
        type: Sequelize.DATE,
      },
      user_status: {
        type: Sequelize.INTEGER,
      },
      user_updated_at: {
        type: Sequelize.DATE,
      },
      user_company: {
        type: Sequelize.STRING,
      },
      user_level: {
        type: Sequelize.INTEGER,
      },
    },
    {
      timestamps: false, // disable automatic timestamp fields
    }
  );

  return User;
};
