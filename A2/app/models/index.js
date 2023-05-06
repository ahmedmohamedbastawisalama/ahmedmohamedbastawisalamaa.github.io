require('dotenv').config();

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.DB_URL;
db.users = require("./users.model.js")(mongoose);
db.tokens = require("./tokens.model.js")(mongoose);
db.designations = require("./designations.model.js")(mongoose);
db.visits = require("./visits.model.js")(mongoose);
db.companies = require("./companies.model.js")(mongoose);

module.exports = db;