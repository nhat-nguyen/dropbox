require('songbird')
let archiver = require('archiver')
let fs = require('fs')

async function get(req, res) {
    if (req.requestedDirectory && req.zipFolder) {
        archiver('zip').bulk([ { expand: true, cwd: req.filePath, src: '**' }])
                       .on('error', err => res.status(500).send())
                       .finalize()
                       .pipe(res)
    } else if (req.requestedDirectory) {
        res.send(await fs.promise.readdir(req.filePath))
    } else {
        let file = fs.createReadStream(req.filePath)
        file.pipe(res)
    }
}

module.exports = get
