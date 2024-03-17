const express=require("express");
const app=express();
const path=require("path");
const fs=require("fs");
const cookieparser=require("cookie-parser");
const session=require("express-session");

const client=require("mongodb").MongoClient;
let dbinstance;
client.connect("mongodb://127.0.0.1:27017").then((data)=>{
    dbinstance=data.db("BathchA");
    
    console.log("mogodb connect");

})
const oneday=1000*60*60*24;
app.use(cookieparser());
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");


app.use(session({
    saveUninitialized:true,
    resave:false,
    secret:'asd#$3112',
    cookie:{maxAge:oneday}
}))
const authRoutes=require("./routing/authroutes")
app.use("/users",auth,authRoutes);
app.use(express.static("public"));


function auth(req,res,next)
{
    if(req.session.username)
    next();
    else
    res.redirect("/");

}

const productRoutes=require("./routing/productroutes");
app.use("/products",productRoutes);



app.get("/login",(req,res)=>{
    res.render("login",{message:""})
})

app.post("/login", (req, res) => {
    
    // const fromdata={
    //     "username":req.body.username,
    //     "password":req.body.password
    // }
dbinstance.collection('student').findOne({$and:[{"username":req.body.username,"password":req.body.password}]}).then((response)=>{


    // console.log(response);
   if(response==null)
   res.render("login",{message:"Invalid user/password"});
   
   else{
    // response=JSON.parse(response);
    req.session.username=response.username;
    req.session.name=response.name;
    res.redirect("/users/dashboard");
   }

})
})


   app.get("/",(req,res)=>{
    // fs.readFile("products.json","utf-8",(err,data)=>{
    //     let productsData=JSON.parse(data);
    //     res.render("index",{products:productsData});
    // })

    dbinstance.collection("goods").find({}).toArray().then((response)=>{
        res.render("index",{products:response});
    })
    
})
app.get("/productDetails/:id",(req,res)=>{
    fs.readFile("products.json","utf-8",(err,data)=>{
        let productsData=JSON.parse(data);

        let results=productsData.filter((item)=>{
            if(item.id==req.params.id)
            return true;
        })
         
        res.render("index",{products:results});
    })
})
app.listen(3000,(err)=>{
    console.log("Server Started...");

})