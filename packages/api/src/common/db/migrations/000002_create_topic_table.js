exports.up = async knex => {
    if (await knex.schema.hasTable('topic')) {
        return
    }

    await knex.schema.createTable('topic', table => {
        table.charset('utf8')
        table.collate('utf8_unicode_ci')
        table.increments().primary()
        table.string('name').notNullable()
        table.string('description').notNullable()
        table.timestamp('created_at')
        table.timestamp('modified_at')
    })
}

exports.down = async knex => {
    if (!(await knex.schema.hasTable('topic'))) {
        return
    }

    await knex.schema.dropTable('topic')
}
