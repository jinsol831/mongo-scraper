var express = require("express");

var router = express.Router();

var article = require("../models/Articles.js");




// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    article.find({})
    .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
    })
    .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
});


router.get("/saved", function(req,res){
    article.find({issaved:true}, null, {sort:{created:-1}},function(Err,data){
        if(data.length === 0){
            res.render("placeholder",{message:"You have not saved this articles"})
        }
        else{
            res.render("saved",{saved:data})
        }
        
    })
})
router.get("/:id", function(req, res) {
	article.findById(req.params.id, function(err, data) {
		res.json(data);
	})
})
router.post("/save/:id", function(req, res) {
	article.findById(req.params.id, function(err, data) {
		if (data.issaved) {
			article.findByIdAndUpdate(req.params.id, {$set: {issaved: false, status: "Save Article"}}, {new: true}, function(err, data) {
				res.redirect("/");
			});
		}
		else {
			article.findByIdAndUpdate(req.params.id, {$set: {issaved: true, status: "Saved"}}, {new: true}, function(err, data) {
				res.redirect("/saved");
			});
		}
	});
});

module.exports = router;