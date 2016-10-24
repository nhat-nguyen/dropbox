require('songbird')
let fs = require('fs').promise
let path = require('path')

let errorFileNotExists = {
    error: 'Your requested file does not exist'
}

module.exports = (req, res, next) => {
    fs.stat(req.filePath).then((stat) => {
        if ((stat.isDirectory() && req.requestedDirectory) ||
            (stat.isFile() && !req.requestedDirectory)) {
            return next()
        }

        res.status(405).send()
    }).catch((err) => {
        if (err.code === 'ENOENT') {
            res.status(405).json(errorFileNotExists)
        } else if (err.code === 'ENOTDIR') {
            res.status(405).json()
        } else {
            res.status(500).send()
        }
    })
}
