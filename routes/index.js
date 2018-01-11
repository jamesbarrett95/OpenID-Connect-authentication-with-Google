const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const users = [{ email: 'up734253@myport.ac.uk', roles: ['user', 'admin'] }]

function isAdmin (user) {
  return user.roles.includes('admin')
}

function isApproved (user) {
  return user.roles.length > 0
}

function getCurrentLoggedIn (currentUser) {
  // See if their Gmail account is currently stored in the users array
  const userExists = users.find(user => user.email === currentUser)
  // If no user exists in the users array, create a new one and return to its caller
  if (!userExists) {
    const newUser = {
      email: currentUser, // Email equal to their Gmail
      roles: [], // No roles assigned upon first sign in
      requestAccess: false // No access upon first sign in
    }
    users.push(newUser)
    return newUser
  }
  return userExists
}

router.get('/api/random', (req, res) => {
  const user = getCurrentLoggedIn(req.user.emails[0].value)
  // If the user has been approved, show the random number
  if (isApproved(user)) {
    res.send(String(Math.random())) // Must be stringified otherwise Node will think it's a HTTP Status Code
  } else {
    res.send(res.sendStatus(403))
  }
})

router.get('/api/user/roles', (req, res) => {
  const user = getCurrentLoggedIn(req.user.emails[0].value) // Get current user
  res.send(user.roles)
})

// View users who have requested access to the application if they are an admin, otherwise throw a 403
// ONGOING
router.get('/api/user/request', (req, res) => {
  const user = getCurrentLoggedIn(req.user.emails[0].value) // Get current user
  if (!isAdmin(user)) res.sendStatus(403)
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

// ONGOING
router.post('/api/user/approve', bodyParser.text(), (req, res) => {
  const user = getCurrentLoggedIn(req.user.emails[0].value) // Get current user
  if (!isAdmin(user)) res.sendStatus(403)
  for(let i = 0; i < users.length; i++ ) {
    if(req.body == users[i].email) {
      users[i].roles.push('user')
      users[i].requestedAccess = false
      res.send(users[i])
      return
    }
  }
})

// View users if you are an admin, otherwise throw a 403
router.get('/api/users', (req, res) => {
  const user = getCurrentLoggedIn(req.user.emails[0].value) // Get current user
  if (!isAdmin(user)) res.sendStatus(403)
  res.send(users)
})

// TODO
router.delete('/api/user/:email')

module.exports = router
