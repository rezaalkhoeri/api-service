const PositionDataController       = {}
const PositionDataModel            = require('../models/position.model');
const parseResponse                = require('../helpers/parse-response');
const log                          = 'Position Data Controller';
const { generateToken, encryptPassword }    = require('../lib/jwt');

PositionDataController.getPositionDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Position Data Controller`);

    try{
        let sql = await PositionDataModel.getAll('*', []);

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Position Data Controller Success')
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

PositionDataController.getPositionByIDController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Position Data By ID Controller`);

    try{
        let id = req.params.ID
        let where = [{ key: 'POS_ID', value: id }]

        let sql = await PositionDataModel.getBy('*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Position Data By ID Controller Success')
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

PositionDataController.postPositionDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Post Position Data Controller`);

    try {

        let {action, org_id, orgtext, postext, costcenter } = req.body

        if (action == "create") {

            let max = await PositionDataModel.QueryCustom('SELECT MAX(POS_ID) AS max_id FROM ms_rf_position');
            let value =  max.rows[0].max_id;

            let number = value.substr(3,10)
            let angka = parseInt(number)
            let n = angka + 1

            let output = [], padded;
            for (i=n; i<=n; i++) {
                padded = ('00000'+i).slice(-10);
                output.push(padded);
            }  
            let pos_id = 'PDC'+output

            let data = [
                {key : 'POS_ID', value : pos_id},
                {key : 'ORG_ID', value : org_id},
                {key : 'ORGTEXT', value : orgtext},
                {key : 'POSTEXT', value : postext},
                {key : 'COSTCENTER', value : costcenter},
            ]
            
            let insert =  await PositionDataModel.save(data);
    
            if (insert.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Insert Position Data Controller Success')
                )
            }                
        } else if (action == "update") {
            let { pos_id } = req.body 
            let where = [{key : 'POS_ID', value : pos_id}]
            let data = [
                {key : 'ORG_ID', value : org_id},
                {key : 'ORGTEXT', value : orgtext},
                {key : 'POSTEXT', value : postext},
                {key : 'COSTCENTER', value : costcenter},
            ]
            
            let update =  await PositionDataModel.save(data, where);    
            
            if (update.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Update Position Data Controller Success')
                )
            }                

        } else if (action == "delete") {
            let { pos_id } = req.body 
            let where = [{key : 'POS_ID', value : pos_id}]
            let data = await PositionDataModel.getBy('*', where)
            let destroy =  await PositionDataModel.delete(where)   
            
            if (destroy.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Delete Position Data Controller Success')
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


module.exports = PositionDataController
