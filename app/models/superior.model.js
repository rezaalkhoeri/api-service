const CoreDB            = require('../lib/Coredb');
const SuperiorDataModel         = {}

SuperiorDataModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('ms_rf_superior');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

SuperiorDataModel.delete = async (condition) => {
    CoreDB.setTable('ms_rf_superior');

    return await CoreDB.delete(condition);
}

SuperiorDataModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('ms_rf_superior');

    return await CoreDB.getBy(fields, condition, join, group);
}

SuperiorDataModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('ms_rf_superior');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

SuperiorDataModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('ms_rf_superior');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

SuperiorDataModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = SuperiorDataModel;
