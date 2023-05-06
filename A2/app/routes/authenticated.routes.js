module.exports = app => {

  const auth = require("../middlewares/auth");

  const authenticated = require("../controllers/authenticated.controller.js");

  var router = require("express").Router();

  router.put("/:document/", authenticated.updateProfile);

  router.put("/:document/password", authenticated.updatePassword);

  router.put("/:document/password/company", authenticated.updateCompanyPassword);

  router.get("/:document/download", authenticated.download);

  router.post("/:document/qr", authenticated.qr);

  app.use("/authenticated/", auth, router);

};