const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const updateExpiredPlan = require("./app/tasks/updateExpiredPlan.tasks");
const app = express();
require('dotenv').config()
var corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// routes
require('./app/routes/auth.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Call the function when the server starts
updateExpiredPlan.updateExpiredPlans();