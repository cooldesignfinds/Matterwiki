const request = require('supertest')
const test = require('ava')
const { get } = require('lodash')

const app = require('../../app')

module.exports = {
    apiClient: request(app),

    /**
     * Shorthand for adding a test API client to the context before each test
     */
    testApiSetup() {
        test.beforeEach(t => {
            t.context.apiClient = request(app)
        })
    },
    /**
     * Sets up a beforeEach block that adds apiUrl to the context.
     *
     * TODO: Cleanup crude nasty string parsing to replace variables in the string 🤮
     *
     * @param {string} apiUrl
     * @param {string} contextPart - This is the nasty string parsing part. The path of the property to get from t.context. Uses `lodash#get` to get the variable out!
     *
     * @example
     *
     * ```
     * setupApiUrl('/api/user') // t.context.apiUrl = '/api/url'
     * setupApiUrl('/api/user/{users.users1.id}') // `t.context.apiUrl` will be `'/api/user/4'`, assuming `t.context.users.users1.id` is `4`.
     * setupApiUrl('/api/user/{users.users1.id}/change-admin') // `t.context.apiUrl` will be `'/api/user/4/change-admin'`, assuming `t.context.users.users1.id` is `4`.
     * ```
     */
    setupApiUrl(apiUrl) {
        test.beforeEach(t => {
            const matches = apiUrl.match(/({[^{][^}]*})/gm) || []

            if (!matches.length) t.context.apiUrl = apiUrl
            else {
                matches.forEach(m => {
                    const path = m.replace(/[{}]/g, '')
                    t.context.apiUrl = apiUrl.replace(m, get(t.context, path))
                })
            }
        })
    },
}
