const { Model } = require('objection')

class UserModel extends Model {
    static get tableName() {
        return 'user'
    }

    static get modifiers() {
        return {
            listSelector(builder) {
                builder.select(
                    'name',
                    'email',
                    'about',
                    'modifiedAt',
                    'createdAt',
                )
            },
        }
    }
}

module.exports = UserModel
