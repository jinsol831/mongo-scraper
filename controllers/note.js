var express = require("express");

var router = express.Router();

var note = require("../models/Note.js");
var article = require("../models/Articles.js")

router.get("/note/:id", function(req,res){
    var id = req.params.id;
    console.log(id);
    article.findById(id).populate("note").exec(function(err,data){
        res.send(data.note);
    })
    
})
router.post("/note/:id",function(req,res){
    var note= new Note (req.body);
    note.save(function(err,doc){
        if (err) throw err;
        article.findByIdAndUpdate(req,params.id, {$set: {"note": doc._id}},{new:true})
    })
})



module.exports = router;