"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import TodoList from "./components/TodoList"
import TodoDetail from "./components/TodoDetail"
import SummarizeButton from "./components/SummarizeButton"
import SummaryDisplay from "./components/SummaryDisplay"
import "./App.css"

function App() {
  const [summary, setSummary] = useState("")

  const handleSummaryGenerated = (generatedSummary) => {
    setSummary(generatedSummary)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-center items-center">
            <h1 className="text-2xl font-bold font-poppins">Todo Summary Assistant</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center">
          <Routes>
            <Route
              path="/"
              element={
                <div className="w-full max-w-4xl flex flex-col items-center">
                  <div className="w-full">
                    <TodoList />
                    <div className="mt-6">
                      <SummarizeButton onSummaryGenerated={handleSummaryGenerated} />
                    </div>
                  </div>
                  <div className="w-full mt-6">{summary && <SummaryDisplay summary={summary} />}</div>
                </div>
              }
            />
            <Route path="/todos/:id" element={<TodoDetail />} />
          </Routes>
          <ToastContainer position="bottom-right" />
        </main>
      </div>
    </Router>
  )
}

export default App
