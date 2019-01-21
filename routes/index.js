var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var middleware =  require("../middleware");

router.get("/", function(req,res){
   res.render("landing"); 
});





// AUTH ROUTES

//show reg form
router.get("/register", function(req, res) {
    res.render("register");
});
//Sign up POST 
router.post("/register", function(req, res) {
   
    var newUser = new User({username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, avatar: req.body.avatar, email: req.body.email });
     if(req.body.adminCode === 'secretcode123'){
         newUser.isAdmin = true;
     }
    User.register(newUser, req.body.password,function(err, user){
        if(err){
            req.flash("error", err.message);
           
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome To Nature " +req.body.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});

//login post
router.post("/login",passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login",
        failureFlash:true,
        successFlash: 'Welcome back'
        
    }), function(req, res) {
    
});

//Logout Route
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success", "you have been logged out");
    res.redirect("/campgrounds");
});


//USER PROFILE ROUTE

router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
       if(err){
           req.flash("error", "Sorry bout that, we really dont know");
           return res.redirect("/");
       } else{
           Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
               if(err){
                   req.flash("error", "Sorry bout that, we really dont know");
                   return res.redirect("/");
               }
               res.render("users/show", {user: foundUser, campgrounds: campgrounds});
           });
           
       }
    });
});


module.exports = router;

