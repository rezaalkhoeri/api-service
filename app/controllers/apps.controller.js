const AppDataController       = {}
const AppDataModel            = require('../models/apps.model');
const AppMappingDataModel     = require('../models/apps_mapping.model');
const parseResponse           = require('../helpers/parse-response');
const log                     = 'Apps Data Controller';
const { generateToken, encryptPassword }    = require('../lib/jwt');

AppDataController.getAppDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Application Data Controller`);

    try{
        let sql = await AppDataModel.getAll('*', []);

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get App Data Controller Success')
        )
    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

AppDataController.getAppByIDController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Application Data By ID Controller`);

    try{
        let id = req.params.ID
        let where = [{ key: 'ID', value: id }]

        let sql = await AppDataModel.getAll('*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Application Data By ID Controller Success')
        )
    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

AppDataController.postAppDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Post Application Data Controller`);

    try {

        let { action, appsname, deskripsi, url } = req.body

        if (action == "create") {
            let data = [
                {key : 'appsname', value : appsname},
                {key : 'Deskripsi', value : deskripsi},
                {key : 'url', value : url},
            ]
            
            let insert =  await AppDataModel.save(data);
    
            if (insert.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Insert Application Data Controller Success')
                )
            }                
        } else if (action == "update") {
            let { id } = req.body 
            let where = [{key:'ID', value:id}]
            let data = [
                {key : 'appsname', value : appsname},
                {key : 'Deskripsi', value : deskripsi},
                {key : 'url', value : url},
            ]
            
            let update =  await AppDataModel.save(data, where);    
            
            if (update.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Update Application Data Controller Success')
                )
            }                

        } else if (action == "delete") {
            let { id } = req.body 
            let where = [{key:'ID', value:id}]
            let data = await AppDataModel.getBy('*', where)
            let destroy =  await AppDataModel.delete(where)   
            
            if (destroy.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Delete Application Data Controller Success')
                )
            }                

        } else {
            let data = [
                {key:'response', value:'404'},
                {key:'data', value:'Request Not Found'}
            ]
            res.status(200).send(
                parseResponse(true, data, '00', 'Request Not Found')
            )
        }

    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

AppDataController.getAppMappingDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Application Mapping Data Controller`);

    try{
        let query = `SELECT user_mapping.ID, ms_it_personal_data.PERNR, ms_it_personal_data.NAME, ms_it_personal_data.AD_USERNAME,
        ms_it_personal_data.EMAIL, ms_apps.appsname, ms_apps.Deskripsi, ms_apps.url, user_mapping.STATUS
        FROM user_mapping 
        LEFT JOIN ms_it_personal_data ON ms_it_personal_data.PERNR = user_mapping.PERNR
        LEFT JOIN ms_apps ON ms_apps.ID = user_mapping.APPSID
        WHERE user_mapping.STATUS = 1`

        let sql = await AppMappingDataModel.QueryCustom(query);

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get App Mapping Data Controller Success')
        )
    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

AppDataController.getAppMappingByIDDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Application Mapping Data By ID Controller`);

    try{
        let id = req.params.ID

        let query = `SELECT user_mapping.ID, ms_it_personal_data.PERNR, ms_it_personal_data.NAME, ms_it_personal_data.AD_USERNAME,
        ms_it_personal_data.EMAIL, ms_apps.appsname, ms_apps.Deskripsi, ms_apps.url
        FROM user_mapping 
        LEFT JOIN ms_it_personal_data ON ms_it_personal_data.PERNR = user_mapping.PERNR
        LEFT JOIN ms_apps ON ms_apps.ID = user_mapping.APPSID 
        WHERE user_mapping.ID =` + id

        let sql = await AppMappingDataModel.QueryCustom(query)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Application Mapping Data By ID Controller Success')
        )
    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

AppDataController.getAppMappingByPERNRDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Application Mapping Data By PERNR Controller`);

    try{
        let id = req.params.PERNR

        let query = `SELECT user_mapping.ID, ms_it_personal_data.PERNR, ms_it_personal_data.NAME, ms_it_personal_data.AD_USERNAME,
        ms_it_personal_data.EMAIL, ms_apps.appsname, ms_apps.Deskripsi, ms_apps.url
        FROM user_mapping 
        LEFT JOIN ms_it_personal_data ON ms_it_personal_data.PERNR = user_mapping.PERNR
        LEFT JOIN ms_apps ON ms_apps.ID = user_mapping.APPSID 
        WHERE user_mapping.PERNR =` + id

        let sql = await AppMappingDataModel.QueryCustom(query)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Application Mapping Data By ID Controller Success')
        )
    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

AppDataController.getAppAllowMapping = async(req, res, next) => {
    console.log(`├── ${log} :: Get Allowed Application Mapping Data By Token`);

    try{
        let pernr = req.currentPernr
        console.log(pernr)

        let statusCode      = 200
        let responseCode    = 00
        let message         = 'Get Application Mapping Data By Nopeg Success'
        let acknowledge     = true
        let result          = null

        if (pernr !== undefined) {
                
            let query = `SELECT user_mapping.ID, ms_it_personal_data.PERNR, ms_it_personal_data.NAME, ms_it_personal_data.AD_USERNAME,
                ms_it_personal_data.EMAIL, ms_apps.appsname, ms_apps.Deskripsi, ms_apps.url
                FROM user_mapping 
                LEFT JOIN ms_it_personal_data ON ms_it_personal_data.PERNR = user_mapping.PERNR
                LEFT JOIN ms_apps ON ms_apps.ID = user_mapping.APPSID 
                WHERE user_mapping.PERNR =` + pernr

                let sql = await AppMappingDataModel.QueryCustom(query)

                // success
                res.status(statusCode).send(
                    parseResponse(acknowledge, sql, responseCode, message)
                )
        } else {
            res.status(statusCode).send(
                parseResponse(false, [], '10', 'Data PERNR not found')
            )
        }
    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

AppDataController.postAppMappingDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Post Application Mapping Data Controller`);

    try {

        let { action } = req.body

        if (action == "create") {
            let { pernr, apps_id } = req.body
            let data = [
                {key : 'PERNR', value : pernr},
                {key : 'APPSID', value : apps_id},
                {key : 'STATUS', value : '1'},
            ]
            
            let insert =  await AppMappingDataModel.save(data);
    
            if (insert.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Insert Application User Mapping Data Controller Success')
                )
            }                
        } else if (action == "update") {
            let { id, pernr, apps_id } = req.body
            let where = [{key:'ID', value:id}]
            let data = [
                {key : 'PERNR', value : pernr},
                {key : 'APPSID', value : apps_id},
            ]
            
            let update =  await AppMappingDataModel.save(data, where);    
            
            if (update.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Update Application User Mapping Data Controller Success')
                )
            }                

        } else if (action == "delete") {
            let { id } = req.body
            let where = [{key:'ID', value:id}]
            let data = [
                {key : 'STATUS', value : '0'},
            ]
            let destroy =  await AppMappingDataModel.save(data, where)   
            
            if (destroy.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Delete Application User Mapping Data Controller Success')
                )
            }                

        } else {
            let data = [
                {key:'response', value:'404'},
                {key:'data', value:'Request Not Found'}
            ]
            res.status(200).send(
                parseResponse(true, data, '00', 'Request Not Found')
            )
        }

    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

module.exports = AppDataController
