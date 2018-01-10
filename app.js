// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' })
// Require express, body parser and routes
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/index')

// create our Express app
const app = express()

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Handle our routes after dealing with our middleware
app.use('/', routes)

// Start our app!
app.set('port', process.env.PORT || 8080)
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`)
})
