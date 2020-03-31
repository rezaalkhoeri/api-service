const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const AppDataController         = require('../controllers/apps.controller')

router
    .all('/*', authentication)
    .get('/', AppDataController.getAppDataController)
    .get('/getByID/:ID', AppDataController.getAppByIDController)
    .post('/crud', AppDataController.postAppDataController)

    .get('/mapping', AppDataController.getAppMappingDataController)
    .get('/mapping/:ID', AppDataController.getAppMappingByIDDataController)
    .post('/allowed', AppDataController.getAppAllowMapping)
    .get('/user_app/:PERNR', AppDataController.getAppMappingByPERNRDataController)
    .post('/mapping/crud', AppDataController.postAppMappingDataController)

    module.exports = router
