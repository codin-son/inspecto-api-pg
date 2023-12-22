module.exports = (sequelize, Sequelize) => {
    const user_privilege = sequelize.define("user_privilege", {
      up_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'users',
          key: 'user_id'
        }
      },
      p_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'priveleges',
          key: 'p_id'
        }
      },
      up_status: {
        type: Sequelize.INTEGER
      },
    },
    {
      timestamps: false, // disable automatic timestamp fields
    });
  
    return user_privilege;
  };