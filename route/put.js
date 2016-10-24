require('songbird')
let fs = require('fs')
let mkdirp = require('mkdirp')

async function put(req, res) {
    if (req.requestedDirectory) {
        mkdirp(req.filePath, err => {
            (err) ? res.status(500).send() : res.status(200).send()
        })
    } else {
        fs.writeFile(req.filePath, req.body, err => {
            (err) ? res.status(500).send() : res.status(200).send()
        })
    }
}

module.exports = put
