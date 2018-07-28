var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticlesSchema = new Schema({
    title : {
        type: String,
        required: false
    },
    summary:{
        type: String,
        required: false
    },
    link:{
        type: String,
        required: false
    },
    img:{
        type: String,
        default: "./public/images/unavailable.jpg",
        required: false
    },
    issaved: {
        type:Boolean,
        default: false
    },
    status: {
        type: String,
        default: "Save Article"
    },
    created: {
        type: Date,
        default: Date.now
    },
    note:{
        type: Schema.Types.ObjectId,
        ref:"Note"
    }
    
    
});
var Article = mongoose.model("Article", ArticlesSchema);

module.exports = Article;