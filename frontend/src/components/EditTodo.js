"use client"

import { useState } from "react"
import { toast } from "react-toastify"

function EditTodo({ todo, onUpdate, onCancel }) {
  const [title, setTitle] = useState(todo.title)
  const [completed, setCompleted] = useState(todo.completed)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Title cannot be empty")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, completed }),
      })

      if (!response.ok) {
        throw new Error("Failed to update todo")
      }

      const updatedTodo = await response.json()
      onUpdate(updatedTodo)
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2 items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Todo title"
          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full max-w-md"
          disabled={loading}
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="completed" className="ml-2 text-gray-700">
            Completed
          </label>
        </div>
      </div>
      <div className="flex space-x-2 justify-center">
        <button
          type="submit"
          className="px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default EditTodo
