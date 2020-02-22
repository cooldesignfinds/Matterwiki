const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { omit } = require('lodash')

const {
    SALT_ROUNDS,
    USER_ROLES,
    TOKEN_EXPIRATION,
} = require('./user-constants')

const UserModel = require('./user-model')

/**
 * Inserts a user into the db
 *
 * @param {object} user
 * @param {string} user.name
 * @param {string} user.about
 * @param {string} user.email
 * @param {string} user.password
 * @param {string} user.role
 * @param {boolean} [fetchUser=true] - Indicates if the user must be fetched or not
 * @returns
 */
exports.createUser = async function createUser(
    { name, about, email, password, role },
    fetchUser = true,
) {
    const date = new Date()

    const inserted = await UserModel.query()[
        fetchUser ? 'insertAndFetch' : 'insert'
    ]({
        name,
        about,
        email,
        role,
        password: await bcrypt.hash(password, SALT_ROUNDS),
        modifiedAt: date,
        createdAt: date,
    })

    return inserted
}

/**
 * Updates an existing user
 *
 * @param {number} id
 * @param {object} user
 * @param {string} user.name
 * @param {string} user.about
 * @param {string} user.email
 * @returns
 */
exports.updateUserById = function updateUserById(id, { name, about, email }) {
    return UserModel.query().updateAndFetchById(id, {
        name,
        about,
        email,
        modifiedAt: new Date(),
    })
}

/**
 * Updates password for user, given the id
 *
 * @param {number} id
 * @param {string} newPassword
 * @returns
 */
exports.updatePasswordById = async function updatePasswordById(
    id,
    newPassword,
) {
    return UserModel.query().updateAndFetchById(id, {
        password: await bcrypt.hash(newPassword, SALT_ROUNDS),
        modifiedAt: new Date(),
    })
}

/**
 * "Patches" the user, does not update meta fields.
 *
 * ⚠️Use with caution, there is not a lot of validation in this fn.
 *
 * @param {number} id
 * @param {object} fields - Fields that need to be updated
 */
exports.patchUserById = function patchUserById(id, fields) {
    return UserModel.query().patchAndFetchById(id, fields)
}

/**
 * Deletes user by id
 * @param {number} id
 */
exports.deleteUserById = function deleteUserById(id) {
    return UserModel.query().deleteById(id)
}

/**
 * Gets the user by id
 * @param {number} id
 * @returns
 */
exports.fetchUserById = function fetchUserById(id) {
    return UserModel.query().findById(id)
}

/**
 * Gets the user by email
 * @param {string} email
 * @returns
 */
exports.fetchUserByEmail = async function fetchUserByEmail(email) {
    const [user] = await UserModel.query().where('email', email)
    return user
}

/**
 * Fetch users based on filters;
 * Doesn't do much, returns objection's query builder
 */
exports.fetchUsers = function fetchUsers() {
    return UserModel.query()
}

/**
 * Gets the sole admin user
 * @returns
 */
exports.fetchAdmin = async function fetchUser(i) {
    const [user] = await UserModel.query().where('role', USER_ROLES.ADMIN)
    return user
}

/**
 * Creates JSON Web Token
 * @param {object} user - User retrieved from the Db, typically without the password field
 */
exports.createJwt = function createJwt(user) {
    // Just in case it was passed in
    user = omit(user, ['password'])

    return jwt.sign(user, process.env.AUTH_SECRET, {
        expiresIn: TOKEN_EXPIRATION,
    })
}
