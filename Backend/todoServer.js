const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { z } = require("zod");
const PORT = 3000 ;
const app = express();
app.use(express.json());
app.use(cors());

const todoSchema = new mongoose.Schema({
   title: {
     type: String
   },
   description: {
    type: String
   }
});

const Todos = mongoose.model("To-dos", todoSchema) ;

mongoose.connect("mongodb+srv://kshitijtodkar48:<password>.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true, dbName: "Todo-App" });

const toDoInput = z.object({
  title: z.string(),
  description: z.string(),
})

app.post("/todos" , async (req , res) => {
   const parsedInput = toDoInput.safeParse(req.body) ;
   if(!parsedInput.success)
   {
      return res.status(411).json({
        message: "Invalid input"
      })
   }
   const { title, description } = req.body ;
   const todo = await Todos.findOne({ title, description }) ;
   if(todo)
   {
     return res.status(403).json({ message: "To-do already exists." }) ;
   }
   const newTodo = new Todos({
     title : req.body.title ,
     description : req.body.description  
   })
   await newTodo.save() ;
   const updatedTodos = await Todos.find({});
   res.send(updatedTodos);
})

app.get("/todos" , async (req , res) => {
   const todos = await Todos.find({}) ;
   res.send(todos) ;
})

app.get("/todos/:id" , async (req , res) => {
   const todo = await Todos.findById(req.params.id) ;
   if(!todo)
   {
     return res.status(404).json({ message: "To-do not found." }) ;
   }
   res.json({ todo }) ; // Status 200 by default.
})

app.put("/todos/:id" , async (req , res) => {
   const todo = await Todos.findByIdAndUpdate(req.params.id, req.body, { new: true }) ;
   if (todo) {
    res.json({ message: "To-do updated successfully." });
  } else {
    res.status(404).json({ message: "To-do not found." });
  }
})

app.delete("/todos/:id" , async (req , res) => {
  await Todos.deleteOne({ _id: req.params.id })
  const updatedTodos = await Todos.find({});
  res.send(updatedTodos);
})

// for all other routes, return status-404
app.use((req, res, next) => {
  res.status(404).send();
});

app.listen(PORT , () => { console.log(`Server started at port : ${PORT}.`)}) ;
