require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())

app.use(express.json())
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/', (request, response) => {
  response.send('home route')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    response.json(`Phonebook has info for ${count} members`)
  }).catch(error => {
    console.error(error.message);
    response.status(500).json({ error: 'Failed to get count' })
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  }).catch(error => {
    console.error(error.message)
  })
})

// app.delete('/api/persons/:id', (request, response) => {
//   const id = request.params.id

//   persons = persons.filter(person => person.id !== id)

//   response.status(204).end()
// })

// const generateId = () => {
//   const randomId = Math.floor(Math.random() * 1000)
//   return String(randomId)
// }

app.post('/api/persons', (request, response) => {
  const body = request.body

  // if (!body.name || !body.number) {
  //   return response.status(400).json({ 
  //     error: 'content missing' 
  //   })
  // } else if (persons.some(person => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: `${body.name} already in phonebook`
  //   })
  // }

  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})