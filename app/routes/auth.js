const express                   = require('express')
const router                    = express.Router()
const UsersController           = require('../controllers/users.controller')

router
    .post('/login', UsersController.login)
    .post('/validate', UsersController.validation)
    .post('/logout', UsersController.logout)

module.exports = router