module.exports = app => {

  const auth = require("../middlewares/auth");

  const users = require("../controllers/users.controller.js");

  var router = require("express").Router();

  router.get("/company", users.getCompanyUsers);

  app.use("/users", auth, router);

};