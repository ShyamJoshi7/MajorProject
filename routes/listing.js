const express=require("express");
const router=express.Router();
const wrapasync=require("../util/wrapasync.js");
const ExpressError = require("../util/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing =require("../models/listing.js");
const Review =require("../models/review.js");
const {isLoggedIn}=require("../middleware.js");

const validateListing =(req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
    }else{
        next();
    }
    };

    router.get("/",async(req,res)=>{
        const allListings = await Listing.find({});
        res.render("./listings/index.ejs",{ allListings });
    });
    
    router.get("/new",isLoggedIn,(req,res)=>{
        res.render("./listings/new.ejs");
    });
    
    router.get("/:id",wrapasync(async (req,res)=>{
        let {id}=req.params;
        const listing =await Listing.findById(id)
        // .populate("reviews")
        .populate("Owner");
        res.render("./listings/show.ejs",{ listing });
    }));
    
    router.post("/",isLoggedIn,wrapasync(async(req,res,next)=>{
        const newListing= new Listing(req.body.listing);
        newListing.Owner =req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
    }));
    
    router.get("/:id/edit",
        isLoggedIn,
        wrapasync(async(req,res)=>{
        let {id}= req.params;
        const listing =await Listing.findById(id);
        res.render("./listings/edit.ejs",{ listing });
    }));
    
    router.put("/:id",validateListing,isLoggedIn,wrapasync(async(req,res)=>{
        if(!req.body.listing){
            throw new ExpressError(400,"Pleas Enter valid data");
        }
        let {id}= req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success","New Listing Created!");
        res.redirect(`/listings/${id}`);
    }));
    
    router.delete("/:id",isLoggedIn,wrapasync(async(req,res)=>{
        let { id } =  req.params;
        let deletedListing=await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success","Listing Deleted!");
        res.redirect("/listings");
    }));

    module.exports =router;
   

    