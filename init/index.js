const mongoose = require("mongoose");
const initData= require("./listing.js");

const Listing=require("../models/listing.js");

main().then((res) => {
    console.log("connection established");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((ele)=>{return {...ele,owner: "65915d9b8972fc8862c9cc8e"}});
    // initData.data=initData.data.map(async (ele)=>{
    //     let response=await geocodingClient
    //     .forwardGeocode({
    //         query: ele.location,
    //         limit:1
    //     })
    //     .send();
    //     let geometry=response.body.features[0].geometry;
    //     return {...ele,geometry}
    // })

    await Listing.insertMany(initData.data);
    console.log("db initialized");
}

initDB();