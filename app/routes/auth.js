const express                   = require('express')
const router                    = express.Router()
const UsersController           = require('../controllers/users.controller')
const { authentication }  = require('../middleware/auth.middleware')

router
    .post('/login', UsersController.login)
    .post('/validate', UsersController.validation)
    .post('/logout', UsersController.logout)
    .post('/authentication', authentication, UsersController.validateOK)

module.exports = router