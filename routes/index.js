const express = require('express')
const router = express.Router()

const users = [{ email: 'up734253@myport.ac.uk', roles: ['user', 'admin'] }]

function getCurrentLoggedIn (currentUser) {
  const userExists = users.find(user => user.email === currentUser)
  if (!userExists) {
    const newUser = {
      email: currentUser,
      roles: []
    }
    return newUser
  }
  return userExists
}

router.get('/api/random', (req, res) => {
  if (req.user.displayName) {
    res.send(String(Math.random())) // Must be stringified otherwise Node will think it's a HTTP Status Code
  } else {
    res.send(res.sendStatus(403))
  }

  console.log('successful authenticated request by ' + req.user.emails[0].value)
})

router.get('/api/user/roles', (req, res) => {
  const user = getCurrentLoggedIn(req.user.emails[0].value)
  res.send(user.roles)
})

router.get('/api/user/request', (req, res) => {})
router.post('/api/user/request', (req, res) => {})

router.get('/api/user/approve', (req, res) => {})

router.get('/api/users', (req, res) => {})

router.delete('/api/user/:email')

module.exports = router
