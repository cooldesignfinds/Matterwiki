const Joi = require('@hapi/joi')

const { validateWrapper } = require('../common/utils/index')

exports.UserCreateValidator = validateWrapper(
    Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        // TODO: Password limitations
        password: Joi.string().required(),
        about: Joi.string()
            .min(10)
            .max(255),
    }),
)

exports.UserUpdateValidator = validateWrapper(
    Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        about: Joi.string()
            .min(10)
            .max(255),
    }),
)

exports.UserPasswordUpdateValidator = validateWrapper(
    Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
    }),
)

exports.LoginValidator = validateWrapper(
    Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string().required(),
    }),
)
