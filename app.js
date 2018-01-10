// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' })
// Require express, body parser and routes
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const GoogleAuth = require('simple-google-openid')

// create our Express app
const app = express()

// Serve up HTML and CSS from static folder
app.use(express.static('static'))

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Google Client ID
app.use(GoogleAuth(process.env.GOOGLE_CLIENT_ID))

// return 'Not authorized' if we don't have a user
app.use('/api', GoogleAuth.guardMiddleware({ realm: 'jwt' }))

// Handle our routes after dealing with our middleware
app.use('/', routes)

// Start our app!
app.set('port', process.env.PORT || 8080)
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`)
})
