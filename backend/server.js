import express from "express"
import cors from "cors"
import { createClient } from "@supabase/supabase-js"
import { GoogleGenerativeAI } from "@google/generative-ai"
import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Gemini AI setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Routes
app.get("/api/todos", async (req, res) => {
  try {
    const { data, error } = await supabase.from("todos").select("*").order("created_at", { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error("Error fetching todos:", error)
    res.status(500).json({ error: error.message })
  }
})


app.get("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase.from("todos").select("*").eq("id", id).single()

    if (error) throw error

    if (!data) {
      return res.status(404).json({ error: "Todo not found" })
    }

    res.json(data)
  } catch (error) {
    console.error("Error fetching todo:", error)
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/todos", async (req, res) => {
  try {
    const { title, completed } = req.body

    if (!title) {
      return res.status(400).json({ error: "Title is required" })
    }

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title, completed: completed || false }])
      .select()

    if (error) throw error

    res.status(201).json(data[0])
  } catch (error) {
    console.error("Error creating todo:", error)
    res.status(500).json({ error: error.message })
  }
})


app.put("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { title, completed } = req.body

    if (!title) {
      return res.status(400).json({ error: "Title is required" })
    }

    const { data, error } = await supabase.from("todos").update({ title, completed }).eq("id", id).select()

    if (error) throw error

    if (data.length === 0) {
      return res.status(404).json({ error: "Todo not found" })
    }

    res.json(data[0])
  } catch (error) {
    console.error("Error updating todo:", error)
    res.status(500).json({ error: error.message })
  }
})

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase.from("todos").delete().eq("id", id)

    if (error) throw error

    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error deleting todo:", error)
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/summarize", async (req, res) => {
  try {
    
    const { data: todos, error } = await supabase.from("todos").select("*").eq("completed", false)

    if (error) throw error

    if (!todos || todos.length === 0) {
      return res.json({
        success: false,
        message: "No pending todos to summarize.",
      })
    }


const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" })

    const todoList = todos.map((todo) => `- ${todo.title}`).join("\n")
    const prompt = `Summarize the following list of pending tasks in a concise, natural language paragraph. Suggest a logical order to complete them if possible:\n\n${todoList}`

    const result = await model.generateContent(prompt)
    const summary = result.response.text()

    // Post to Slack
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL

    if (!slackWebhookUrl) {
      return res.status(500).json({
        success: false,
        message: "Slack webhook URL not configured.",
        summary: summary, 
      })
    }

    await axios.post(slackWebhookUrl, {
      text: `*Todo Summary*\n\n${summary}\n\n*Pending Tasks (${todos.length})*\n${todoList}`,
    })

    res.json({
      success: true,
      message: "Summary generated and posted to Slack successfully!",
      summary: summary, 
    })
  } catch (error) {
    console.error("Error generating summary:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
