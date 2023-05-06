const express = require("express");
const cors = require("cors");

const app = express();

global.__basedir = __dirname;

// var corsOptions = {
//   origin: [
//     "http://localhost:4200",
//     "http://localhost:8100"
//   ]
// };

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch(error => {
    console.log("Cannot connect to the database!", error.message);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/authenticated.routes")(app);
require("./app/routes/crud.routes")(app);
require("./app/routes/visits.routes")(app);
require("./app/routes/users.routes")(app);
require("./app/routes/designations.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
