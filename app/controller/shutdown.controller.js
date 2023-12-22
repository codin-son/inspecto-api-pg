const { exec } = require("child_process");
require("dotenv").config();
const PC_PW = process.env.PC_PW;

function shutdownPC() {
  return new Promise((resolve, reject) => {
    exec(`echo ${PC_PW} | sudo -S shutdown -h now`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error sending shutdown command: ${error}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Error sending shutdown command: ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      if (stdout) {
        console.log("Shutdown command sent successfully");
      }
      resolve();
    });
  });
}

module.exports = { shutdownPC };
