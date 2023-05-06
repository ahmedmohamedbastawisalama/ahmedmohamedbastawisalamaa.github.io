module.exports = app => {

  const auth = require("../middlewares/auth");

  const visits = require("../controllers/visits.controller.js");

  var router = require("express").Router();

  router.post("/", visits.createVisit);
  router.get("/", visits.getVisits);
  router.get("/company", visits.getCompanyVisits);

  app.use("/visits", auth, router);

};