const { hasIn } = require('lodash')

/**
 * Validates environment variables
 */
module.exports = () => {
    return (
        hasIn(process.env, 'AUTH_SECRET') &&
        hasIn(process.env, 'DB_HOST') &&
        hasIn(process.env, 'DB_NAME') &&
        hasIn(process.env, 'DB_USER_NAME') &&
        hasIn(process.env, 'DB_PASSWORD') &&
        hasIn(process.env, 'NODE_ENV') &&
        hasIn(process.env, 'SERVER_HOST') &&
        hasIn(process.env, 'SERVER_PORT')
    )
}
