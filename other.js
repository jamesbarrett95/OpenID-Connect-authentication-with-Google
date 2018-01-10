require('dotenv').config({ path: 'variables.env' })
const express = require('express')
const app = express.Router()
/*
  This package provides an Express.js middleware that will take
  an ID token from the URL query (parameter id_token) or from a
  bearer token (HTTP header Authorization: Bearer TOKEN).
*/
const GoogleAuth = require('simple-google-openid')

// Google Client ID
app.use(GoogleAuth(process.env.GOOGLE_CLIENT_ID))

// return 'Not authorized' if we don't have a user
app.use('/api', GoogleAuth.guardMiddleware({ realm: 'jwt' }))

app.get('/api/random', (req, res) => {
  if (req.user.displayName) {
    res.send('Hello ' + req.user.displayName + '!')
  } else {
    res.send('Hello user without a name!')
  }

  console.log('successful authenticated request by ' + req.user.emails[0].value)
})

// Serve up HTML and CSS from static folder
app.use(express.static('static'))

// Run application on port 8080
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})

module.exports = router
