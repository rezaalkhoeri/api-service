const nJwt                  = require('njwt')
const { validationResult }  = require('express-validator')
const parseResponse         = require('../helpers/parse-response')
const UsersModel            = require('../models/users.model')

const AuthMiddleware        = {}
const log                   = 'Auth middleware'

AuthMiddleware.authentication = async (req, res, next) => {
    console.log(`├── ${log} :: Authentication Token`);
    const error = validationResult(req.headers)
    if (!error.isEmpty()) {
        res.status(401).send({
            message: 'There is Authentication Token not given'
        })
    }

    const { authentication } = req.headers
    let username             = ''
    let validator            = ''
    try {
        //verify jwt token
        if (authentication) {
            await nJwt.verify(authentication, CONFIG.TOKEN_SECRET, function(err, verifiedToken) {
                if(err){
                    res.status(200).send(
                        parseResponse(false, [], '90', `Error Verify JWT : ${err}`)
                    )
                }else{
                    const jsonToken = JSON.stringify(verifiedToken)
                    req.currentUser = JSON.parse(jsonToken)
                    username        = req.currentUser.body.username
                    validator       = req.currentUser.body.validator
                    pernr           = req.currentUser.body.pernr
                }
            })

            let options     = [
                { key: 'AD_USERNAME', value: username },
                { key: 'VALIDATOR', value: validator }
            ]

            let userCheck   = await UsersModel.getBy('*', options)

            if (userCheck.EMAIL !== undefined) {
                req.currentUser     = username
                req.currentPernr    = pernr
                next()
            } else {
                res.status(200).send(
                    parseResponse(false, [], '10', 'Token Not Valid')
                )
            }

        }else{
            res.status(200).send(
                parseResponse(false, [], '99', 'There is Authentication Token not given')
            )
        }

    } catch (error) {
        res.status(200).send(
            parseResponse(false, [], '98', `Error Exception auth middleware ${error}`)
        )
    }
}

module.exports = AuthMiddleware
