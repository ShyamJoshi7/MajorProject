const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync = require("../util/wrapasync.js");
const ExpressError = require("../util/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing =require("../models/listing.js");
const Review =require("../models/review.js");

router.post("/",async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","New review Created!");
    res.redirect(`/listings/${listing._id}`);
});

router.delete("/:reviewId",async(req,res)=>{
    let {id,reviewId} =req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review Delted!");

    res.redirect(`/listing/${id}`);

});

module.exports = router;