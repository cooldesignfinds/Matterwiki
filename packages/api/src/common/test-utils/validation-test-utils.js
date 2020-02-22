const { JOI_VALIDATION_ERR_CODE } = require('../constants')

/**
 * Shorthands for making validation testing easier
 */
module.exports = {
    validationTestRunner: (payloadBuilder, validator) => async (
        t,
        input,
        expected,
    ) => {
        const user = Object.assign(payloadBuilder(), input)
        const error = await validator.validate(user)
        t.deepEqual(
            {
                code: JOI_VALIDATION_ERR_CODE,
                message: expected,
            },
            error,
        )
    },
}
