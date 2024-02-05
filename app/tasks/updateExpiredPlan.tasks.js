const { Op } = require("sequelize");
const db = require("../model/index");
const Up = db.user_privilege;
async function updateExpiredPlans() {
  const now = new Date();
  try {
    await Up.update(
      {
        up_status: 0,
        up_expired_at: null,
      },
      {
        where: {
          up_expired_at: {
            [Op.lt]: now,
          },
        },
      }
    );
  } catch (err) {
    console.error(err);
  }
}


module.exports = {
  updateExpiredPlans,
};
