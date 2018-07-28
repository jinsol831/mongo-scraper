//dependencies

var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
// var request = require("request");

// var cheerio = require("cheerio");
// var axios = require("axios");
// Require all models
var db = require("./models");
mongoose.Promise = Promise;
var databaseUrl = "mongodb://localhost/articlescraper"
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articlescraper";
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});


var PORT = process.envPORT || 3001;

// Initialize Express
var app = express();
//use body parser for handling form submission
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// use express static to service public folder as static directory
app.use(express.static("public"));
//logger
app.use(logger("dev"));

mongoose.connect(databaseUrl);

//app.use(method("_method"));
app.engine("handlebars", exphbs({defaultLayout: "main"}))
app.set("view engine","handlebars")
//require("./routes/html-routes.js")(app);
//require("./routes/api-routes.js")(app);
// Start the server

var route1 = require("./controllers/fetch.js");
var route2 = require("./controllers/headline.js");
var route3 = require("./controllers/note.js");

app.use(route1);
app.use(route2);
app.use(route3);




app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});