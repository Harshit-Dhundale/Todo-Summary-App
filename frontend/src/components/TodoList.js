"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import EditTodo from "./EditTodo"

function TodoList() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState("")
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/todos")
      if (!response.ok) {
        throw new Error("Failed to fetch todos")
      }
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo, completed: false }),
      })

      if (!response.ok) {
        throw new Error("Failed to add todo")
      }

      const addedTodo = await response.json()
      setTodos([...todos, addedTodo])
      setNewTodo("")
      toast.success("Todo added successfully!")
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    }
  }

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete todo")
      }

      setTodos(todos.filter((todo) => todo.id !== id))
      toast.success("Todo deleted successfully!")
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    }
  }

  const updateTodo = (updatedTodo) => {
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
    setEditingId(null)
    toast.success("Todo updated successfully!")
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6 font-poppins text-center">My Todos</h2>

      <form onSubmit={addTodo} className="flex mb-6 justify-center">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="w-full max-w-md border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white font-medium py-2 px-4 rounded-r-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Add
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <svg
            className="animate-spin h-8 w-8 text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <ul className="space-y-3 max-w-2xl mx-auto">
          {todos.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No todos yet. Add one above!</p>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className={`bg-gray-50 rounded-md p-4 border border-gray-100 transition-all ${
                  todo.completed ? "opacity-70" : ""
                }`}
              >
                {editingId === todo.id ? (
                  <EditTodo todo={todo} onUpdate={updateTodo} onCancel={() => setEditingId(null)} />
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <span
                      className={`text-gray-800 ${todo.completed ? "line-through" : ""} mb-2 sm:mb-0 text-center sm:text-left`}
                    >
                      {todo.title}
                    </span>
                    <div className="flex space-x-2">
                      <Link
                        to={`/todos/${todo.id}`}
                        className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-md hover:bg-indigo-200 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => setEditingId(todo.id)}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-md hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export default TodoList
