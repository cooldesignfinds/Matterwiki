exports.seed = knex => {
    return knex('topic')
        .del()
        .then(() => {
            return knex('topic').insert([
                { name: 'uncategorised', description: `the "limbo" topic` },
                { name: 'general', description: 'knowledge for everyone' },
            ])
        })
}
