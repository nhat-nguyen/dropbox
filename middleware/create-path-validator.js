require('songbird')
let fs = require('fs').promise
let path = require('path')

let pathExistsError = {
    error: 'Path already exists'
}

let fileExistsError = {
    error: 'File already exists'
}

let internalError = {
    error: 'We encountered some errors. Please try again later.'
}

module.exports = (req, res, next) => {
    fs.stat(req.filePath).then((stat, err) => {
        if (stat && !err) {
            res.status(405).json(pathExistsError)
        }
    }).catch((err) => {
        if (err.code === 'ENOENT') { // no file or directory
            next()
        } else if (err.code === 'ENOTDIR')  { // file already exists at this path
            res.status(405).json(fileExistsError)
        } else {
            res.status(500).json(internalError)
        }
    })
}
