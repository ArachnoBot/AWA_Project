var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")

var apiRouter = require('./routes/api');
const e = require('express');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.resolve("..", "client", "build")))
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("..", "client", "build", "index.html"))
  })
}
else if (process.env.NODE_ENV == "development") {
  app.use(cors({origin: "http://localhost:3000", optionsSuccessStatus: 200}))
} else {
  console.log("NO NODE_ENV DETECTED")
}

module.exports = app;
