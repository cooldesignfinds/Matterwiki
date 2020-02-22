const test = require('ava')
const HttpStatus = require('http-status-codes')

const { ERRORS } = require('../../user/user-constants')

/**
 * Shorthands to include authentication and authorization tests;
 * middleware was added to the route
 */
module.exports = {
    testAuth(httpVerb) {
        test('(401) unauthorized if no token', async t => {
            const res = await t.context.apiClient[httpVerb](t.context.apiUrl)

            t.is(res.status, HttpStatus.UNAUTHORIZED)
            t.is(res.body.error.code, ERRORS.INVALID_TOKEN.code)
        })
    },
    testAdminRole(httpVerb) {
        test('(403) forbidden if not admin', async t => {
            const res = await t.context.apiClient[httpVerb](
                t.context.apiUrl,
            ).set('x-access-token', t.context.tokens.user1)

            t.is(res.status, HttpStatus.FORBIDDEN)
            t.is(res.body.error.code, ERRORS.NO_ACCESS.code)
        })
    },
}
