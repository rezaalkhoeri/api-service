const SuperiorDataController       = {}
const SuperiorDataModel            = require('../models/superior.model');
const PositionDataModel            = require('../models/position.model');
const parseResponse                = require('../helpers/parse-response');
const log                          = 'Superior Data Controller';
const { generateToken, encryptPassword }    = require('../lib/jwt');

SuperiorDataController.getSuperiorDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Superior Data Controller`);

    try{
        let query = `SELECT S.POS_ID, P.POSTEXT, A.PERNR, A.NAME, A.AD_USERNAME, A.EMAIL,
        S.POS_ID_SUPERIOR, P1.POSTEXT AS POS_ID_SUPERIOR, 
        A.PERNR AS PERNR_SUPERIOR, B.NAME AS NAME_SUPERIOR, B.AD_USERNAME AS AD_USERNAME_SUPERIOR, 
        B.EMAIL AS EMAIL_SUPERIOR 
        FROM ms_rf_superior S
        LEFT JOIN ms_it_personal_data A ON S.PERNR = A.PERNR
        LEFT JOIN ms_it_personal_data B ON S.PERNR_SUPERIOR = B.PERNR
        LEFT JOIN ms_rf_position P ON S.POS_ID = P.POS_ID
        LEFT JOIN ms_rf_position P1 ON S.POS_ID_SUPERIOR = P1.POS_ID`;

        let sql = await SuperiorDataModel.QueryCustom(query);

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Superior Data Controller Success')
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

SuperiorDataController.getSuperiorByIDController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Superior Data By ID Controller`);

    try{
        let id = req.params.ID

        let query = `SELECT S.POS_ID, P.POSTEXT, A.PERNR, A.NAME, A.AD_USERNAME, A.EMAIL,
        S.POS_ID_SUPERIOR, P1.POSTEXT AS POS_ID_SUPERIOR, 
        A.PERNR AS PERNR_SUPERIOR, B.NAME AS NAME_SUPERIOR, B.AD_USERNAME AS AD_USERNAME_SUPERIOR, 
        B.EMAIL AS EMAIL_SUPERIOR 
        FROM ms_rf_superior S
        LEFT JOIN ms_it_personal_data A ON S.PERNR = A.PERNR
        LEFT JOIN ms_it_personal_data B ON S.PERNR_SUPERIOR = B.PERNR
        LEFT JOIN ms_rf_position P ON S.POS_ID = P.POS_ID
        LEFT JOIN ms_rf_position P1 ON S.POS_ID_SUPERIOR = P1.POS_ID
        WHERE A.PERNR = ` + id

        let sql = await SuperiorDataModel.QueryCustom(query)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Superior Data By ID Controller Success')
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

SuperiorDataController.postSuperiorDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Post Superior Data Controller`);

    try {
        let { action } = req.body

        if (action == 'create') {
            let { pos_id, pernr, pos_id_superior, pernr_superior } = req.body
            let where_pos = [{ key:'POS_ID', value:pos_id }]
            let pos = await PositionDataModel.getBy('*',where_pos)
            let org_id = pos.ORG_ID

            let where_pos_superior = [{ key:'POS_ID', value:pos_id_superior }]
            let pos_superior = await PositionDataModel.getBy('*',where_pos_superior)
            let org_id_superior = pos_superior.ORG_ID
            
            let data = [
                {key:'POS_ID', value: pos_id},
                {key:'ORG_ID', value: org_id},
                {key:'PERNR', value: pernr},
                {key:'POS_ID_SUPERIOR', value: pos_id_superior},
                {key:'ORG_ID_SUPERIOR', value: org_id_superior},
                {key:'PERNR_SUPERIOR', value: pernr_superior},
                {key:'IS_HEAD', value: '0'}
            ]
    
            let insert = await SuperiorDataModel.save(data)
     
            if (insert.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Insert Superior Data Controller Success')
                )
            }                
    
        } else if (action == 'update') {
            let { pernr_key, pos_id, pernr, pos_id_superior, pernr_superior } = req.body

            let where_pos = [{ key:'POS_ID', value:pos_id }]
            let pos = await PositionDataModel.getBy('*',where_pos)
            let org_id = pos.ORG_ID

            let where_pos_superior = [{ key:'POS_ID', value:pos_id_superior }]
            let pos_superior = await PositionDataModel.getBy('*',where_pos_superior)
            let org_id_superior = pos_superior.ORG_ID

            let where = [{ key : 'PERNR', value : pernr_key}]

            let data = [
                {key:'POS_ID', value: pos_id},
                {key:'ORG_ID', value: org_id},
                {key:'PERNR', value: pernr},
                {key:'POS_ID_SUPERIOR', value: pos_id_superior},
                {key:'ORG_ID_SUPERIOR', value: org_id_superior},
                {key:'PERNR_SUPERIOR', value: pernr_superior},
                {key:'IS_HEAD', value: '0'}
            ]
    
            let update = await SuperiorDataModel.save(data, where)
     
            if (update.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Update Superior Data Controller Success')
                )
            }                
            
        } else if (action == 'delete') {

            let { pernr } = req.body
            let where = [{ key : 'PERNR', value : pernr}]
            let data = await SuperiorDataModel.getBy('*', where)    
            let update = await SuperiorDataModel.delete(where)
     
            if (update.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Delete Superior Data Controller Success')
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


module.exports = SuperiorDataController
