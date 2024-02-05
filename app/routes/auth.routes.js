const { verifySignUp } = require("../middleware/index");
const controller = require("../controller/auth.controller");
const controllerFetch = require("../controller/fetch.controller");
const controllerUpdate = require("../controller/update.controller");
const { userVerification } = require("../middleware/verifyAuth");
const { restartService } = require("../controller/restart.controller");
const { shutdownPC } = require("../controller/shutdown.controller");
const {
  startScanning,
  stopScanning,
} = require("../controller/scanning.controller");
const {
  startMapping,
  stopMapping,
} = require("../controller/mapping.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signup
  );

  app.post("/signin", controller.signin);

  app.post("/signinAdmin", controller.signinAdmin);

  app.get("/getAllUser", controllerFetch.getAllUsers);

  app.get("/getAllLog", controllerFetch.getAllLog);

  app.get("/getNewLog", controllerFetch.getNewLog);

  app.get("/getUserInfoByID", controllerFetch.getUserInfoByID);

  app.get("/getUserPlanByID", controllerFetch.getUserPlanByID);

  app.post("/updateUser", controllerUpdate.updateUserInfo);

  app.post("/changePassword", controllerUpdate.changePassword);

  app.post("/updateUserPlan", controllerUpdate.updateUserPlan);

  app.get("/getNewUser", controllerFetch.getNewUser);

  app.post("/", userVerification);

  app.get("/getTotalUser", controllerFetch.getTotalUser);

  app.get("/getTotalLog", controllerFetch.getTotalLog);

  app.post("/signout", controller.signout);

  app.post("/deleteUser", controllerUpdate.deleteUser);

  app.get("/restart", async (req, res) => {
    try {
      const output = await restartService("robot_bringup.service");
      res.send(`Service restart initiated. Output: ${output}`);
    } catch (error) {
      res.status(500).send("Error restarting service");
    }
  });

  app.get("/shutdown", async (req, res) => {
    try {
      await shutdownPC();
      res.send("Shutdown initiated");
    } catch (error) {
      res.status(500).send("Error initiating shutdown");
    }
  });

  app.get("/startScanning", async (req, res) => {
    try {
      await startScanning();
      res.send("Scanning started");
    } catch (error) {
      res.status(500).send("Error starting scanning");
    }
  });

  app.get("/stopScanning", async (req, res) => {
    try {
      await stopScanning();
      res.send("Scanning stopped");
    } catch (error) {
      res.status(500).send("Error stopping scanning");
    }
  });

  app.get("/startMapping", async (req, res) => {
    try {
      await startMapping();
      res.send("Mapping started");
    } catch (error) {
      res.status(500).send("Error starting mapping");
    }
  });

  app.get("/stopMapping", async (req, res) => {
    try {
      await stopMapping();
      res.send("Mapping stopped");
    } catch (error) {
      res.status(500).send("Error stopping mapping");
    }
  });
};
