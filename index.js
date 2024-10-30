const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] :body - :response-time ms'))

const cors = require('cors')
app.use(cors())

let notes = [
    {
      "id": "1",
      "content": "HTML is easy",
      "important": true
    },
    {
      "id": "2",
      "content": "Browser can execute only JavaScript",
      "important": false
    },
    {
      "id": "3",
      "content": "GET and POST are the most important methods of HTTP protocol",
      "important": true
    },
    {
      "id": "27b4",
      "content": "Hello!!",
      "important": false
    },
    {
      "id": "5d2b",
      "content": "Hello!!",
      "important": true
    }
  ]

app.get("/", (request, response) => {
    response.send("<h1>NOTEBOOK API</h1>")
})

app.get("/api/notes", (request, response) => {
    response.json(notes)
})

app.get("/info", (request, response) => {
  const info = `Notebook has info for ${notes.length} people`
  const date = `<p>${new Date()}</p>`
  response.send(`<p>${info}</p><p>${date}</p>`)
})

app.get("/api/notes/:id", (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.important || !body.content) {
        return response.status(400).json({
            error: 'info missing'
        })
    }

    const note = {
      id: generateId(),
      content: body.content,
      important: body.important
    }

    notes = notes.concat(note)
    
    response.json(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
