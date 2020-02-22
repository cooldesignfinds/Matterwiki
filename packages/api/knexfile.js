require('dotenv').config()

const { knexSnakeCaseMappers } = require('objection')

module.exports = {
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER_NAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: 'utf8',
        debug: process.env.DB_LOG_DEBUG === 'true',
        timezone: 'UTC',
    },
    pool: {
        min: 1,
        max: 1,
    },
    seeds: {
        directory: './src/common/db/seed/',
    },
    migrations: {
        directory: './src/common/db/migrations/',
    },

    // Convert snake_case column names to camelCase names
    ...knexSnakeCaseMappers(),
}
