var express = require("express");

var router = express.Router();

var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");

var article = require("../models/Articles.js");

router.get("/", function(req, res) {
	article.find({}, null, {sort: {created: -1}}, function(err, data) {
		if(data.length === 0) {
			res.render("placeholder", {message: "There's nothing scraped yet. Please click \"Scrape For Newest Articles\" for fresh and delicious news."});
		}
		else{
			res.render("index", {article: data});
		}
	});
});


router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.nytimes.com/section/business").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    
    // Now, we grab every h2 within an article tag, and do the following:
    $("div.story-body").each(function(i, element) {
        // Save an empty result object
        var result = {};
        
        var link = $(element).find("a").attr("href");
        
        var title = $(element).find("h2.headline").text().trim();
        var summary = $(element).find("p.summary").text().trim();
        var img = $(element).parent().find("figure.media").find("img").attr("src");

        console.log(link);
        console.log(title);
        console.log(summary);
        console.log(img);        
        result.link = link;
        result.title = title;
        
        if (summary) {
            result.summary = summary
        }
        if(img) {
            result.img = img;
        }
        else {
            result.img =$(element).find(".wide-thumb").find("img").attr("src")
        }
        
        // Create a new Article using the `result` object built from scraping
        // article.create(result)
        // .then(function(dbArticle) {
        //     // View the added result in the console
        //     console.log(dbArticle);
        // })
        // .catch(function(err) {
        //     // If an error occurred, send it to the client
        //     //console.log(err);
        //     return res.json(err);
        // });
        var entry = new article(result);
			article.find({title: result.title}, function(err, data) {
				if (data.length === 0) {
					entry.save(function(err, data) {
						if (err) throw err;
					});
				}
			});
        })
        console.log("fetch complete")
        //i need to get result from axios
        // If we were able to successfully scrape and save an Article, send a message to the client
        res.redirect("/");
    }).catch(function(err){
        console.log(err);
    });
});
// Route for getting all Articles from the db
router.get("/", function(req, res) {
    // Grab every document in the Articles collection
    article.find({})
    .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
    })
    .catch(function(err) {
        // If an error occurred, send it to the client
        console.log(err)
        res.json(err);
    });
});

module.exports = router;