const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

let users = [{ email: 'up734253@myport.ac.uk', roles: ['user', 'admin'] }]

function isAdmin (user) {
  return user.roles.includes('admin')
}

function isApproved (user) {
  return user.roles.length > 0
}

// Get the currently logged in user
function getCurrentLoggedIn (currentUser) {
  // See if their Gmail account is currently stored in the users array
  const foundUser = users.find(user => user.email === currentUser)
  // If no user exists in the users array, create a new one and return to its caller
  if (!foundUser) {
    const newUser = {
      email: currentUser, // Email equal to their Gmail
      roles: [], // No roles assigned upon first sign in
      requestAccess: false // No access upon first sign in
    }
    users.push(newUser)
    return newUser
  }
  return foundUser
}

// View random number
router.get('/api/random', (req, res) => {
  res.set('Content-Type', 'text/plain')
  const user = getCurrentLoggedIn(req.user.emails[0].value)
  // If the user has been approved, show the random number
  if (isApproved(user)) {
    res.send(String(Math.random())) // Must be stringified otherwise Node will think it's a HTTP Status Code
  } else {
    res.send(res.sendStatus(403))
  }
})

// View user roles
router.get('/api/user/roles', (req, res) => {
  const user = getCurrentLoggedIn(req.user.emails[0].value) // Get current user
  res.send(user.roles)
})

// View users who have requested access to the application if they are an admin, otherwise throw a 403
router.get('/api/user/request', (req, res) => {
  const user = getCurrentLoggedIn(req.user.emails[0].value) // Get current user
  if (!isAdmin(user)) res.sendStatus(403) // If not admin, 403 them
  const requested = users
    .filter(user => user.requestAccess === true)
    .map(user => user.email)
  res.send(requested)
})

// Request access to the application
router.post('/api/user/request', (req, res) => {
  const user = getCurrentLoggedIn(req.user.emails[0].value) // Get current user
  user.requestAccess = true // User has requested access
  res.sendStatus(202)
})

// Approve an authorisation request
router.post('/api/user/approve', bodyParser.text(), (req, res) => {
  const user = getCurrentLoggedIn(req.user.emails[0].value) // Get current user
  if (!isAdmin(user)) res.sendStatus(403) // If not admin, 403 them
  const approvedUser = users.find(user => user.email == req.body)
  approvedUser.roles.push('user')
  approvedUser.requestAccess = false
  res.send(approvedUser)
})

// View users if you are an admin, otherwise throw a 403
router.get('/api/users', (req, res) => {
  const user = getCurrentLoggedIn(req.user.emails[0].value) // Get current user
  if (!isAdmin(user)) res.sendStatus(403) // If not admin, 403 them
  res.send(users)
})

// Delete a user and all of their roles
router.delete('/api/user/:email', (req, res) => {
  const user = getCurrentLoggedIn(req.user.emails[0].value) // Get current user
  if (!isAdmin(user)) res.sendStatus(403) // If not admin, 403 them
  const email = req.params.email
  const newUsers = users.filter(user => user.email !== email)
  users = [].concat(newUsers)
  res.sendStatus(204)
})

module.exports = router
