//jshint esversion:6

const express = require("express");
const bodyParser = require('body-parser');
const mongoose =  require("mongoose");
const _= require("lodash");
const app = express();



// var listitems = ["Buy Food","coock Food" , "EatFood"];
// let workItems = [];
app.set("view engine" , "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-ankush:!5E31a0478@cluster0-gnldt.mongodb.net/todolist_DB",{useNewUrlParser : true});

const itemsSchema = {
  name:String
}; //schema

const listSchema = {
  name:String,
  items:[itemsSchema]
}

const List = mongoose.model("list",listSchema);
const Item = mongoose.model("Item",itemsSchema); // model

const item1 = new Item({
  name:"welcome to your ToDo List"
});
const item2 = new Item({
  name: "Hit + to add a new item"
});
const item3 = new Item({
  name: "<-- hit this to delete the item"
});
const defaultItems = [item1, item2, item3];


app.get("/", function(req, res){

    Item.find({},function(err,foundItems){

      if(foundItems.length === 0){

          Item.insertMany(defaultItems,function(err){
            if(err){
                console.log(err);
                }//if
            else{
                console.log("sucessfully inserted in db");
                }//else
                res.redirect("/");
              });
            }
            else{
                res.render("lists",{listTitle:"Today", newlistitems:foundItems});
            }
  });
});

app.get("/:customListName",function(req,res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name:customListName},function(err,foundList){
    if(foundList){
      res.render("lists",{listTitle:foundList.name,newlistitems:foundList.items})
    }
    else{
      const list = new List({
      name:customListName,
      items:defaultItems
    });
    list.save();
    res.redirect("/"+customListName);
    }
  });
});

app.post("/",function(req,res){
  const itemName = req.body.newitem;
  const listName = req.body.list;
  const item = new Item({
    name:itemName
  });
  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" +listName);
      });
  }
});

app.post("/delete",function(req,res){
  const itemToDelete = req.body.checkbox;
  const listName = req.body.listName;

    if(listName === "Today"){
      Item.findByIdAndRemove(itemToDelete,function(err){
        if(!err){
           console.log("success");
           res.redirect("/");
         }
       });
     }
     else{
       List.findOneAndUpdate({name:listName},{$pull:{items:{_id:itemToDelete}}},function(err,results){
         if(!err){
           res.redirect("/" + listName );
         }
       })
     }
  });

app.get("/work",function(req,res){
  res.render("lists",{listTitle: "Work List", newlistitems: workItems});
});

app.get("/about", function(req,res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,function(){
  console.log("Server has started on port Sucessfully");
});
