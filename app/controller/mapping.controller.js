const { exec } = require("child_process");
let process = null;

function startMapping() {
    return new Promise((resolve, reject) => {
        process = exec('roslaunch livox_ros_driver2 msg_MID360.launch', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return reject(error);
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            resolve(stdout ? stdout : null);
        });
    });
}

function stopMapping() {
    return new Promise((resolve, reject) => {
        if (process) {
            process.kill();
            process = null;
            resolve();
        } else {
            reject(new Error("No process running"));
        }
    });
}

module.exports = { startMapping, stopMapping };