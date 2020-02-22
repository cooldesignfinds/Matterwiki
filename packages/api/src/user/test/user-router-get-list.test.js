const test = require('ava')
const HttpStatus = require('http-status-codes')

const { fetchUsers } = require('../user-utils')

const {
    testApiSetup,
    testDbSetup,
    testAuth,
    testAdminRole,
    setupApiUrl,
} = require('../../common/test-utils/index')
const { testUserSetup } = require('./user-test-utils')

testDbSetup()
testApiSetup()
testUserSetup()

setupApiUrl(`/api/user/`)

testAuth('get')
testAdminRole('get')

test('(200) list returns expected data', async t => {
    const res = await t.context.apiClient
        .get(`/api/user/`)
        .set('x-access-token', t.context.tokens.admin)

    t.is(res.status, HttpStatus.OK)
    t.is(res.body.length, await fetchUsers().resultSize())
    t.true(res.body.length > 0)
    t.deepEqual(
        Object.keys(res.body[0]).sort(),
        ['name', 'email', 'about', 'modifiedAt', 'createdAt'].sort(),
    )
    res.body.forEach(u => t.falsy(u.password))
})

test.todo('(200) default list sorted by name and in ascending order')
test.todo('(200) search filter returns expected list')
test.todo('(200) name sort filter (DESC) returns expected list')
test.todo('(200) createdAt sort filter (ASC) returns expected list')
test.todo('(200) createdAt sort filter (DESC) returns expected list')
test.todo('(200) paging filters with default filters work as expected')
test.todo('(200) paging filters with applied filters work as expected')
