const db = require("../model/index");
const Log = db.log;

async function logUserActivity(userId, activity, date) {
  console.log("logUserActivity",date);
  return await Log.create({
    user_id: userId,
    log_activity: activity,
    log_created_at: date,
  });
}

module.exports = logUserActivity;