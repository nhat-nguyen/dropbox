require('songbird')
let fs = require('fs').promise
let path = require('path')

let errorFileNotExists = {
    error: 'Your requested file does not exist'
}

let errorFolderNotExists = {
    error: 'Your requested folder does not exist'
}

module.exports = (req, res, next) => {
    (req.url.slice(-1) === '/') ? req.requestedDirectory = true : req.requestedDirectory = false;
    (req.headers['accept'] === 'application/x-gtar') ? req.zipFolder = true : req.zipFolder = false;
    next();
}
