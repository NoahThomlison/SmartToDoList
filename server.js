// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require('cookie-session');
// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);

db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
const cooKey = 'doremi1234567890fasolatido';
app.use(cookieSession({
  name: 'session',
  keys: [cooKey],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const tasksRoutes = require("./routes/tasks");
const keywordsRoutes = require("./routes/keywords");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/tasks", tasksRoutes(db));
app.use("/api/keywords", keywordsRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.redirect("/api/users/login");
  // res.redirect("/api/tasks");

});

app.get("/tasks", (req, res) => {
  console.log('hello')
  res.render("index");

});

// app.post("/tasks/new", (req, res) => {
//   console.log(req.body)
//   console.log(tasksRoutes(req.body))
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
