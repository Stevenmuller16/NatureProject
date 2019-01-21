var middlewareObject = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");


middlewareObject.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        
            Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Hoo boy, something happened there and we could not find that one");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin)
                {
                    next();
                }else{
                    req.flash("error", "Sorry there, you are not allowed to do that");
                    res.redirect("back");
                }
                
            }
            
        });
    }else{
        req.flash("error", "hmm, you need to loggin in to do that");
        res.redirect("back");
        
    }
}

middlewareObject.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        
            Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Hoo boy, something happened there and we could not find that one");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin)
                {
                    next();
                }else{
                    req.flash("error", "Sorry there, you are not allowed to do that");
                    res.redirect("back");
                }
            }
        });
    }else{req.flash("error", "hmm, you need to loggin in to do that");
        res.redirect("back");
        
    }
}

middlewareObject.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "hmm, you need to loggin in to do that");
    res.redirect("/login");
}

module.exports = middlewareObject;