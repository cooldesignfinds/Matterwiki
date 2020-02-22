const test = require('ava')
const Knex = require('knex')
const { transaction, Model } = require('objection')

const knexConfig = require('../../../knexfile')

async function verifyValidDbConnection(knexInstance) {
    try {
        await knexInstance.raw('select 1+1 as result')

        // there is a valid connection in the pool
        return true
    } catch (error) {
        return false
    }
}

async function runMigrations(knexInstance) {
    // rollback first!
    await knexInstance.raw('SET foreign_key_checks = 0;')
    await knexInstance.migrate.rollback({}, true)
    await knexInstance.raw('SET foreign_key_checks = 1;')

    // run migrations from scratch
    await knexInstance.migrate.latest()
}

async function initDbConnection(t) {
    try {
        const knex = Knex(knexConfig)

        // Ensure DB exists
        await verifyValidDbConnection(knex)

        // Run migrations
        await runMigrations(knex)

        // Run seed finally
        await knex.seed.run()

        t.context.knex = knex
    } catch (error) {
        console.error(error)
        t.fail(`DB setup failed: ${error.message}`)
        process.exit(1)
    }
}

async function startTransaction(t) {
    // Start transaction and feed it into objection
    const trx = await transaction.start(t.context.knex)
    Model.knex(trx)

    t.context.trx = trx
}

async function rollbackTransaction(t) {
    await t.context.trx.rollback()
}

async function destroyDbConnection(t) {
    await t.context.knex.destroy()
}

/**
 * Shorthand function that sets up AVA test hooks;
 * Use this for general DB based tests!
 *
 * @param {any} t - AVA test context
 */
async function testDbSetup() {
    test.before(initDbConnection)
    test.beforeEach(startTransaction)
    test.afterEach(rollbackTransaction)
    test.after.always(destroyDbConnection)
}

module.exports = {
    // Exported in case we wanted something custom
    initDbConnection,
    startTransaction,
    rollbackTransaction,
    destroyDbConnection,

    // Exported to reduce boilerplate
    testDbSetup,
}
