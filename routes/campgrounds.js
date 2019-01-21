var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware =  require("../middleware");


//INDEX ROUTE -- shows all camps
router.get("/", function(req,res){
    if(req.query.search){
        const regex = new RegExp(sanitizedRegex(req.query.search), 'gi');// sanitize the search term to avoid attacks
        
        Campground.find({name: regex}, function(err, allCampgrounds){
        if(err){
            
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds : allCampgrounds});
        }
        
    });
        
    }else{
        
    
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds : allCampgrounds});
        }
        
    });
    }
    
});

//CREATE ROUTE -- post req
router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {name: name, image: image, description: desc, price: price, author: author};
    //Create a new camp and save to Mongo
    Campground.create(newCamp, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");       
        }
    });
    
});
//NEW ROUTE -- SHOWS FORM TO CREATE NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});
//SHOW ROUTE -- SHOWS SINGLE CAMP
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
       if(err){
           console.log(err);
       } else{
           res.render("campgrounds/show", {campground: foundCamp});
       }
    });
    req.params.id
    
});

//EDIT CAMP ROUTE -- Shows form
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
        });
    });

//Update Route
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedUnit){
       if(err){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds");
       }
   }); 
});

//DESTROY CAMP ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds");
    });
});

//middleware


function sanitizedRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");  
};

module.exports = router;
