const bodyParser = require('body-parser')

module.exports = {
    URLParser: bodyParser.urlencoded({ extended: false }),
    JSONParser: bodyParser.json(),
}
