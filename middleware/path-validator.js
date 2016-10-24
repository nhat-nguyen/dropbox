const isValidPath = require('is-valid-path')
const path = require('path')

let error = {
    error: 'Your requested path is invalid'
}

module.exports = (rootPath) => {
    return (req, res, next) => {
        if (isValidPath(req.url)) {
            req.filePath = path.join(rootPath, req.url)
            next()
        } else {
            res.status(400).json(error)
        }
    }
}
