const request  = require('request');
var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var Campground = require("./models/campground");
// var comment    = require("./models/user");
var seedDB     = require("./seeds");


mongoose.connect("mongodb://mongodb:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();


// Campground.create({name: "Granite Hill", image: "https://www.photosforclass.com/download/pb_1897382", description:"This is a huge Granite Hill!"},

// function(err,campground){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("Newly Created Campground:")
//         console.log(campground);
//     }
// });


app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){

    //get all campgrounds from DB
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds})
        }
    });
});

app.post("/campgrounds",function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    //create a new campground and save to DB
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });

});

app.get("/campgrounds/new",function(req, res){
    res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
});

//=======================
//COMMETS ROUTES
//=======================

app.get("/campgrounds/:id/comments/new", function(req,res) {
    //find campground by id
    Campground.findById(req.params.id, function(err,campground){
        console.log("shitshit");
        console.log(campground.name);
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
    res.render("comments/new");
});

app.listen(8000, function() {
    console.log("Server started 8000")
});
