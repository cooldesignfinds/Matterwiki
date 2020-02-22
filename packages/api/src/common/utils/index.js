const Knex = require('knex')
const HttpStatus = require('http-status-codes')

const knexConfig = require('../../../knexfile')

const makeHttpError = (status, err) => ({ status, ...err })
const makeHttpBadRequest = err => ({ status: HttpStatus.BAD_REQUEST, ...err })

module.exports = {
    initDbConnection: () => Knex(knexConfig),
    logger: require('./logger'),
    validateConfig: require('./validate-config'),
    validateWrapper: require('./validate-wrapper'),

    // A class of HttpError generating helpers
    makeHttpBadRequest,
    makeHttpError,
}
