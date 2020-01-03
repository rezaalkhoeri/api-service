const CoreDB            = require('../lib/Coredb');
const AppMappingDataModel         = {}

AppMappingDataModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('user_mapping');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

AppMappingDataModel.delete = async (condition) => {
    CoreDB.setTable('user_mapping');

    return await CoreDB.delete(condition);
}

AppMappingDataModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('user_mapping');

    return await CoreDB.getBy(fields, condition, join, group);
}

AppMappingDataModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('user_mapping');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

AppMappingDataModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('user_mapping');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

AppMappingDataModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = AppMappingDataModel;
