const express=require("express");
const router=express.Router();


const client=require("mongodb").MongoClient;
let dbinstance;
client.connect("mongodb://127.0.0.1:27017").then((data)=>{
    dbinstance=data.db("BathchA");
    
    console.log("mogodb connect");

})

router.get("/",(req,res)=>{
    dbinstance.collection("goods").find({}).toArray().then((data)=>{
        res.render("products/ShowAll",{data:data});
    })
})

module.exports=router;