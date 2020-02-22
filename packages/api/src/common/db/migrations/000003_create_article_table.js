exports.up = async knex => {
    if (await knex.schema.hasTable('article')) {
        return
    }

    await knex.schema.createTable('article', table => {
        table.charset('utf8')
        table.collate('utf8_unicode_ci')
        table.increments().primary()
        table.string('title').notNullable()
        table.text('content').notNullable()
        table.string('change_log').notNullable()
        table
            .integer('topic_id')
            .unsigned()
            .references('topic.id')
            .notNullable()
        table
            .integer('created_by_id')
            .unsigned()
            .references('user.id')
        table
            .integer('modified_by_id')
            .unsigned()
            .references('user.id')
        table.timestamp('created_at')
        table.timestamp('modified_at')
    })
}

exports.down = async knex => {
    if (!(await knex.schema.hasTable('article'))) {
        return
    }

    await knex.schema.dropTable('article')
}
