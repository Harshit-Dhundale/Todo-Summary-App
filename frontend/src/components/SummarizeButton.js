"use client"

import { useState } from "react"
import { toast } from "react-toastify"

function SummarizeButton({ onSummaryGenerated }) {
  const [loading, setLoading] = useState(false)

  const handleSummarize = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/summarize", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      const data = await response.json()

      if (data.success) {
        toast.success(data.message || "Summary sent to Slack successfully!")

        
        if (data.summary) {
          onSummaryGenerated(data.summary)
        } else {
          
          onSummaryGenerated("Your todos have been summarized and sent to Slack.")
        }
      } else {
        toast.warning(data.message || "No summary was generated.")
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      <button
        onClick={handleSummarize}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-md hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Generating Summary...
          </div>
        ) : (
          "Summarize Todos & Send to Slack"
        )}
      </button>
      <p className="mt-4 text-gray-600 text-sm">
        This will generate a summary of all pending todos using Gemini AI and post it to Slack.
      </p>
    </div>
  )
}

export default SummarizeButton
