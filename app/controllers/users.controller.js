const UsersController                       = {}
const rp                                    = require('request-promise')
const randomstring                          = require("randomstring")
const UsersModel                            = require('../models/users.model')
const parseResponse                         = require('../helpers/parse-response')
const { generateToken, encryptPassword }    = require('../lib/jwt')
const partnersApi                           = require('../helpers/partner-api')
const log                                   = 'User controller'

UsersController.login = async(req, res, next) => {
    console.log(`├── ${log} :: Login User and Generate Token`);

    try {
        let {
            username,
            password
        } = req.body

        let statusCode      = 200
        let responseCode    = 00
        let message         = 'Login Success'
        let acknowledge     = true
        let result          = null

        let pwdEncrypt      = await encryptPassword(password)


        // check table ms_it_personal_data
        // if ZTIPE eq L (LDAP) then check userexistLDAP ? generate token
        // else not user LDAP then cek database table ms_it_personal_data and check password encrypt

        let where       = [{ key: 'AD_USERNAME', value: username }]
        let users_tbl   = await UsersModel.getBy('PERNR, NAME, AD_USERNAME, EMAIL, ZTIPE, ZPASSWORD', where)

        let token       = ''

        if (users_tbl.EMAIL !== undefined) {
            //check user via LDAP
            const emailParam    = users_tbl.EMAIL.split('@')
            const options       = {
                method: 'POST',
                url: partnersApi.ldapService.login,
                body: {
                    username: emailParam[0],
                    password: password,
                    method: 'login'
                },
                json: true,
            }

            const ldap = await rp(options)

            if (ldap != null) {
                let validatorsRandom = randomstring.generate()
                let userData         = [{ key: 'VALIDATOR', value : validatorsRandom }]
                let condition        = [{ key: 'AD_USERNAME', value: users_tbl.AD_USERNAME }]

                if (ldap.Status == '00') {
                    //save validator random
                    await UsersModel.save(userData, condition)
                    let userObj = {
                        pernr: users_tbl.PERNR,
                        name: users_tbl.NAME,
                        username: users_tbl.AD_USERNAME,
                        email: users_tbl.EMAIL,
                        tipe: users_tbl.ZTIPE,
                        validator: validatorsRandom
                    }
                    token = await generateToken(userObj)

                    result = {
                        token: token,
                        email: users_tbl.EMAIL,
                        username: users_tbl.AD_USERNAME,
                        pernr: users_tbl.PERNR,
                        name: users_tbl.NAME
                    }
                } else {
                    //check user from manual lookup table on database
                    let options     = [
                                        { key: 'AD_USERNAME', value: username },
                                        { key: 'ZPASSWORD', value: pwdEncrypt }
                                    ]
                    let userCheck   = await UsersModel.getBy('PERNR, NAME, AD_USERNAME, EMAIL, ZTIPE, ZPASSWORD', options)

                    if (userCheck.EMAIL !== undefined) {
                        //save validator random
                        await UsersModel.save(userData, condition)
                        // login success
                        let userObj = {
                            pernr: userCheck.PERNR,
                            name: userCheck.NAME,
                            username: userCheck.AD_USERNAME,
                            email: userCheck.EMAIL,
                            tipe: userCheck.ZTIPE,
                            validator: validatorsRandom
                        }
                        token = await generateToken(userObj)

                        result = {
                            token: token,
                            email: users_tbl.EMAIL,
                            username: users_tbl.AD_USERNAME,
                            pernr: users_tbl.PERNR,
                            name: users_tbl.NAME
                        }
                    } else {
                        // login not authorize
                        statusCode      = 400
                        responseCode    = '05'
                        message         = 'Login Not Authorized, Password Incorrect'
                        acknowledge     = false
                        result          = null
                    }
                }
            } else {
                // return LDAP Service null
                statusCode      = 400
                responseCode    = '99'
                message         = 'Error return response LDAP Service'
                acknowledge     = false
                result          = null
            }
        } else {
            // login not authorize
            statusCode      = 400
            responseCode    = '05'
            message         = 'Login Not Authorized, User not exist'
            acknowledge     = false
            result          = null
        }

        // return response
        res.status(statusCode).send(
            parseResponse(acknowledge, result, responseCode, message)
        )
    } catch (error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

UsersController.getUserDetail = async (req, res, next) => {
    try {
        const { currentUser : { body : { email : email } } } = req
        let options     = [
            { key: 'EMAIL', value: email }
        ]
        let userCheck   = await UsersModel.getBy('*', options)

        // return response
        res.status(200).send(
            parseResponse(true, userCheck, '00', 'Get User Controller Success')
        )
    } catch(error) {

    }
}

module.exports = UsersController
