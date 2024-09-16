import React, { useState, useEffect } from "react";
import axios from "axios";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  // Fetch Todos from the backend when component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/todos')
        .then((response) => {
          setTodos(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the todos!", error);
        });
  }, []);

  const addTodo = (todo) => {
    axios.post('http://localhost:5000/todos', { task: todo })
        .then((response) => {
          setTodos([...todos, response.data]);
        })
        .catch((error) => {
          console.error("There was an error adding the todo!", error);
        });
  }

  const deleteTodo = (id) => {
      console.log("Deleting todo with id:", id);  // Log the id being deleted
    axios.delete(`http://localhost:5000/todos/${id}`)
        .then(() => {
          setTodos(todos.filter((todo) => todo._id !== id));
        })
        .catch((error) => {
          console.error("There was an error deleting the todo!", error);
        });
  }

  const toggleComplete = (id, completed) => {
    axios.put(`http://localhost:5000/todos/${id}`, { completed })
        .then((response) => {
          setTodos(todos.map((todo) =>
              todo._id === id ? { ...todo, completed: response.data.completed } : todo
          ));
        })
        .catch((error) => {
          console.error("There was an error updating the todo!", error);
        });
  }

    const editTodo = (id, task) => {
        console.log("Editing Todo with ID:", id, "and Task:", task);
        axios.put(`http://localhost:5000/todos/${id}`, { task })
            .then((response) => {
                setTodos(todos.map((todo) =>
                    todo._id === id ? { ...todo, task: response.data.task,  isEditing: false  } : todo
                ));
            })
            .catch((error) => {
                console.error("There was an error editing the todo!", error);
            });
    };


    return (
      <div className="TodoWrapper">
        <h1>Get Things Done!</h1>
        <TodoForm addTodo={addTodo} />
        {/* display todos */}
        {todos.map((todo) =>
            todo.isEditing ? (
                <EditTodoForm editTodo={editTodo} task={todo} key={todo._id} />
            ) : (
                <Todo
                    key={todo._id}
                    task={todo}
                    deleteTodo={deleteTodo}
                    editTodo={() => setTodos(todos.map((t) => t._id === todo._id ? { ...t, isEditing: true } : t))}
                    toggleComplete={() => toggleComplete(todo._id, !todo.completed)}
                />
            )
        )}
      </div>
  );
};