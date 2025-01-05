const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema ({
    title:{
       type:String,
       required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,       
    },
    price:String,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    Owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

const Listing  = mongoose.model("Listing",listingSchema);
module.exports = Listing;