const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const errorHandler = require("./middleware/errorHandler");
const PORT = 4000;
let Todo = require("./todo.model");
let authRoutes = require("./routes/auth");
const { response } = require("express");

// app.get("/", (req, res) => {
//     response.render("index")

// })

//app.use(bodyParser.urlencoded({extended: false})); app.use(express.static(path.join(__dirname, 'public')));

const app = express();

app.use(bodyParser.json());

app.use("/auth", authRoutes);

mongoose.connect("mongodb://localhost:27017/todos", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//Displays the full todo list
todoRoutes.route("/").get((req, res) => {
  Todo.find((err, todos) => {
    if (err) console.log(err);
    else {
      res.json(todos);
    }
  });
});

//finds a particular todo from the list
todoRoutes.route("/:id").get((req, res) => {
  const id = req.params.id;
  Todo.findById(id, (err, todo) => {
    res.json(todo);
  });
});

//Add a todo to the list
todoRoutes.route("/add").post((req, res) => {
  const todo = new Todo(req.body);
  todo
    .save()
    .then((todo) => {
      res.status(200).json({ todo: "todo added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new todo failed");
    });
});

//update an existing todo from the list by using its id to find it
todoRoutes.route("/:id").put((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (!todo) res.status(404).send("Data is not found");
    else {
      todo.todo_description = req.body.todo_description;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;
      todo
        .save()
        .then((todo) => {
          res.json("Todo updated");
        })
        .catch((err) => {
          res.status(400).send("Update not possible");
        });
    }
  });
});

//to delete a todo from list by using its id
todoRoutes.route("/:id").delete((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (!todo) res.status(404).send("Data is not found");
    else {
      todo
        .delete()
        .then((todo) => {
          res.json("Todo deleted successfully");
        })
        .catch((err) => {
          res.status(400).send("Deleting not possible");
        });
    }
  });
});

app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
