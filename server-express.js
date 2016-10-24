require('songbird')
let app = require('express')()
let bodyParser = require('body-parser')
let path = require('path')

let middleware = {
    pathValidator: require('./middleware/path-validator'),
    readPathValidator: require('./middleware/read-path-validator'),
    createPathValidator: require('./middleware/create-path-validator'),
    urlFileTypeParser: require('./middleware/url-file-type-parser'),
    fileInfoHeader: require('./middleware/file-info-header')
}

let route = {
    head: require('./route/head'),
    get: require('./route/get'),
    put: require('./route/put'),
    post: require('./route/post'),
    delete: require('./route/delete')
}

function initRoutes() {
    app.head('*', middleware.readPathValidator, middleware.fileInfoHeader, route.head)

    app.get('*', middleware.urlFileTypeParser, middleware.readPathValidator, middleware.fileInfoHeader, route.get)

    app.put('*', middleware.urlFileTypeParser, middleware.createPathValidator, bodyParser.text(), route.put)

    app.post('*', middleware.urlFileTypeParser, middleware.readPathValidator, bodyParser.text(), route.post)

    app.delete('*', middleware.urlFileTypeParser, middleware.readPathValidator, route.delete)
}

module.exports = (rootPath) => {
    app.use(middleware.pathValidator(rootPath))
    initRoutes()
    return app
}
