const test = require('ava')
const dream = require('dreamjs')
const { pick } = require('lodash')

const { USER_ROLES } = require('../user-constants')
const { createUser, createJwt } = require('../user-utils')

dream.customType('user-password', helper => helper.chance.word({ length: 20 }))

function makeUserData(num = 1) {
    return dream
        .schema({
            name: 'name',
            email: 'email',
            password: 'user-password',
            about: 'sentence',
        })
        .generateRnd(num)
        .output()
}

const makeLoginPayload = () => pick(makeUserData(), ['email', 'password'])
const makeUpdatePayload = () => pick(makeUserData(), ['name', 'email', 'about'])
const makePasswordUpdatePayload = () => {
    return dream
        .schema({
            currentPassword: 'user-password',
            newPassword: 'user-password',
        })
        .generateRnd(1)
        .output()
}

async function createAdmin(overrides = {}) {
    const data = Object.assign(makeUserData(), overrides)
    const fakeAdmin = await createUser(
        { ...data, role: USER_ROLES.ADMIN },
        true,
    )

    return fakeAdmin
}

async function createRegularUser(overrides = {}) {
    const data = Object.assign(makeUserData(), overrides)
    const fakeUser = await createUser({ ...data, role: USER_ROLES.USER }, true)

    return fakeUser
}

function testUserSetup() {
    test.beforeEach(async t => {
        const [adminData, user1Data, user2Data] = makeUserData(3)

        t.context.users = {
            adminData,
            user1Data,
            user2Data,
            admin: await createAdmin(adminData),
            user1: await createRegularUser(user1Data),
            user2: await createRegularUser(user2Data),
        }

        t.context.tokens = {
            admin: createJwt(t.context.users.admin),
            user1: createJwt(t.context.users.user1),
            user2: createJwt(t.context.users.user2),
        }
    })
}

module.exports = {
    makeUserData,
    makeLoginPayload,
    makeUpdatePayload,
    makePasswordUpdatePayload,
    createAdmin,
    testUserSetup,
}
