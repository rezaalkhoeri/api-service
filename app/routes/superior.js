const express                   = require('express')
const router                    = express.Router()
const { authentication }  = require('../middleware/auth.middleware')
const SuperiorDataController       = require('../controllers/superior.controller')

router
    .all('/*', authentication)
    .get('/', SuperiorDataController.getSuperiorDataController)
    .get('/getByID/:ID', SuperiorDataController.getSuperiorByIDController)
    .post('/cud', SuperiorDataController.postSuperiorDataController)
    // .post('/update', SuperiorDataController.updateSuperiorDataController)
    // .post('/delete', SuperiorDataController.deleteSuperiorDataController)
    // .post('/activate', SuperiorDataController.activateSuperiorDataController)

module.exports = router
