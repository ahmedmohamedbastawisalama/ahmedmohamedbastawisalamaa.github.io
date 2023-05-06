module.exports = app => {

  const auth = require("../middlewares/auth");

  const designations = require("../controllers/designations.controller.js");

  var router = require("express").Router();

  router.post("/", designations.createDesignations);
  router.get("/company", designations.getCompanyDesignations);

  app.use("/designations", auth, router);

};