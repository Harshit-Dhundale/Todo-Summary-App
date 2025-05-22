"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { toast } from "react-toastify"

function TodoDetail() {
  const { id } = useParams()
  const [todo, setTodo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodo()
  }, [id])

  const fetchTodo = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/todos/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Todo not found")
        }
        throw new Error("Failed to fetch todo details")
      }

      const data = await response.json()
      setTodo(data)
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <svg
          className="animate-spin h-10 w-10 text-purple-600"
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
    )
  }

  if (!todo) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Todo not found</h2>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors"
        >
          Back to Todo List
        </Link>
      </div>
    )
  }

  // Format the date
  const createdDate = new Date(todo.created_at).toLocaleString()

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6 font-poppins text-center">Todo Details</h2>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0 text-center sm:text-left">{todo.title}</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                todo.completed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {todo.completed ? "Completed" : "Pending"}
            </span>
          </div>

          <div className="space-y-2 text-gray-600 text-center">
            <p>
              <span className="font-medium">ID:</span> {todo.id}
            </p>
            <p>
              <span className="font-medium">Created:</span> {createdDate}
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Back to Todo List
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TodoDetail
