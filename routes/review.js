const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const {reviewSchema} =require("../schema.js");
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");

console.log("yoyo");

const validateReview = (req, res, next) => {
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

  
//Review Route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
  
    listing.reviews.push(newReview);
   
    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${listing._id}`);
  
  })
  );
  
  //Delete Reviews
  router.delete("/:reviewId",wrapAsync(async(req,res) =>{
  let {id,reviewId} = req.params;
  
  await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  
  res.redirect(`/listings/${id}`);
  })
  );

  module.exports = router;