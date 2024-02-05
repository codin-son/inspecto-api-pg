const { exec } = require("child_process");
let process = null;

function startScanning() {
    return new Promise((resolve, reject) => {
        process = exec('roslaunch livox_ros_driver2 rviz_MID360.launch', (error, stdout, stderr) => {
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

function stopScanning() {
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

module.exports = { startScanning, stopScanning };