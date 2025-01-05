const express = require("express");
const app = express();
const Listing =require("./models/listing.js");
const path = require("path");
const wrapasync = require("./util/wrapasync.js");
const ExpressError = require("./util/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review =require("./models/review.js");
const session = require("express-session");
const flash =require("connect-flash");
const passport =require("passport");
const LocalStrategy =require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");

const ejsMate =require("ejs-mate");
app.engine("ejs",ejsMate);

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');
const review = require("./models/review.js");
const { Cookie } = require("express-session");
main()
.then((res)=>{
    console.log("connection successfull!");
})
.catch((err)=> {
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description :"By The Beach",
//         price:1200,
//         location:"Clangute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log(sampleListing);
//     res.send("success");
// });
const port =3000;
app.listen(port,(req,res)=>{
    console.log(`listening on ${port}`);
});

app.get("/",(req,res)=>{
    res.redirect("/listings");
});

const validateListing =(req,res,next)=>{
let {error} =listingSchema.validate(req.body);
if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
}else{
    next();
}
};

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
       expires:Date.now() + 7*24*60*60*1000,
       maxAge:7*24*60*60*1000,
       httpOnly:true
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser =new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser =await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let { statusCode,message } =err;
    res.status(statusCode).render("error.ejs",{message});
});
