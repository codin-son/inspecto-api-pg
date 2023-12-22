const { exec } = require("child_process");
require("dotenv").config();
const pw = process.env.PC_PW;

function restartService(serviceName) {
  return new Promise((resolve, reject) => {
    exec(
      `echo ${pw} | sudo systemctl restart ${serviceName}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error restarting service: ${error}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`Error restarting service: ${stderr}`);
          reject(new Error(stderr));
          return;
        }
        if (stdout) {
          console.log("Service restarted successfully");
          console.log(stdout);
        }
        resolve(stdout); // resolve the Promise with stdout
      }
    );
  });
}

module.exports = { restartService };
