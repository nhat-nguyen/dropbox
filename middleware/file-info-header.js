require('songbird')
let mime = require('mime-types')
let fs = require('fs').promise

module.exports = (req, res, next) => {
    if (req.zipFolder) return next();

    fs.stat(req.filePath)
    .then(stat => {
        let type = mime.lookup(req.filePath)
        if (type) res.append('Content-Type', type)
        res.append('Content-Length', stat.size)
        next()
    })
    .catch(err => {
        res.status(505).json({
            error: 'We encountered some error while trying to read the file'
        })
    })
}
