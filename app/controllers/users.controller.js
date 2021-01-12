const UsersController = {}
const rp = require('request-promise')
const randomstring = require("randomstring")
const UsersModel = require('../models/users.model')
const parseResponse = require('../helpers/parse-response')
const masking = require('../helpers/mask-data')
const { generateToken, encryptPassword } = require('../lib/jwt')
const partnersApi = require('../helpers/partner-api')
const log = 'User controller'

const nJwt = require('njwt')

UsersController.validation = async (req, res, next) => {
    console.log(`├── ${log} :: User Validation`);

    try {
        let {
            key
        } = req.body


        let statusCode = 200
        let responseCode = 00
        let message = 'Validation Success'
        let acknowledge = true
        let result = null

        if (key) {
            await nJwt.verify(key, CONFIG.TOKEN_SECRET, function (err, verifiedToken) {
                if (err) {
                    res.status(200).send(
                        parseResponse(false, [], '90', `Error Verify JWT : ${err}`)
                    )
                } else {
                    const jsonToken = JSON.stringify(verifiedToken)
                    req.currentUser = JSON.parse(jsonToken)
                    username = req.currentUser.body.username
                    validator = req.currentUser.body.validator
                }
            })

            let options = [
                { key: 'AD_USERNAME', value: username },
                { key: 'VALIDATOR', value: validator }
            ]

            let userCheck = await UsersModel.getBy('*', options)

            if (userCheck.EMAIL !== undefined) {

                result = {
                    pernr: userCheck.PERNR,
                    name: userCheck.NAME,
                    username: userCheck.AD_USERNAME,
                    email: userCheck.EMAIL,
                    tipe: userCheck.ZTIPE,
                    role: userCheck.ZROLE,
                }

                res.status(statusCode).send(
                    parseResponse(acknowledge, result, responseCode, message)
                )
            } else {
                res.status(200).send(
                    parseResponse(false, [], '10', 'Token Not Valid')
                )
            }

        } else {
            res.status(200).send(
                parseResponse(false, [], '99', 'There is Authentication Token not given')
            )
        }

    } catch (error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

UsersController.logout = async (req, res, next) => {
    console.log(`├── ${log} :: User Logout`);

    try {
        let {
            key
        } = req.body

        let statusCode = 200
        let responseCode = 00
        let message = 'Logout Success'
        let acknowledge = true
        let result = null

        let username = ""

        if (key) {
            await nJwt.verify(key, CONFIG.TOKEN_SECRET, function (err, verifiedToken) {
                if (err) {
                    res.status(200).send(
                        parseResponse(false, [], '90', `Error Verify JWT : ${err}`)
                    )
                } else {
                    const jsonToken = JSON.stringify(verifiedToken)
                    req.currentUser = JSON.parse(jsonToken)
                    email = req.currentUser.body.email
                }
            })

            let userData = [{ key: 'VALIDATOR', value: "RESET" }]
            let condition = [{ key: 'EMAIL', value: email }]

            await UsersModel.save(userData, condition)

            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )
        } else {
            res.status(200).send(
                parseResponse(false, [], '99', 'There is Authentication Token not given')
            )
        }

    } catch (error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

UsersController.login = async (req, res, next) => {
    console.log(`├── ${log} :: Login User and Generate Token`);

    try {
        let {
            email,
            password
        } = req.body

        let statusCode = 200
        let responseCode = "00"
        let message = 'Login Success'
        let acknowledge = true
        let result = null

        let pwdEncrypt = await encryptPassword(password)


        // check table ms_it_personal_data
        // if ZTIPE eq L (LDAP) then check userexistLDAP ? generate token
        // else not user LDAP then cek database table ms_it_personal_data and check password encrypt
        const emailParam = email.split('@')

        if ((emailParam.length > 1) && (emailParam[1] == "pertamina.com")) {
            let where = [{ key: 'EMAIL', value: email }]
            let users_tbl = await UsersModel.getBy('PERNR, NAME, AD_USERNAME, EMAIL, ZTIPE, ZPASSWORD, ZROLE', where)

            let token = ''

            if (users_tbl.EMAIL !== undefined) {
                //check user via LDAP
                const emailParam = users_tbl.EMAIL.split('@')
                // console.log(emailParam);

                const options = {
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
                // console.log(options)
                if (ldap != null) {
                    let validatorsRandom = randomstring.generate()
                    let userData = [{ key: 'VALIDATOR', value: validatorsRandom }]
                    let condition = [{ key: 'EMAIL', value: users_tbl.EMAIL }]

                    if (ldap.Status == '00') {
                        //save validator random
                        await UsersModel.save(userData, condition)
                        let userObj = {
                            pernr: users_tbl.PERNR,
                            name: users_tbl.NAME,
                            username: users_tbl.AD_USERNAME,
                            email: users_tbl.EMAIL,
                            tipe: users_tbl.ZTIPE,
                            role: users_tbl.ZROLE,
                            validator: validatorsRandom
                        }
                        token = await generateToken(userObj)

                        result = {
                            token: token,
                            pernr: users_tbl.PERNR,
                            name: users_tbl.NAME,
                            username: users_tbl.AD_USERNAME,
                            email: users_tbl.EMAIL,
                            tipe: users_tbl.ZTIPE,
                            role: users_tbl.ZROLE,
                        }
                    } else {
                        //check user from manual lookup table on database
                        let options = [
                            { key: 'EMAIL', value: email },
                            { key: 'ZPASSWORD', value: pwdEncrypt }
                        ]
                        let userCheck = await UsersModel.getBy('PERNR, NAME, AD_USERNAME, EMAIL, IS_ACTIVE, ZTIPE, ZPASSWORD, ZROLE', options)

                        if (userCheck.EMAIL !== undefined) {
                            if (userCheck.IS_ACTIVE !== 0) {
                                //save validator random
                                await UsersModel.save(userData, condition)
                                // login success
                                let userObj = {
                                    pernr: users_tbl.PERNR,
                                    name: users_tbl.NAME,
                                    username: users_tbl.AD_USERNAME,
                                    email: users_tbl.EMAIL,
                                    is_active: users_tbl.IS_ACTIVE,
                                    tipe: users_tbl.ZTIPE,
                                    role: users_tbl.ZROLE,
                                    validator: validatorsRandom
                                }

                                token = await generateToken(userObj)

                                result = {
                                    token: token,
                                    pernr: users_tbl.PERNR,
                                    name: users_tbl.NAME,
                                    username: users_tbl.AD_USERNAME,
                                    email: users_tbl.EMAIL,
                                    is_active: users_tbl.IS_ACTIVE,
                                    tipe: users_tbl.ZTIPE,
                                    role: users_tbl.ZROLE,
                                }
                            } else {
                                // login not authorize
                                statusCode = 200
                                responseCode = '45'
                                message = 'Login Not Authorized, Account Is Nonactive'
                                acknowledge = false
                                result = null
                            }
                        } else {
                            // login not authorize
                            statusCode = 200
                            responseCode = '05'
                            message = 'Login Not Authorized, Password Incorrect'
                            acknowledge = false
                            result = null
                        }
                    }
                } else {
                    // return LDAP Service null
                    statusCode = 200
                    responseCode = '99'
                    message = 'Error return response LDAP Service'
                    acknowledge = false
                    result = null
                }
            } else if (users_tbl.EMAIL == undefined) {
                //user tidak terdaftar di email dan LDAP jadi perlu di create ke DB berdasarkan hasil LDAP
                const emailParam = users_tbl.EMAIL.split('@')
                const options = {
                    method: 'POST',
                    url: partnersApi.ldapService.login,
                    body: {
                        username: emailParam[0],
                        password: password,
                        method: 'validate'
                    },
                    json: true,
                }

                console.log(options)
                const ldap = await rp(options)

                if (ldap != null) {
                    //start proses register pekerja
                    if (ldap.Status == '00') {
                        let validatorsRandom = randomstring.generate()
                        let roleDefault = "3" //Rakyat Jelata
                        let typeLDAP = "L"

                        let data = [
                            { key: 'PERNR', value: ldap.Data.EmpNumber },
                            { key: 'NAME', value: ldap.Data.NamaLengkap },
                            { key: 'AD_USERNAME', value: ldap.Data.Email },
                            { key: 'EMAIL', value: ldap.Data.Email },
                            { key: 'ASSIGNMENT_NUMBER', value: ldap.Data.EmpNumber },
                            { key: 'COCODE', value: "2110" },
                            { key: 'IS_ACTIVE', value: "1" },
                            { key: 'ZTIPE', value: typeLDAP },
                            { key: 'ZROLE', value: roleDefault },
                            { key: 'VALIDATOR', value: validatorsRandom }
                        ]

                        //save validator random
                        await UsersModel.save(data)
                        let userObj = {
                            pernr: ldap.Data.EmpNumber,
                            name: ldap.Data.NamaLengkap,
                            username: ldap.Data.Email,
                            email: ldap.Data.Email,
                            tipe: typeLDAP,
                            role: roleDefault,
                            validator: validatorsRandom
                        }
                        token = await generateToken(userObj)

                        result = {
                            token: token,
                            pernr: ldap.Data.EmpNumber,
                            name: ldap.Data.NamaLengkap,
                            username: ldap.Data.Email,
                            email: ldap.Data.Email,
                            tipe: typeLDAP,
                            role: roleDefault,
                        }
                    }
                }
            } else {
                // login not authorize
                statusCode = 200
                responseCode = '55'
                message = 'Login Not Authorized, User not exist'
                acknowledge = false
                result = null
            }

        } else {
            result = ""
            responseCode = "05"
            message = "Email kurang lengkap. Harus dengan @pertamina.com"
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
        let options = [
            { key: 'AD_USERNAME', value: req.currentUser }
        ]

        let userData = await UsersModel.getAll('*', options)
        let userMask = await masking.maskDetilUser(userData)

        // return response
        res.status(200).send(
            parseResponse(true, userMask, '00', 'Get User Controller Success')
        )
    } catch (error) {

    }
}

UsersController.validateOK = async (req, res, next) => {
    try {
        res.status(200).send(
            parseResponse(true, [], '00', 'Validate OK')
        )
    } catch (error) {

    }
}

module.exports = UsersController