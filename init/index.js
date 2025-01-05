const mongoose =require("mongoose");
const initData =require("./data.js");
const Listing=require("../models/listing.js");

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

const intiDB =async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,Owner:'668f5500b0745ea2029a3910'}));
    await Listing.insertMany(initData.data);
    console.log("data init");
}

intiDB();