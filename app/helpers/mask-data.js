const _         = require('lodash');
const Datas     = {}

Datas.maskDetilUser = (outputData) => {
    return new Promise(function(resolve, reject) {
        let dataOutput = outputData.map((output, i) => ({
            'nopek' 		        : output.PERNR,
            'nama' 		            : output.NAME,
            'usernameAD' 		    : output.AD_USERNAME,
            'email' 		        : output.EMAIL,
            'assignmentNo' 		    : output.ASSIGNMENT_NUMBER,
            'active' 	            : output.IS_ACTIVE,
            'role' 	                : output.ZROLE
        }));
        resolve(dataOutput);
    });
}


module.exports  = Datas