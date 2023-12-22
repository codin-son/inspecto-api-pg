module.exports = (sequelize, Sequelize) => {
    const Privilege = sequelize.define("priveleges", {
      p_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      p_name: {
        type: Sequelize.STRING
      }
    });
  
    return Privilege;
  };