var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/restfull_blog");
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var restSchema = new mongoose.Schema({
    title:String,
    image:String,
    body  : String,
    created : {type:Date, default : Date.now}
});

var Blog = mongoose.model("Blogs",restSchema);

// Blog.create({
//     title:"Mass Pattern Pahntotma",
//     image : "https://images.unsplash.com/photo-1533132108820-9212801a2caf?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=41f728bab20b6808483b782dfdad4f83&auto=format&fit=crop&w=500&q=60",
//     body :"THe study of planet origin "
// });

app.get("/",function(req,res){
    res.redirect("/blogs");
});
//INDEX
app.get("/blogs",function(req,res){
   Blog.find({},function(err,blog){
       if(err){
           console.log('Erroor!!!');
       }
       else
       {
           console.log(blog);
           res.render("index",{blogVar:blog});
       }
   });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
   res.render("new"); 
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
    console.log(req.body);
    req.body.blog.body = req.sanitize( req.body.blog.body);
    console.log("===============================");
    console.log(req.body);
    Blog.create(req.body.blog, function(err,blog){
        if(err){
            res.render("new");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
   Blog.findById(req.params.id, function(err,blogFound){
       if(err)
       {
           res.redirect("/blogs");
       }
       else
       {
           res.render("show",{blog:blogFound});
       }
   });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit",{blog:foundBlog});
        }
    });
    
});

//UPDATE ROUTE
    app.put("/blogs/:id",function(req,res){
         req.body.blog.body = req.sanitize( req.body.blog.body);
        Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,blogUpdate){
            if(err){
                res.redirect("/blogs/");
            }
            else
            {
                res.redirect("/blogs/"+req.params.id);
            }
        });
    });
    
    //DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.send("Blog Not deleted");
       }
       else
       {
          res.redirect("/blogs");
       }
   });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Rest Blog server running");
})