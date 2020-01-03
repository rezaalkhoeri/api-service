const express                   = require('express')
const router                    = express.Router()
const { authentication }  = require('../middleware/auth.middleware')
const PositionDataController       = require('../controllers/position.controller')

router
    .all('/*', authentication)
    .get('/', PositionDataController.getPositionDataController)
    .get('/getByID/:ID', PositionDataController.getPositionByIDController)
    .post('/cud', PositionDataController.postPositionDataController)
    // .post('/update', PositionDataController.updatePositionDataController)
    // .post('/delete', PositionDataController.deletePositionDataController)
    // .post('/activate', PositionDataController.activatePositionDataController)

module.exports = router
