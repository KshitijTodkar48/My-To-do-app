import { useState, useEffect } from "react";
import "./App.css";
import { Button, TextField, Alert, AlertTitle } from "@mui/material";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showalert, setShowAlert] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/todos").then((response) => {
      response.json().then((data) => {
        setTodos(data);
      });
    });
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTodos(data);
      });
  };

  return (
    <div className="app">
      <NavBar />
      <div className="addTodo">
        <TextField
          fullWidth
          id="titleId"
          label="Title of to-do"
          variant="outlined"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          id="descriptionId"
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />

        {showalert && (
          <Alert
            severity="success"
            style={{
              backgroundColor: "rgb(200, 236, 200)",
              margin: "5px",
              padding: "10px 20px",
              border: "1px solid green",
            }}
          >
            <AlertTitle style={{ fontSize: "20px" }}>To-do added</AlertTitle>
          </Alert>
        )}

        <div className="addButton">
          <Button
            className="addButton"
            variant="contained"
            size="medium"
            onClick={() => {
              if (title === "") {
                alert("Please enter the title of to-do.");
                return;
              }
              fetch("http://localhost:3000/todos", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title,
                  description,
                }),
              }).then((response) =>
                response.json().then((data) => {
                  setTodos(data);
                  setTitle("");
                  setDescription("");
                  setShowAlert(true);
                  setTimeout(() => {
                    setShowAlert(false);
                  }, 2000);
                })
              );
            }}
          >
            Add to-do
          </Button>
        </div>
      </div>

      <div className="todos">
        {todos.map((todo) => (
          <TodoCard
            key={todo._id}
            title={todo.title}
            description={todo.description}
            _id={todo._id}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

function NavBar() {
  return (
    <div className="navbar">
      <div className="left">
        <div>My To-do app</div>
      </div>
      <div className="right">
        <div>To-do's</div>
        <div>About us</div>
        <div>Rate us</div>
        <div>Follow us</div>
      </div>
    </div>
  );
}

function TodoCard(props) {
  return (
    <div className="todo">
      <div className="title">{props.title}</div>
      <div className="description">{props.description}</div>
      <button onClick={() => props.handleDelete(props._id)}>Delete </button>
    </div>
  );
}

export default App;
