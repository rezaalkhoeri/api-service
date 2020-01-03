const CoreDB            = require('../lib/Coredb');
const PositionDataModel         = {}

PositionDataModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('ms_rf_position');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

PositionDataModel.delete = async (condition) => {
    CoreDB.setTable('ms_rf_position');

    return await CoreDB.delete(condition);
}

PositionDataModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('ms_rf_position');

    return await CoreDB.getBy(fields, condition, join, group);
}

PositionDataModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('ms_rf_position');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

PositionDataModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('ms_rf_position');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

PositionDataModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = PositionDataModel;
