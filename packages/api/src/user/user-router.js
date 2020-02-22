const express = require('express')
const { isNil, omit } = require('lodash')
const bcrypt = require('bcryptjs')
const HttpStatus = require('http-status-codes')

const {
    bodyParser,
    checkAuth,
    checkAdminRole,
} = require('../common/middleware/index')
const { makeHttpBadRequest, makeHttpError } = require('../common/utils/index')

const {
    createUser,
    createJwt,
    fetchAdmin,
    fetchUsers,
    fetchUserById,
    fetchUserByEmail,
    updateUserById,
    updatePasswordById,
    deleteUserById,
} = require('./user-utils')
const { USER_ROLES, ERRORS } = require('./user-constants')
const {
    LoginValidator,
    UserCreateValidator,
    UserUpdateValidator,
    UserPasswordUpdateValidator,
} = require('./user-validator')

const router = express.Router()

// Anonymous routes
router.post('/admin', bodyParser.JSONParser, createAdminUser)
router.post('/login', bodyParser.JSONParser, loginUser)

// Authenticated routes
router.get('/verify', checkAuth, (req, res, next) => {
    res.status(HttpStatus.OK).end()
})

router.get('/:id', checkAuth, getUserById)

// Admin ONLY routes
const adminMiddleware = [checkAuth, checkAdminRole, bodyParser.JSONParser]

router.get('/', checkAuth, checkAdminRole, getUserList)
router.post('/', adminMiddleware, createRegularUser)
router.put('/:id', adminMiddleware, updateUser)
router.post('/:id/change-password', adminMiddleware, updateUserPassword)
router.delete('/:id', adminMiddleware, deleteUser)

async function createAdminUser(req, res, next) {
    try {
        const error = await UserCreateValidator.validate(req.body)
        if (error) return next(makeHttpBadRequest(error))

        if (!isNil(await fetchAdmin())) {
            return next(
                makeHttpError(HttpStatus.CONFLICT, ERRORS.DUPLICATE_ADMIN_USER),
            )
        }

        await createUser({ ...req.body, role: USER_ROLES.ADMIN }, false)

        res.status(HttpStatus.CREATED).end()
    } catch (error) {
        next(error)
    }
}

async function loginUser(req, res, next) {
    const wrongCredsError = makeHttpBadRequest(ERRORS.CREDS_WRONG)
    try {
        const error = await LoginValidator.validate(req.body)
        if (error) return next(makeHttpBadRequest(error))

        const { password, ...user } = await fetchUserByEmail(req.body.email)
        if (isNil(user)) return next(wrongCredsError)

        if (!(await bcrypt.compare(req.body.password, password))) {
            return next(wrongCredsError)
        }

        const payloadUser = {
            ...user,
            token: createJwt(user),
        }

        res.status(HttpStatus.OK).json(payloadUser)
    } catch (err) {
        next(wrongCredsError)
    }
}

async function createRegularUser(req, res, next) {
    try {
        const error = await UserCreateValidator.validate(req.body)
        if (error) return next(makeHttpBadRequest(error))

        let user = await fetchUserByEmail(req.body.email)
        if (!isNil(user)) {
            return next(
                makeHttpError(HttpStatus.CONFLICT, ERRORS.DUPLICATE_EMAIL),
            )
        }

        user = omit(
            await createUser({ ...req.body, role: USER_ROLES.USER }, true),
            ['password'],
        )

        res.status(HttpStatus.CREATED).json(user)
    } catch (error) {
        next(error)
    }
}

async function updateUser(req, res, next) {
    try {
        const error = await UserUpdateValidator.validate(req.body)
        if (error) return next(makeHttpBadRequest(error))

        let user = await fetchUserById(req.params.id)
        if (isNil(user)) return res.status(HttpStatus.NOT_FOUND).end()

        // If the update contains an email that already exists, do not allow to proceed!
        // Send out a 409 🔙
        const existingUsersWithEmail = await fetchUsers()
            .where('email', req.body.email)
            .whereNot('id', user.id)
        if (existingUsersWithEmail.length > 0) {
            return next(
                makeHttpError(HttpStatus.CONFLICT, ERRORS.DUPLICATE_EMAIL),
            )
        }

        user = omit(await updateUserById(user.id, req.body, true), ['password'])

        res.status(HttpStatus.OK).json(user)
    } catch (error) {
        next(error)
    }
}

async function updateUserPassword(req, res, next) {
    try {
        const error = await UserPasswordUpdateValidator.validate(req.body)
        if (error) return next(makeHttpBadRequest(error))

        const user = await fetchUserById(req.params.id)
        if (isNil(user)) return res.status(HttpStatus.NOT_FOUND).end()

        if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
            return next({
                status: HttpStatus.BAD_REQUEST,
                ...ERRORS.BAD_PASSWORD,
            })
        }

        await updatePasswordById(req.params.id, req.body.newPassword)
        res.status(HttpStatus.OK).end()
    } catch (error) {
        next(error)
    }
}

async function deleteUser(req, res, next) {
    try {
        const user = await fetchUserById(req.params.id)
        if (isNil(user)) return res.status(HttpStatus.NOT_FOUND).end()

        if (user.role === USER_ROLES.ADMIN) {
            return next({
                status: HttpStatus.METHOD_NOT_ALLOWED,
                ...ERRORS.DELETE_DEFAULT_ADMIN,
            })
        }

        await deleteUserById(req.params.id)
        res.status(HttpStatus.OK).end()
    } catch (error) {
        next(error)
    }
}

async function getUserById(req, res, next) {
    try {
        const user = await fetchUserById(req.params.id)
        if (isNil(user)) return res.status(HttpStatus.NOT_FOUND).end()

        res.status(200).json(omit(user, ['password']))
    } catch (error) {
        next(error)
    }
}

async function getUserList(req, res, next) {
    try {
        res.status(200).json(await fetchUsers().modify('listSelector'))
    } catch (error) {
        next(error)
    }
}

module.exports = router
