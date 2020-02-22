const HttpStatus = require('http-status-codes')

// TODO separate errors.js file
// TODO remove messages from here and let front end decide based on error code
const ERRORS = {
    DUPLICATE_TOPIC: {
        status: HttpStatus.CONFLICT,
        code: 'ER_DUP_ENTRY',
        message: 'This topic already exists. Please use another name',
    },
    BAD_ARTICLE_CREATE: {
        status: HttpStatus.BAD_REQUEST,
        code: 'BAD_ARTICLE_CREATE',
        message: 'title, topicId and content are required',
    },
    BAD_ARTICLE_UPDATE: {
        status: HttpStatus.BAD_REQUEST,
        code: 'BAD_ARTICLE_UPDATEE',
        message: 'title, topicId, change_log and content are required',
    },
    NOT_FOUND: {
        status: HttpStatus.NOT_FOUND,
        code: 'NOT_FOUND',
        message: 'Resource was not found',
    },
    DELETE_DEFAULT_TOPIC: {
        status: HttpStatus.METHOD_NOT_ALLOWED,
        code: 'DELETE_DEFAULT_TOPIC',
        message: 'Can not delete default topic!',
    },
}

module.exports = {
    DEFAULT_CHANGELOG_MESSAGE: 'Another drop in the ocean of knowledge',
    JOI_VALIDATION_ERR_CODE: 'JOI_VALIDATION_ERR',
    ARTICLE_HISTORY_TYPES: {
        CREATE: 'CREATE',
        UPDATE: 'UPDATE',
        DELETE: 'DELETE',
    },
    RESULT_LIMITS: {
        ARTICLES: 10,
        ARCHIVES: 10,
        TOPICS: 10,
        USERS: 10,
    },
    ERRORS,
}
