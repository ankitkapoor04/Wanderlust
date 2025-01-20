const Listing = require("./model/listing");
const Review = require("./model/review.js");
const ExpressError = require("./utils/ExpressErrors.js");
const {listingSchema,reviewSchema} =require("./schema.js");

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log("Validation error:", errMsg); // Log the validation error
        throw new ExpressError(400, errMsg);
    }
    next(); // Ensure next() is called if no errors
  };

  module.exports.validateReview = (req, res, next) => {
    if (req.body.review && req.body.review.rating) {
      // Convert string rating to number
      req.body.review.rating = Number(req.body.review.rating);
    }
    
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }
  
    next();
  };
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Save the URL to redirect back after login
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login"); // Redirect to the login page
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Set redirect URL in res.locals
      // Clear redirect URL after setting
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","you are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)){
      req.flash("error","you are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
}