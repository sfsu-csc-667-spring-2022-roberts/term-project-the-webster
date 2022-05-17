var createError = require("http-errors");
var express = require("express");
var handlebars = require("express-handlebars");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var pg = require("pg");
var session = require("express-session");
var pgSession = require("connect-pg-simple")(session);
var flash = require("express-flash");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const db = require("./db/index");

var app = express();

const pgPool = new pg.Pool({
 connectionString: process.env.DATABASE_URL
});

const session_middleware = session({
  store: new pgSession({
    pool: pgPool,
    createTableIfMissing: true,
  }),
  secret: "blah",
  resave: false,
  saveUninitialized: false,
  path: "/",
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
});

app.use(session_middleware);

// view engine setup
const hbs = handlebars.create({
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  extname: ".hbs",
  defaultLayout: "layout",
});

app.engine("hbs", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static("public/images"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  next();
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var lobbyRouter = require("./routes/lobby");
var browseLobbyRouter = require("./routes/browseLobby");
var gameRouter = require("./routes/game");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/lobby", session_middleware, lobbyRouter);
app.use("/browseLobby", browseLobbyRouter);
app.use("/game", gameRouter);

//for express flash
app.use(flash());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
